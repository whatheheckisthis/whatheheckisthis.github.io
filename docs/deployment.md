# Deployment & Hardening

## Container image

`Containerfile`:

```dockerfile
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1
WORKDIR /app
COPY collectors/ ./collectors/
COPY ingest/ ./ingest/
COPY iato/ ./iato/
USER 10001:10001
ENTRYPOINT ["python", "-m", "iato.cli"]
```

| Property | Value |
|---|---|
| Base | `python:3.12-slim` |
| User | `10001:10001` (non-root) |
| Credentials in image | None |
| Third-party packages | None installed (`boto3` is not in the image; the AWS collector is not available in the container) |

```sh
podman build -t iato:local -f Containerfile .
```

## Offline run

No network; inputs mounted read-only.

```sh
mkdir -p input output
podman run --rm --read-only --network=none \
  --cap-drop=ALL --security-opt=no-new-privileges \
  --userns=keep-id \
  --volume "$PWD/input:/input:ro,Z" \
  iato:local \
  --sailpoint-xml /input/iiq-export.xml \
  --entra-json /input/entra-snapshot.json \
  > output/combined.json
```

Omit `,Z` where SELinux labelling does not apply.

## Live Entra run

The collector reads the token from the `MS_GRAPH_TOKEN` environment variable. Inject it from a Podman secret so it never appears on the command line or in shell history.

```sh
podman secret create ms-graph-token ./ms-graph-token.txt
podman run --rm --read-only \
  --cap-drop=ALL --security-opt=no-new-privileges \
  --userns=keep-id \
  --secret ms-graph-token,type=env,target=MS_GRAPH_TOKEN \
  --env AZURE_TENANT_ID \
  --volume "$PWD/input:/input:ro,Z" \
  iato:local \
  --sailpoint-xml /input/iiq-export.xml \
  --live-entra \
  > output/combined.json
```

`--env AZURE_TENANT_ID` passes the host value without writing it on the command line.

## Graph access

The token needs read access to the endpoints listed in [Architecture & Auth](architecture.md#graph-endpoints-called). Grant application permissions with admin consent and nothing broader.

## Hardening checklist

| Control | Where enforced |
|---|---|
| Non-root runtime | `USER 10001:10001` in `Containerfile` |
| Read-only root filesystem | `podman run --read-only` |
| No capabilities | `--cap-drop=ALL` |
| No privilege escalation | `--security-opt=no-new-privileges` |
| No network for offline runs | `--network=none` |
| Read-only inputs | `:ro` volume mounts |
| Token egress restricted to Graph | `_validate_graph_url` |
| XXE / entity expansion blocked | `normalize_xml` rejects `<!DOCTYPE` and `<!ENTITY` |
| Oversized input rejected | 10 MiB check before parsing |
| BeanShell never executed | `ingest/sailpoint_iiq.py` extracts metadata only |
| No partial snapshots | Collector aborts on any terminal Graph error |

## Handling output

- Output contains directory metadata (UPNs, object IDs, role state). Treat files and logs as sensitive.
- Treat IIQ exports as sensitive configuration.
- Never put tokens in ConfigMaps, XML input, images, or arguments.

## Repository hygiene

Keep these out of version control:

```
input/*
output/*
*.pem
*.key
*.pfx
ms-graph-token.txt
```

If a secret is committed, rotate it and purge it from history.

## Kubernetes

No Kubernetes manifests exist in the repository. Add them under `k8s/` and document them here (see `DOCS_MAINTENANCE.md`).
