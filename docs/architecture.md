# Architecture & Auth

## Data flow

```
IIQ XML export ──► ingest/sailpoint_iiq.normalize_xml ──┐
                                                         ├─► iato/cli.collect ─► JSON (stdout)
Entra snapshot JSON ──► _load_json ─────────────────────┤
  or                                                     │
Microsoft Graph ──► collectors/azure/entra_snapshot ────┘

accounts[] ──► policies/ac/*.rego (data.<package>.deny) ──► PASS / FAIL
```

Each source is kept under its own key in `sources`. SailPoint objects are not merged with Entra accounts.

## Entra authentication

| Item | Value (from `entra_snapshot.py`) |
|---|---|
| Credential | Bearer token read from environment variable `MS_GRAPH_TOKEN` |
| Tenant label | `AZURE_TENANT_ID` (optional, copied into output) |
| API root | `https://graph.microsoft.com/v1.0` |
| Token egress guard | Requests refused unless scheme is `https`, host is `graph.microsoft.com`, path starts `/v1.0/` |
| Token storage | Not persisted by the collector |

The collector does not acquire tokens itself. Certificate and workload-identity flows described in the repository README are not implemented in code.

## Graph endpoints called

| Endpoint | `$select` / filter | Purpose |
|---|---|---|
| `/roleManagement/directory/roleDefinitions` | `isPrivileged eq true` | Privileged role IDs |
| `/roleManagement/directory/roleAssignmentScheduleInstances` | `principalId,roleDefinitionId,assignmentType` | Active and standing (`Assigned`) access |
| `/roleManagement/directory/roleEligibilityScheduleInstances` | `principalId,roleDefinitionId` | PIM-eligible access |
| `/groups/{id}/transitiveMembers` | `id,displayName,userPrincipalName,appId,servicePrincipalType` | Expand role-assigned groups |
| `/servicePrincipals/{id}` | `id,displayName,appId,servicePrincipalType` | Service principal details |
| `/users` | `id,userPrincipalName,displayName,accountEnabled` | User inventory |
| `/users/{id}/authentication/methods` | — | MFA registration (any non-password method) |
| `/identity/conditionalAccess/policies` | — | Conditional Access policies (raw) |

Paging follows `@odata.nextLink`.

## Resilience

| Behaviour | Value |
|---|---|
| Retries | Up to `MAX_RETRIES = 5` on HTTP 429, 5xx, and `URLError` |
| Backoff | `Retry-After` (seconds or HTTP date), else `2**attempt` + jitter |
| Max delay | `MAX_RETRY_DELAY_SECONDS = 60` |
| Request timeout | 60 s |
| MFA lookups | `ThreadPoolExecutor(max_workers=8)` |
| Failure mode | Fails closed: any terminal error aborts; no partial snapshot is emitted |

## Privilege model

| Field | Derived from |
|---|---|
| `privileged` | Active or eligible assignment to a role with `isPrivileged == true` |
| `eligible_privileged_access` | Eligibility schedule instance on a privileged role |
| `standing_privileged_access` | Assignment instance with `assignmentType == "Assigned"` (activated PIM is not standing) |
| `mfa_registered` / `mfa_enabled` | At least one non-password authentication method registered |
| `mfa_enforcement_evaluated` | Always `false`: Conditional Access enforcement is not evaluated |

## SailPoint IIQ parsing

| Control | Implementation |
|---|---|
| Size limit | `MAX_XML_BYTES = 10 * 1024 * 1024`, checked before parsing |
| DOCTYPE / entities | Rejected if `<!DOCTYPE` or `<!ENTITY` appears (case-insensitive) |
| Root element | Must be `<sailpoint>` |
| Extracted types | `Rule`, `TaskDefinition`, `EmailTemplate` |
| BeanShell | Never evaluated; script bodies are not copied to output |
| Ordering | Sorted by `(object_type, name, id)` for stable output |

## AWS IAM collector (standalone)

Uses `boto3` with the default credential chain. Marks a user `privileged` when `arn:aws:iam::aws:policy/AdministratorAccess` is attached directly or via a group; `mfa_enabled` when any MFA device exists. Also records the account password policy (`null` on `NoSuchEntity`).
