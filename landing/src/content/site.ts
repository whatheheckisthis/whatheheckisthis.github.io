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
      "A specification review and Lean 4 formalisation of an EL2 hypervisor model for Arm Neoverse servers (Azure Cobalt): Stage-2 memory isolation, EL2 configuration and the KVM vCPU lifecycle. Each finding is classed as a correction, a precision defect or a verification gap.",
    links: [
      { text: "Learn More", href: "https://www.dropbox.com/scl/fi/nfrnwf5lten7b74ud1fbn/A64-CBLT-STUDY-001-eca7fe16806a.pdf?rlkey=rl6pegel190x12yx8mhkpbn7s&st=kjv0iqll&dl=0" },
      { text: "View the Lean proofs", href: "https://github.com/whatheheckisthis/Intent-to-Auditable-Trust-Object-v7" },
    ],
  },
  {
    name: "FPGA to GPU peer-to-peer pipeline",
    tag: "HPC",
    summary:
      "A technical specification and verification model for a low-latency FPGA-to-GPU data path on virtualised Arm Neoverse hosts, using PCIe peer-to-peer DMA, QEMU/KVM/VFIO device isolation and AF_XDP control. April 2024 to January 2025.",
    links: [{ text: "Learn More", href: "https://www.dropbox.com/scl/fi/lrntb1t05v04yb1wz4ei8/CBLT-2-1cf710990566.pdf?rlkey=rp2c40yxcu7wo0m9yqnl13ckc&st=1x4jym61&dl=0" }],
  },
] as const;
