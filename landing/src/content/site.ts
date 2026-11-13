export const SITE = {
  name: "Dhruv Setty",
  positioning: "Identity Engineer. IGA and IAM control assurance.",
  focus: "Identity governance and access control across hybrid Entra ID and Active Directory, with evidence an auditor can check.",
  url: "https://whatheheckisthis.github.io",
  description:
    "Dhruv Setty, Identity Engineer in New Zealand. IGA and IAM control assurance across hybrid Entra ID and Active Directory.",
  contact: [
    { label: "GitHub", text: "GitHub", href: "https://github.com/whatheheckisthis" },
    { label: "LinkedIn", text: "LinkedIn", href: "https://www.linkedin.com/in/its-dhruv-setty" },
  ],
  location: "",
  // Cloudflare Worker that relays the contact form to Resend. Empty disables sending.
  contactEndpoint: "https://dhruv-contact.itsdhruvsetty.workers.dev/",
  photo: { src: "/dhruv.webp", alt: "Dhruv Setty", width: 400, height: 400 },
  // Dropbox shared link to the resume (opens Dropbox preview). Empty hides the link.
  resume: "https://www.dropbox.com/scl/fi/9sueshghjttlbs9xoei3j/Dhruv_Setty_Resume.pdf?rlkey=wvw71mzpaxlpa36zf4mhr5pu9&st=l9ptoclv&dl=0",
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
    lead: "Access that follows the role, not the history.",
    body: "Joiner, mover and leaver workflows, periodic access certification and role-based access design, so entitlements are granted, adjusted and revoked as people change roles instead of accumulating over time.",
    refs: ["ISO 27001 A.5.16", "A.5.18"],
  },
  {
    title: "Access control assurance",
    lead: "Evidence first, conclusions second.",
    body: "Controls are tested against system evidence rather than assumption. Each finding is traced to its source, mapped to the requirement it tests and documented so an auditor can sample it and reach the same result.",
    refs: ["ISO 27001 A.5.15", "A.5.35"],
  },
  {
    title: "Hybrid identity",
    lead: "One directory model across cloud and on-premises.",
    body: "Entra ID and on-premises Active Directory governed as one hybrid directory, with every account and privileged role mapped in a controls crosswalk and every exception tracked in the risk register.",
    refs: ["ISO 27001 A.5.16", "A.8.2"],
  },
] as const;

export const FEATURED = {
  summary: "`v1.0.0`. Entra ID collection (`--live-entra`) runs non-interactively and daemonless via the Microsoft Graph API, replacing ad hoc `az ad` or PowerShell queries with a repeatable run. It pages users, directory role assignments, Conditional Access policies and groups via `@odata.nextLink`, and that is the complete set. `$select` retrieves only the required attributes. Output is normalised to a common JSON schema for separation-of-duties, privileged-access and migration-drift assertions. Auth is `iato.pem` or Kubernetes workload identity, with tokens held in process memory only, never persisted. Enforce least privilege on the app registration: `.default` returns whatever consent has been granted.",
  name: "Identity control evaluation for Entra ID",
  fullName: "Intent-to-Auditable-Trust-Object Index",
  repo: "https://github.com/whatheheckisthis/Intent-to-Auditable-Trust-Object-Index",
  readmeText: "Learn More",
  status: "Design stage. v1.0.0 scope is the Entra ID collector.",
  readme: "https://github.com/whatheheckisthis/whatheheckisthis/blob/main/README.md",
} as const;

// More projects, shown under the featured card. A link with an empty href is hidden.
export const PROJECTS = [
  {
    name: "AArch64 virtualisation study",
    tag: "Virtualisation",
    summary:
      "Part of my Correctness Framework for Heterogeneous Accelerator Architectures. Formally analysed `Stage 2` address translation and memory state transformations to ensure data integrity, race concurrency, and ownership preservation under virtualised hardware semantics. Applied observational equivalence and congruence proofs to `VLA` execution models, proving that asynchronous accelerator offloading preserves observable program behavior.",
    links: [
      { text: "Learn More", href: "https://www.dropbox.com/scl/fi/nfrnwf5lten7b74ud1fbn/A64-CBLT-STUDY-001-eca7fe16806a.pdf?rlkey=rl6pegel190x12yx8mhkpbn7s&st=kjv0iqll&dl=0" },
      { text: "View the Lean proofs", href: "https://github.com/whatheheckisthis/Intent-to-Auditable-Trust-Object-v7" },
    ],
  },
  {
    name: "FPGA to GPU peer-to-peer pipeline",
    tag: "HPC",
    summary:
      "Part of my Correctness Framework for Heterogeneous Accelerator Architectures. Designed and evaluated low-latency FPGA GPU `PCIe P2P` memory access paths, optimising `DMA`, `IOMMU/SMMU` address translation, and cache coherence across heterogeneous interconnects.",
    links: [{ text: "Learn More", href: "https://www.dropbox.com/scl/fi/lrntb1t05v04yb1wz4ei8/CBLT-2-1cf710990566.pdf?rlkey=rp2c40yxcu7wo0m9yqnl13ckc&st=1x4jym61&dl=0" }],
  },
] as const;
