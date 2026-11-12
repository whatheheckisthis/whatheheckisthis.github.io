Any commit that changes CLI flags or exit codes (`iato/cli.py`, `ingest/sailpoint_iiq.py`) must update `docs/reference.md` in the same PR.
Any commit that changes output schemas, collector fields, Graph endpoints, or Rego policies must update `docs/reference.md` and `docs/architecture.md` in the same PR.
Any commit that changes the `Containerfile`, Podman run flags, or Kubernetes manifests must update `docs/deployment.md` in the same PR.
