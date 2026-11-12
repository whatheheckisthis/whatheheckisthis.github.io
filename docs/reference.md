# CLI & Schema Reference

## `iato.cli`

```
python -m iato.cli [--sailpoint-xml PATH] [--entra-json PATH | --live-entra]
```

| Flag | Type | Description |
|---|---|---|
| `--sailpoint-xml` | path | Read-only IIQ XML export |
| `--entra-json` | path | Previously collected Entra JSON snapshot (must be a JSON object) |
| `--live-entra` | switch | Collect a live read-only Entra snapshot (requires `MS_GRAPH_TOKEN`) |
| `-h`, `--help` | switch | Print usage |

Rules:

- At least one of the three source flags is required.
- `--entra-json` and `--live-entra` are mutually exclusive.
- JSON goes to stdout (`sort_keys=True`, `indent=2`). Errors go to stderr prefixed `iato collection failed:`.

| Exit code | Meaning |
|---|---|
| `0` | Success |
| `2` | `OSError`, `ValueError`, or `KeyError` (bad arguments, rejected XML, unreadable file, missing `MS_GRAPH_TOKEN`) |

## `ingest.sailpoint_iiq`

```
python -m ingest.sailpoint_iiq XML_FILE
```

Exit `0` on success, `2` on rejection (`sailpoint ingestion failed:` on stderr).

## `collectors.azure.entra_snapshot` / `collectors.aws.iam_snapshot`

```
MS_GRAPH_TOKEN=... python -m collectors.azure.entra_snapshot
python -m collectors.aws.iam_snapshot
```

Both write compact JSON (`sort_keys=True`) to stdout.

## Combined output (`schema_version` `1.0`)

```json
{
  "schema_version": "1.0",
  "sources": {
    "sailpoint_iiq": {
      "source": "sailpoint_iiq_xml",
      "objects": [
        {"object_type": "TaskDefinition", "name": "...", "id": "...", "description": "...", "enabled": "true"}
      ]
    },
    "entra": { "...": "Entra snapshot, below" }
  }
}
```

`enabled` appears only on `TaskDefinition` and is the raw attribute value (or `null`).

## Entra snapshot

| Key | Type |
|---|---|
| `collected_at` | ISO 8601 UTC (`Z`) |
| `tenant_id` | string |
| `accounts[]` | users, below |
| `service_principals[]` | privileged service principals |
| `group_assignments[]` | `group_id`, `active`, `standing`, `eligible` |
| `conditional_access[]` | raw Graph policy objects |
| `mfa_enforcement_evaluated` | `false` |

### `accounts[]`

| Field | Type | Notes |
|---|---|---|
| `id` | string | UPN, else object ID |
| `object_id` | string | Entra object ID |
| `display_name` | string | |
| `provider` | string | `azure_entra` |
| `principal_type` | string | `user` |
| `account_enabled` | bool | |
| `privileged` | bool | active or eligible privileged role |
| `eligible_privileged_access` | bool | |
| `standing_privileged_access` | bool | |
| `mfa_registered` | bool | registration only |
| `mfa_enabled` | bool | backward-compatible alias of `mfa_registered` |

### `service_principals[]`

`id`, `display_name`, `app_id`, `provider` (`azure_entra`), `principal_type` (`servicePrincipal`), `privileged`, `eligible_privileged_access`, `standing_privileged_access`, `mfa_registered` (`null`).

## AWS IAM snapshot

| Key | Notes |
|---|---|
| `collected_at` | ISO 8601 UTC |
| `account_id` | from `sts.get_caller_identity()` |
| `accounts[]` | `id`, `provider` (`aws_iam`), `privileged`, `mfa_enabled`, `standing_privileged_access` |
| `password_policy` | object or `null` |

## Rego policies

| Package | File | Rule |
|---|---|---|
| `iato.ac.iato_ac_012` | `policies/ac/IATO-AC-012.rego` | `deny` per `accounts[]` with `privileged == true` and `mfa_enabled != true` |
| `iato.ac.iato_ac_013` | `policies/ac/IATO-AC-013.rego` | `deny` per `accounts[]` with `privileged == true` and `standing_privileged_access == true` |

Both use `import rego.v1`. Policies read `input.accounts` directly, so evaluate them against a collector snapshot, not the combined CLI document.

## Tests

| Command | Scope |
|---|---|
| `python -m unittest discover -s test/unit` | Python unit tests (13) |
| `python test/run_tests.py` | Mutation fixtures in `test/mutations/mutation-manifest.json` via `regopy`; exit `1` on mismatch |
