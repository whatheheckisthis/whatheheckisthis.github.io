import { SITE } from "./site";
import { findPost } from "./posts";

export interface PageMeta {
  title: string;
  description: string;
  path: string;
  type: "website" | "article";
}

export function metaFor(path: string): PageMeta {
  if (path === "/case-studies/") {
    return { title: `Case Studies | ${SITE.name}`, description: "Case studies from a Correctness Framework for Heterogeneous Accelerator Architectures: FPGA to GPU P2P, and weak memory with SVE2 on Armv9.0-A.", path, type: "website" };
  }
  if (path === "/case-studies/fpga-gpu-p2p/") {
    return { title: `FPGA to GPU Peer-to-Peer Pipeline | ${SITE.name}`, description: "Zero-copy P2P over PCIe, DMA bus mastering and SMMU address translation on Arm Neoverse.", path, type: "article" };
  }
  if (path === "/case-studies/armv9-weak-memory-sve2/") {
    return { title: `Weak Memory, SVE2 and Lossless Lane Reduction on Armv9.0-A | ${SITE.name}`, description: "Modelling concurrency on Neoverse N2 and Cortex-X3: single-copy atomicity boundaries, SVE2 vector length and lossless parametric lane reduction.", path, type: "article" };
  }
  if (path === "/blog/") {
    return { title: `Blog | ${SITE.name}`, description: `Notes on identity, access and assurance by ${SITE.name}.`, path, type: "website" };
  }
  const m = /^\/blog\/([^/]+)\/$/.exec(path);
  const post = m?.[1] ? findPost(m[1]) : undefined;
  if (post) {
    return { title: `${post.title} | ${SITE.name}`, description: post.summary, path, type: "article" };
  }
  return { title: `${SITE.name}, Identity Engineer`, description: SITE.description, path: "/", type: "website" };
}
