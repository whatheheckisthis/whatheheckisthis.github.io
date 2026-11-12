# Overview

IATO is a read-only collector and policy harness. It normalises SailPoint IdentityIQ (IIQ) XML exports and Microsoft Entra ID snapshots into one JSON document, then evaluates access-control assertions with Rego policies.

Source: [`whatheheckisthis/Intent-to-Auditable-Trust-Object-Index`](https://github.com/whatheheckisthis/Intent-to-Auditable-Trust-Object-Index)

## Implementation status

Status is taken from the code and `docs/COMPLIANCE_CROSSWALK.csv` on `main`.

| Component | Path | Status |
|---|---|---|
| Multi-source CLI | `iato/cli.py` | Implemented (Python) |
| SailPoint IIQ XML normaliser | `ingest/sailpoint_iiq.py` | Implemented |
| Entra ID live collector | `collectors/azure/entra_snapshot.py` | Implemented |
| AWS IAM collector | `collectors/aws/iam_snapshot.py` | Implemented, standalone (not wired into the CLI) |
| Rego policies | `policies/ac/IATO-AC-012.rego`, `IATO-AC-013.rego` | Implemented |
| AI governance / backup policies | `policies/ai/`, `policies/bk/` | Empty |
| Crosswalk controls | `docs/COMPLIANCE_CROSSWALK.csv` | 2 implemented, 38 planned |
| Container image | `Containerfile` | Implemented (`python:3.12-slim`) |
| Kubernetes manifests | — | Not present in the repository |

## Repository layout

```
.
├── Containerfile
├── iato/cli.py                       # multi-source entry point
├── ingest/sailpoint_iiq.py           # IIQ XML normaliser
├── collectors/
│   ├── azure/entra_snapshot.py       # Microsoft Graph collector
│   └── aws/iam_snapshot.py           # boto3 IAM collector
├── policies/ac/                      # Rego controls
├── docs/
│   ├── COMPLIANCE_CROSSWALK.csv
│   └── podman-multisource.md
└── test/
    ├── unit/                         # unittest + Rego unit tests
    ├── mutations/                    # PASS/FAIL fixtures + manifest
    └── run_tests.py                  # regopy mutation runner
```

## Implemented controls

| Control | Title | Denies when | NZISM | Essential Eight | ISO 27001 | SOC 2 |
|---|---|---|---|---|---|---|
| IATO-AC-012 | MFA for privileged accounts | `privileged == true` and `mfa_enabled != true` | Multi-factor authentication | Multi-factor Authentication - ML3 | A.5.17; A.8.5 | CC6.1; CC6.6 |
| IATO-AC-013 | Standing privileged access elimination | `privileged == true` and `standing_privileged_access == true` | Privileged access management | Restrict Administrative Privileges - ML3 | A.5.15; A.5.18 | CC6.2; CC6.3 |

Framework tags are crosswalk indicators and require assessor validation.

## Quick start

```sh
python -m unittest discover -s test/unit     # 13 tests
pip install regopy && python test/run_tests.py   # mutation fixtures
python -m iato.cli --sailpoint-xml input/iiq-export.xml --entra-json input/entra-snapshot.json
```

## Crosswalk coverage

| Domain | Controls |
|---|---|
| Access Control | 13 |
| Configuration Management | 9 |
| AI Governance | 6 |
| Backup and Recovery | 4 |
| Incident Management | 4 |
| Supply Chain Integrity | 4 |
