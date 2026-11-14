// Bounded Q&A for the site avatar. Answers come only from published site copy.
// Scope: identity governance (IGA), IAM control assurance, hybrid Entra ID and Active Directory.
export const AVATAR_SCOPE =
  "I only answer questions about my practice: identity governance, access control assurance and hybrid Entra ID with Active Directory. Try one of these.";

export const AVATAR_QA = [
  {
    q: "What do you focus on?",
    keys: ["focus", "do you do", "practice", "about you", "who are you", "role", "work"],
    a: "Identity governance and access control across hybrid Entra ID and Active Directory, with evidence an auditor can check.",
  },
  {
    q: "What does identity governance mean to you?",
    keys: ["iga", "governance", "joiner", "mover", "leaver", "jml", "certification", "recertification", "rbac", "role-based", "entitlement"],
    a: "Access that follows the role, not the history. Joiner, mover and leaver workflows, periodic access certification and role-based access design, so entitlements are granted, adjusted and revoked as people change roles instead of piling up.",
  },
  {
    q: "How do you assure access controls?",
    keys: ["assurance", "assure", "audit", "auditor", "evidence", "control", "test", "finding", "iam"],
    a: "Evidence first, conclusions second. I test controls against system evidence rather than assumption, trace each finding to its source, map it to the requirement it tests and document it so an auditor can sample it and reach the same result.",
  },
  {
    q: "How do you handle hybrid Entra ID and AD?",
    keys: ["hybrid", "entra", "azure ad", "active directory", "ad ", "on-prem", "on premises", "privileged", "crosswalk", "risk register"],
    a: "I govern Entra ID and on-premises Active Directory as one hybrid directory. Every account and privileged role is mapped in a controls crosswalk, and every exception is tracked in the risk register.",
  },
  {
    q: "Which standards do you map to?",
    keys: ["iso", "27001", "standard", "framework", "compliance", "annex"],
    a: "ISO 27001 Annex A identity and access controls: A.5.15 access control, A.5.16 identity management, A.5.18 access rights, A.5.35 independent review and A.8.2 privileged access rights.",
  },
  {
    q: "What are you building?",
    keys: ["build", "building", "project", "iato", "iātō", "tool", "graph"],
    a: "IĀTŌ, which turns identity data into evidence an auditor can check. It's at design stage, and the v1.0.0 scope is the Entra ID collector, reading through Microsoft Graph.",
  },
  {
    q: "How do your other interests connect?",
    keys: ["arm", "fpga", "gpu", "hmm", "case stud", "interest", "hardware", "formal", "other"],
    a: "I read them through the same lens: what has to stay true, who is allowed to touch it, and what evidence proves it. The case studies are where that governance habit meets hardware and models.",
  },
  {
    q: "How can I reach you?",
    keys: ["contact", "reach", "hire", "email", "talk", "linkedin"],
    a: "Use the contact form at the bottom of the home page, or find me on GitHub and LinkedIn.",
  },
] as const;

export function answer(input: string): string | null {
  const t = ` ${input.toLowerCase()} `;
  let best: { a: string; score: number } | null = null;
  for (const item of AVATAR_QA) {
    const score = item.keys.reduce((n, k) => (t.includes(k) ? n + 1 : n), 0);
    if (score > 0 && (!best || score > best.score)) best = { a: item.a, score };
  }
  return best ? best.a : null;
}
