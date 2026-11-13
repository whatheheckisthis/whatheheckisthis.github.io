export const CASE_STUDIES = [
  {
    slug: "fpga-gpu-p2p",
    tag: "HPC",
    title: "Ultra Low Latency FPGA to GPU Peer‑to‑Peer Pipeline",
    summary:
      "Taking the CPU out of the data path with a direct FPGA to GPU channel over PCIe, with SMMU isolation on a virtualised Arm Neoverse platform.",
    cover: "/case-studies/cover-p2p.png",
    coverW: 1600,
    coverH: 460,
  },
  {
    slug: "armv9-weak-memory-sve2",
    tag: "Formal methods",
    title: "Weak Memory, SVE2 and Lossless Lane Reduction on Armv9.0‑A",
    summary:
      "Modelling concurrency on Neoverse N2 and Cortex‑X3 so the state space stays flat as SVE2 vectors grow, without losing an observable behaviour.",
    cover: "/case-studies/cover-armv9.png",
    coverW: 1600,
    coverH: 460,
  },
] as const;
