export const SITE = {
  name: "Dhruv Setty",
  positioning: "Identity Engineer. IGA and IAM control assurance.",
  focus: "Identity governance and access control across hybrid Entra ID and Active Directory, with evidence an auditor can check.",
  url: "https://whatheheckisthis.github.io",
  description:
    "Dhruv Setty, Identity Engineer in New Zealand. IGA and IAM control assurance across hybrid Entra ID and Active Directory.",
  contact: [
    { label: "Email", text: "Email", href: "mailto:itsdhruvsetty@gmail.com" },
    { label: "GitHub", text: "GitHub", href: "https://github.com/whatheheckisthis" },
    { label: "LinkedIn", text: "LinkedIn", href: "https://www.linkedin.com/in/its-dhruv-setty" },
  ],
  // Existing MkDocs pages, served from the same site. Plain links, not router links.
  docs: [
    { text: "Overview", href: "/overview/" },
    { text: "Architecture & Auth", href: "/architecture/" },
    { text: "CLI & Schema Reference", href: "/reference/" },
    { text: "Deployment & Hardening", href: "/deployment/" },
  ],
} as const;

export const FEATURED = {
  name: "IĀTŌ",
  fullName: "Intent-to-Auditable-Trust-Object Index",
  repo: "https://github.com/whatheheckisthis/Intent-to-Auditable-Trust-Object-Index",
  readmeText: "Read the README",
  status: "Design stage. v1.0.0 scope is the Entra ID collector.",
  readme: "https://github.com/whatheheckisthis/whatheheckisthis/blob/main/README.md",
} as const;
