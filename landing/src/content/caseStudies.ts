export const CASE_STUDIES = [
  {
    slug: "fpga-gpu-p2p",
    tag: "HPC",
    title: "Ultra Low Latency FPGA to GPU Peer‑to‑Peer Pipeline",
    summary:
      "Taking the CPU out of the data path with a direct FPGA to GPU channel over PCIe and SMMU isolation on Arm Neoverse.",
    cover: "/case-studies/cover-p2p.png",
    coverW: 1600,
    coverH: 460,
  },
  {
    slug: "armv9-weak-memory-sve2",
    tag: "Formal methods",
    title: "Weak Memory, SVE2 and Lossless Lane Reduction on Armv9.0‑A",
    summary:
      "Modelling Neoverse N2 and Cortex‑X3 concurrency so the state space stays flat as SVE2 vectors grow, losing no observable behaviour.",
    cover: "/case-studies/cover-armv9.png",
    coverW: 1600,
    coverH: 460,
  },
  {
    slug: "hmm-gaussian-fields",
    tag: "Probabilistic models",
    title: "Hidden Markov Models with Gaussian Fields for Behavioural Time Series",
    summary:
      "Discrete behavioural regimes for the jumps, a sparse SPDE Gaussian field for the drift, joined so inference stays real time.",
    cover: "/case-studies/cover-hmm.png",
    coverW: 1600,
    coverH: 460,
  },
  {
    slug: "spde-gmrf-gpu-edge",
    tag: "GPU and edge",
    title: "Lifting SPDE‑GMRF Fields: GPU Estimation and On‑Device Forward Filtering",
    summary:
      "Sparse precision factorised on the GPU with cuSPARSE and cuSOLVER, and an int8 forward filter on Arm Cortex‑M via CMSIS‑NN.",
    cover: "/case-studies/cover-spde.png",
    coverW: 1600,
    coverH: 460,
  },
] as const;
