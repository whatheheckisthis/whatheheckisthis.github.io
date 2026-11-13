import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

interface Fig {
  src: string;
  alt: string;
  w: number;
  h: number;
  label: string;
}

function Figure({ src, alt, w, h, label, children }: Fig & { children: React.ReactNode }) {
  return (
    <figure className="cs-figure">
      <img src={src} alt={alt} width={w} height={h} loading="lazy" decoding="async" />
      <figcaption>
        <span className="cs-figure__label">{label}</span>
        {children}
      </figcaption>
    </figure>
  );
}

export default function CaseStudies() {
  return (
    <>
      <Header />
      <div className="cs-shell fade-in" id="main">
        <main className="prose-article cs-main">
          <header className="post-header">
            <p className="cs-kicker">Case study</p>
            <h1>Ultra Low Latency FPGA to GPU Peer-to-Peer Pipeline</h1>
            <p className="post-dek">
              Taking the CPU out of the data path by opening a direct channel between an FPGA and a GPU across the PCI
              Express fabric, on a virtualised Arm Neoverse N2/V3 platform.
            </p>
            <dl className="cs-facts">
              <div><dt>Period</dt><dd>6 April 2024 to 30 January 2025</dd></div>
              <div><dt>Platform</dt><dd>Arm Neoverse N2/V3, <code className="ic">CMN</code>, <code className="ic">QEMU/KVM/VFIO</code>, <code className="ic">AF_XDP</code></dd></div>
              <div><dt>Framework</dt><dd>Correctness Framework for Heterogeneous Accelerator Architectures</dd></div>
            </dl>
          </header>

          <section className="post-body">
            <Figure
              src="/case-studies/p2p-overview.png"
              alt="Arm coordinator sends WC MMIO writes to the FPGA parser and doorbells to the GPU runtime, while the payload moves FPGA to GPU over PCIe P2P"
              w={1488}
              h={414}
              label="Figure 1 · System overview"
            >
              An Arm coordinator running <code className="ic">AF_XDP</code> control drives both devices with small writes only: write-combined MMIO
              to the FPGA parser and doorbells to the GPU runtime. The payload itself never visits the coordinator. It
              travels FPGA to GPU as PCIe peer-to-peer traffic.
            </Figure>

            <h2>The problem</h2>
            <p>
              In a conventional accelerator pipeline, a frame parsed on the FPGA is copied into CPU RAM and then copied
              again into GPU memory. Every frame costs two copies, CPU cycles and memory bandwidth, and the CPU becomes
              the latency floor. This project removes that overhead by letting the two devices talk to each other
              directly over PCIe.
            </p>

            <h2>Bypassing host memory: zero-copy P2P</h2>
            <Figure
              src="/case-studies/p2p-two-track-datapath.png"
              alt="Two-track datapath: coordinator descriptor control above, bulk payload moving FPGA parser plus DMA to GPU peer memory with no CPU copy"
              w={1498}
              h={355}
              label="Figure 2 · Two-track datapath"
            >
              Instead of staging data through CPU RAM, the system exposes the physical memory space, the PCIe Base
              Address Registers (<code className="ic">BAR</code>), of one device so the other can initiate direct read and write transactions
              across the bus. Control and payload are split: the CPU touches only descriptors and doorbells, while bulk
              payload moves straight into GPU peer memory. The invariant is <code className="ic">N_cpu_payload_copies = 0</code> in direct mode, and
              any fallback to host staging is exported as telemetry, never taken silently.
            </Figure>

            <h2>DMA and bus mastering</h2>
            <Figure
              src="/case-studies/p2p-dma-sequence.png"
              alt="Sequence: CPU registers handle, publishes descriptor, rings WC doorbell; FPGA issues translated P2P DMA to GPU; GPU completes; completion record and reap"
              w={1130}
              h={570}
              label="Figure 3 · Transaction sequence"
            >
              Either the FPGA or the GPU acts as the bus master and orchestrates the movement. Here the CPU's role ends
              at step 3, the doorbell. The FPGA's <code className="ic">DMA</code> engine then issues translated P2P writes into GPU memory (step 4),
              the GPU signals completion (step 5), and the buffer is only reaped once its sequence and epoch check out.
              Large streams move across the interconnect asynchronously without consuming CPU cycles.
            </Figure>

            <h2>IOMMU/SMMU address translation</h2>
            <Figure
              src="/case-studies/p2p-topology-smmu.png"
              alt="Topology: Neoverse coordinator core, CMN and memory controllers, PCIe root complex, FPGA and GPU requesters with stream IDs, P2P TLP route, and Arm SMMU domains"
              w={1469}
              h={683}
              label="Figure 4 · Topology and SMMU domains"
            >
              Devices work in their own virtual address spaces. The IOMMU, on Arm the System MMU, translates
              device-visible addresses into physical host-bus addresses. Each requester carries its own stream ID (<code className="ic">s_f</code>, <code className="ic">s_g</code>) and
              SMMU domain (<code className="ic">D_f</code>, <code className="ic">D_g</code>), which gives memory-access protection, tenant isolation and valid routing across the PCIe root
              complex. Under <code className="ic">VFIO</code>, a DMA outside the active tenant mapping must fault, not land.
            </Figure>
            <Figure
              src="/case-studies/p2p-smmu-teardown.png"
              alt="Teardown order: stop admission, drain, disable bus master, unmap, reset and sanitise"
              w={1404}
              h={108}
              label="Figure 5 · Teardown order"
            >
              Isolation also has to survive shutdown. Mappings come down in a fixed order: stop admission, drain, disable
              bus mastering, unmap, then reset and sanitise, so no in-flight DMA can reach memory that has already been
              handed back.
            </Figure>

            <h2>The underlying correctness framework</h2>
            <p>
              The pipeline sits inside a broader Correctness Framework for Heterogeneous Accelerator Architectures. Its
              formal side is a draft preprint, <em>A Coinductive Bisimulation Characterisation of Parameterised SVE State
              under Virtualisation-Structured Dynamics</em>. It treats hardware and hypervisor internals (<code className="ic">EL2</code>, <code className="ic">MMU</code>, <code className="ic">VMID</code>,
              scheduling) as an abstract, correctness-preserving environment and models only what can be observed.
            </p>
            <p>
              Configurations pair vector state indexed by SVE vector length (<code className="ic">VL ::= 128 | 256 | 512</code>) with an architectural
              projection. Execution, migration and reconfiguration are labelled transitions, and an embedding between
              vector-length spaces preserves observation. The main theorem, migration preservation, says that if <code className="ic">C_H ⊑ C_G</code> then <code className="ic">O(mig(C_H)) = O(mig(C_G))</code>: if one
              configuration refines another, migrating both yields the same observable behaviour. It rests on lemmas for
              embedding preservation, refinement stability, migration invariance, trace stability and commutativity.
            </p>
            <p>
              The same habit runs through the pipeline spec: define what must be observably true first, then measure
              against it.
            </p>

            <h2>Evidence status</h2>
            <p>
              The specification defines 40 failure cases across five suites: malformed input, GPU overload, SMMU negative
              tests, fault recovery and security negative tests. Raw benchmark logs, FPGA counter dumps and SMMU fault
              logs are not attached, so those cases are marked pending rather than passed. Unconditional direct P2P is not
              yet qualified, and host pinned staging remains the operational fallback.
            </p>
            <p>
              <Link to="/blog/fpga-gpu-p2p-spec-before-benchmarks/">Read the full write-up on writing the spec before the benchmarks</Link>
            </p>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}
