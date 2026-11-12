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
  location: "Auckland, New Zealand",
  email: "itsdhruvsetty@gmail.com",
  photo: { src: "/dhruv.webp", alt: "Dhruv Setty", width: 400, height: 400 },
  // Dropbox shared link to the resume (opens Dropbox preview). Empty hides the link.
  resume: "",
  // Buy Me a Coffee or Ko-fi page. Empty hides the button.
  coffee: "https://buymeacoffee.com/dhruvsetty",
  // Existing MkDocs pages, served from the same site. Plain links, not router links.
  docs: [
    { text: "Overview", href: "/overview/" },
    { text: "Architecture & Auth", href: "/architecture/" },
    { text: "CLI & Schema Reference", href: "/reference/" },
    { text: "Deployment & Hardening", href: "/deployment/" },
  ],
} as const;

export const FOCUS = [
  {
    title: "Identity governance",
    body: "Joiner, mover and leaver processes, access reviews and role design that keep access matched to the job, not the history.",
  },
  {
    title: "Access control assurance",
    body: "Controls tested against evidence, not assumptions, with findings an auditor can trace back to the source.",
  },
  {
    title: "Hybrid identity",
    body: "Entra ID and Active Directory run as one estate, with a clear owner for every account and every privilege.",
  },
] as const;

export const FEATURED = {
  summary: "An index that turns identity data into audit-ready evidence, so every access decision can be traced from intent to proof.",
  name: "IĀTŌ",
  fullName: "Intent-to-Auditable-Trust-Object Index",
  repo: "https://github.com/whatheheckisthis/Intent-to-Auditable-Trust-Object-Index",
  readmeText: "Read the README",
  status: "Design stage. v1.0.0 scope is the Entra ID collector.",
  readme: "https://github.com/whatheheckisthis/whatheheckisthis/blob/main/README.md",
} as const;
