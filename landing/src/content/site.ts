export const SITE = {
  name: "Dhruv Setty",
  positioning: "Identity Engineer. IGA and IAM control assurance.",
  url: "https://whatheheckisthis.github.io",
  description:
    "Dhruv Setty, Identity Engineer in New Zealand. IGA and IAM control assurance across hybrid Entra ID and Active Directory.",
  contact: [
    { label: "Email", text: "itsdhruvsetty@gmail.com", href: "mailto:itsdhruvsetty@gmail.com" },
    { label: "GitHub", text: "github.com/whatheheckisthis", href: "https://github.com/whatheheckisthis" },
    { label: "LinkedIn", text: "linkedin.com/in/its-dhruv-setty", href: "https://www.linkedin.com/in/its-dhruv-setty" },
  ],
  // Existing MkDocs pages, served from the same site. Plain links, not router links.
  docs: [
    { text: "Overview", href: "/overview/" },
    { text: "Architecture & Auth", href: "/architecture/" },
    { text: "CLI & Schema Reference", href: "/reference/" },
    { text: "Deployment & Hardening", href: "/deployment/" },
  ],
} as const;

// Wording taken from the existing docs Overview page. Keep it in sync with docs/overview.md.
export const FEATURED = {
  name: "IĀTŌ",
  fullName: "Intent-to-Auditable-Trust-Object Index",
  repo: "https://github.com/whatheheckisthis/Intent-to-Auditable-Trust-Object-Index",
  summary:
    "A read-only collector and policy harness. It normalises SailPoint IdentityIQ (IIQ) XML exports and Microsoft Entra ID snapshots into one JSON document, then evaluates access-control assertions with Rego policies.",
  docsHref: "/overview/",
} as const;
