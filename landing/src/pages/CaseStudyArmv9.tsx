import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Figure from "../components/CsFigure";

const C = ({ children }: { children: string }) => <code className="ic">{children}</code>;

export default function CaseStudyArmv9() {
  return (
    <>
      <Header />
      <div className="cs-shell fade-in" id="main">
        <main className="prose-article cs-main">
          <header className="post-header">
            <p className="cs-kicker"><Link to="/case-studies/">Case studies</Link> · 02</p>
            <h1>Weak Memory, SVE2 and Lossless Lane Reduction on Armv9.0-A</h1>
            <p className="post-dek">
              Can a formal model of concurrency on Arm Neoverse N2 and Cortex-X3 keep its state space flat as SVE2
              vectors grow, without losing a single observable behaviour? Yes, provided the abstraction keeps two things
              intact: single-copy atomicity boundaries and cross-lane dependencies.
            </p>
            <dl className="cs-facts">
              <div><dt>Cores</dt><dd>Neoverse N2, Cortex-X3 (Armv9.0-A, out of order, no SMT)</dd></div>
              <div><dt>Vector</dt><dd>SVE2, hardware <C>VL = 128</C> bits on both cores</dd></div>
              <div><dt>Framework</dt><dd>Correctness Framework for Heterogeneous Accelerator Architectures</dd></div>
            </dl>
          </header>

          <section className="post-body">
            <Figure
              src="/case-studies/armv9-overview.png"
              alt="Two Armv9.0-A cores, each with SVE2 registers and a store buffer, connected through a cache-coherent interconnect to shared memory holding data x and flag f"
              w={1036}
              h={660}
              label="Figure 1 · Where the races live"
            >
              Each core runs one hardware thread, so there is no contention between sibling threads inside a core. The
              races that matter happen between cores, through the coherent interconnect. Ordering between them is set by
              the architecture, not the pipeline: barriers (<C>DMB</C>, <C>DSB</C>) and acquire/release
              (<C>LDAR</C>, <C>STLR</C>) are the only levers.
            </Figure>

            <h2>Why x86 intuition does not transfer</h2>
            <p>
              On x86, the TSO model lets a store be delayed past a later load and little else. Armv9.0-A is weaker: normal
              loads and stores to different addresses may be reordered in any combination unless an address, data or
              control dependency, a barrier, or acquire/release semantics forbids it. The model is
              other-multi-copy-atomic, so once a store is visible to one other core it is visible to all of them. That
              guarantee is what makes the problem tractable to formalise.
            </p>
            <p>
              Because these cores reorder aggressively, reasoning from the pipeline is a trap. The study works from the
              architectural memory model, axiomatic and operational, so every conclusion holds for any conforming
              Armv9.0-A implementation, not just the two cores named here.
            </p>

            <h2>Single-copy atomicity boundaries</h2>
            <Figure
              src="/case-studies/armv9-atomicity-boundaries.png"
              alt="Byte ruler of a 128-bit vector showing scalar 64-bit atomic accesses, predicated 32-bit lane accesses each atomic, an inactive lane with no access, and unpredicated LDR Z as 16 byte accesses"
              w={1656}
              h={466}
              label="Figure 2 · What is atomic inside a vector access"
            >
              An SVE2 vector access is never single-copy atomic as a whole. A predicated <C>LD1W</C> or <C>ST1W</C> is a
              sequence of element accesses, and each aligned element is single-copy atomic on its own. Inactive lanes do
              not touch memory. Unpredicated <C>LDR Z</C> and <C>STR Z</C> are a stream of byte accesses with no
              atomicity guarantee above one byte. The optional 64-byte <C>FEAT_LS64</C> accesses are a different
              mechanism and the model does not assume them.
            </Figure>

            <h2>The bug this exposes</h2>
            <Figure
              src="/case-studies/armv9-litmus-mp.png"
              alt="Message-passing litmus test: with plain accesses a reader can see the flag set while vector lanes are still old; with release and acquire that outcome is forbidden"
              w={999}
              h={740}
              label="Figure 3 · Message passing with a vector payload"
            >
              The classic message-passing test, with the payload in a vector. With plain accesses, a reader can see the
              flag set and still read stale lanes, and the lanes can disagree with each other. A release store on the
              flag and an acquire load on the reader forbid that outcome. This is the shape of most real vector
              concurrency bugs on Arm: torn, partially updated vectors that never appear on x86.
            </Figure>

            <h2>State space against vector length</h2>
            <Figure
              src="/case-studies/armv9-state-space.png"
              alt="Plot of log2 lane observations per racing access against vector length: explicit lanes grow from 4 to 64, lane reduction stays flat at 1 or 3"
              w={1008}
              h={549}
              label="Figure 4 · Why per-lane modelling explodes"
            >
              Because each lane is its own atomic access, a racing vector of <C>L</C> lanes can be observed in
              <C>2^L</C> old/new combinations. N2 and X3 run at 128 bits, so <C>L = 4</C> for 32-bit elements, but SVE
              code is vector-length agnostic and the architecture allows up to 2048 bits. A model that enumerates lanes
              explicitly reaches <C>2^64</C> at the top of that range. Parametric lane reduction keeps one symbolic lane
              for lane-wise code, plus only the <C>k</C> lanes that cross-lane operations actually couple, so the
              count stays flat whatever the vector length.
            </Figure>

            <h2>When the reduction is lossless</h2>
            <Figure
              src="/case-studies/armv9-lossless-reduction.png"
              alt="Commuting diagram: vector-length fibres linked by embeddings, each mapped by a reduction into a reduced state space, which maps to the observation domain and the quotient"
              w={1080}
              h={964}
              label="Figure 5 · The formal trade-off"
            >
              Each vector length is a fibre <C>S_λ</C>, linked by embeddings <C>ι</C> that preserve observation. The
              reduction <C>ρ_λ</C> maps every fibre into one reduced space. It is lossless exactly when
              <C>O ∘ ρ_λ = O</C>, and that holds only if it keeps per-element atomicity boundaries and every cross-lane
              dependency: permutes, reductions, predicate generation and gather addresses. Drop either and the model
              silently forgets a reachable bug.
            </Figure>

            <h2>The underlying correctness framework</h2>
            <p>
              The formal side builds on the draft preprint behind this framework. States are observed through a
              function <C>O</C>, and two states are equivalent when they look the same: <C>s₁ ≈ s₂ ⇔ O(s₁) = O(s₂)</C>.
              The quotient <C>Q = S/≈</C> is the system the proofs reason about.
            </p>
            <p>
              Its closure theorem says <C>Q</C> is a well-defined quotient transition system when four conditions hold:
              equivalence is a congruence over transitions, the observation order is a preorder, embeddings preserve
              observation, and migration preserves observation. Six lemmas carry it, from transition congruence to
              migration identity, where <C>[mig(s)] = [s]</C>. Lane reduction is one more observation-preserving map in
              the same family, which is why it can shrink the state space without changing what the proofs can see.
            </p>

            <h2>Evidence status</h2>
            <p>
              This is a model and a draft preprint, not a measured result. The atomicity rules come from the Arm
              Architecture Reference Manual. The reduction has not yet been checked against the published Armv9
              memory-model tooling or run as litmus tests on Neoverse N2 or Cortex-X3 hardware, so its claims stay
              conditional until it is.
            </p>

            <h2>References</h2>
            <ul className="cs-refs">
              <li><a href="https://support.arm.com/documentation/ddi0487/mc/-Part-B-The-AArch64-Application-Level-Architecture/-Chapter-B2-The-AArch64-Application-Level-Memory-Model/-B2-2-Atomicity-in-the-Arm-architecture/-B2-2-1-Requirements-for-single-copy-atomicity">Arm Architecture Reference Manual, B2.2.1 Requirements for single-copy atomicity</a></li>
              <li><a href="https://arxiv.org/abs/2508.04115">Su and Colvin, Weak Memory Model Formalisms: Introduction and Survey</a></li>
              <li><a href="https://en.wikipedia.org/wiki/ARM_Neoverse">Arm Neoverse overview</a></li>
            </ul>
            <p>
              <Link to="/case-studies/fpga-gpu-p2p/">Previous case study: FPGA to GPU peer-to-peer pipeline</Link>
              <br />
              <Link to="/case-studies/hmm-gaussian-fields/">Next case study: Hidden Markov models with Gaussian fields</Link>
            </p>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}
