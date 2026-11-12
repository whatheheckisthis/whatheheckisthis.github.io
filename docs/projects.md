# Projects

Tools that turn access controls into evidence.

## IAM Control Evaluation Framework

<p class="meta">2026–present · Self-directed</p>

A .NET 8 tool that ingests identity governance data from SailPoint IdentityIQ exports and Microsoft Entra ID (via Microsoft Graph or offline snapshot), and normalises access schemas across sources.

It runs RBAC control assertions for separation of duties, privileged access and migration drift, producing auditable compliance evidence as normalised JSON.

Authenticates with certificates or Kubernetes workload identity; read-only collection; never accepts secrets as arguments.

<p class="tags"><span>C# / .NET 8</span><span>SailPoint IdentityIQ</span><span>Microsoft Graph</span><span>Separation of Duties</span><span>Podman</span><span>Kubernetes</span></p>

## Identity Assurance Framework

<p class="meta">2026–present · Self-directed</p>

A structured framework mapping control behaviour across Microsoft Entra ID and hybrid Active Directory, modelling authentication and authorisation states as audit-ready artefacts using SAML, OIDC, OAuth 2.0 and ABAC.

Policy validation with Azure Policy and OPA/Conftest.

<p class="tags"><span>Microsoft Entra ID</span><span>Hybrid Identity</span><span>ABAC</span><span>Azure Policy</span></p>

[View on GitHub](https://github.com/whatheheckisthis/Intent-to-Auditable-Trust-Object){ .md-button }
