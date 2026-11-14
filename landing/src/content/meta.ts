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
    return { title: `Case Studies | ${SITE.name}`, description: "Case studies from a Correctness Framework for Heterogeneous Accelerator Architectures: FPGA to GPU P2P, weak memory with SVE2 on Armv9.0-A, HMMs with Gaussian fields, and SPDE-GMRF inference on GPU and edge.", path, type: "website" };
  }
  if (path === "/case-studies/fpga-gpu-p2p/") {
    return { title: `FPGA to GPU Peer-to-Peer Pipeline | ${SITE.name}`, description: "Zero-copy P2P over PCIe, DMA bus mastering and SMMU address translation on Arm Neoverse.", path, type: "article" };
  }
  if (path === "/case-studies/hmm-gaussian-fields/") {
    return { title: `Hidden Markov Models with Gaussian Fields for Behavioural Time Series | ${SITE.name}`, description: "Discrete behavioural regimes with an HMM, continuous drift with a sparse SPDE Gaussian Markov random field, and joint inference that stays real time.", path, type: "article" };
  }
  if (path === "/case-studies/spde-gmrf-gpu-edge/") {
    return { title: `Lifting SPDE-GMRF Fields: GPU Estimation and On-Device Forward Filtering | ${SITE.name}`, description: "Sparse precision estimation on GPU with cuSPARSE and cuSOLVER, a sparse projector to sensor locations, and an int8 HMM forward filter on Arm Cortex-M via CMSIS-NN.", path, type: "article" };
  }
  if (path === "/case-studies/armv9-weak-memory-sve2/") {
    return { title: `Weak Memory, SVE2 and Lossless Lane Reduction on Armv9.0-A | ${SITE.name}`, description: "Modelling concurrency on Neoverse N2 and Cortex-X3: single-copy atomicity boundaries, SVE2 vector length and lossless parametric lane reduction.", path, type: "article" };
  }
  if (path === "/blog/") {
    return { title: `Journal | ${SITE.name}`, description: `Notes on identity, access and assurance by ${SITE.name}.`, path, type: "website" };
  }
  const m = /^\/blog\/([^/]+)\/$/.exec(path);
  const post = m?.[1] ? findPost(m[1]) : undefined;
  if (post) {
    return { title: `${post.title} | ${SITE.name}`, description: post.summary, path, type: "article" };
  }
  return { title: `${SITE.name}, Identity Engineer`, description: SITE.description, path: "/", type: "website" };
}
