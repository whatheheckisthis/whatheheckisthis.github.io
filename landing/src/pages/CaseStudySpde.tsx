import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Figure from "../components/CsFigure";

const C = ({ children }: { children: string }) => <code className="ic">{children}</code>;

export default function CaseStudySpde() {
  return (
    <>
      <Header />
      <div className="cs-shell fade-in" id="main">
        <main className="prose-article cs-main">
          <header className="post-header">
            <p className="cs-kicker"><Link to="/case-studies/">Case studies</Link> · 04</p>
            <h1>Lifting SPDE-GMRF Fields: GPU Estimation and On-Device Forward Filtering</h1>
            <p className="post-dek">
              The model in the previous study has a heavy part and a light part. Estimating the spatial field and its
              parameters means factorising large sparse precision matrices, which belongs on a GPU. Deciding the current
              behavioural mode means one small recursion per sample, which belongs on the device. Splitting them is how
              high-dimensional inference stays inside a real-time latency budget.
            </p>
            <dl className="cs-facts">
              <div><dt>Estimation</dt><dd>Sparse <C>Q(θ)</C> on GPU with cuSPARSE and cuSOLVER</dd></div>
              <div><dt>Lifting</dt><dd>Sparse projector <C>P</C> from mesh nodes to sensors</dd></div>
              <div><dt>Device</dt><dd>int8 forward filter on Arm Cortex-M via CMSIS-NN</dd></div>
            </dl>
          </header>

          <section className="post-body">
            <Figure
              src="/case-studies/spde-pipeline.png"
              alt="Pipeline: FEM mesh feeds GPU estimation, which feeds a lift to sensor locations, which feeds an on-device forward filter on Arm Cortex-M, with a dashed loop back for periodic re-estimation"
              w={1043}
              h={524}
              label="Figure 1 · Heavy path and light path"
            >
              The mesh matrices <C>C</C> and <C>G</C> are assembled once. The GPU rebuilds <C>Q(θ)</C>, factorises it and
              returns <C>θ̂</C> and the field estimate <C>x̂</C>. Those are lifted to the sensor locations and quantised
              for the device, which runs the forward filter on every sample. Re-estimation runs periodically, off the
              latency path.
            </Figure>

            <h2>Lifting the field to the sensors</h2>
            <p>
              The field lives on mesh nodes, but the signals arrive at sensor locations. Lifting maps one to the other
              with a sparse projector <C>P</C>, so the observation model becomes <C>y = μ_S + H P x + ε</C>. Because the
              finite elements are piecewise linear, each sensor reads from the three corners of the triangle it falls
              in, and each row of <C>P</C> has three nonzeros.
            </p>
            <Figure
              src="/case-studies/spde-lifting.png"
              alt="Triangular mesh with one shaded triangle; a sensor point inside it connects to the three corner nodes, with barycentric weights"
              w={1339}
              h={531}
              label="Figure 2 · One sensor, three weights"
            >
              The field at sensor <C>s</C> is <C>w_i x_i + w_j x_j + w_k x_k</C>, with barycentric weights that sum to
              one. The posterior precision <C>Q + Pᵀ Hᵀ D_S H P</C> therefore stays sparse: lifting adds only local
              couplings between nodes that share a sensor.
            </Figure>

            <h2>Parameter estimation on the GPU</h2>
            <p>
              Every evaluation of the likelihood for a candidate <C>θ = (κ, τ)</C> rebuilds <C>Q(θ)</C> from the fixed
              <C>C</C> and <C>G</C>, factorises it, and reads the log-determinant from the diagonal of the factor. The
              sparsity pattern never changes, only the values, so the symbolic analysis is done once and reused.
              cuSPARSE handles the sparse assembly and the sparse matrix-vector products, and cuSOLVER handles the sparse
              Cholesky factorisation and solves. NVIDIA now marks the sparse cuSOLVER module as deprecated, so a new build
              would move the factorisation to cuDSS and keep the rest of the design unchanged.
            </p>
            <Figure
              src="/case-studies/spde-fill-in.png"
              alt="Two Cholesky factor patterns of the same matrix: in mesh order the lower triangle fills heavily, after reverse Cuthill-McKee reordering the factor is a narrow band"
              w={868}
              h={521}
              label="Figure 3 · Ordering decides the cost"
            >
              Computed on a 20 by 20 lattice, <C>n = 400</C>, where <C>Q</C> has 4,804 nonzeros. With the scrambled node
              order a mesh generator produces, the Cholesky factor has 37,615 nonzeros. After reverse Cuthill-McKee
              reordering it has 11,378, about 70% fewer. cuSOLVER's sparse Cholesky takes a reordering option for this
              reason, including reverse Cuthill-McKee, AMD and METIS nested dissection.
            </Figure>

            <h2>Forward filtering on the device</h2>
            <p>
              Once the field is estimated, the device does not need it in full. It needs the lifted offsets
              <C>P x̂</C> for its own sensors and the transition matrix <C>A</C>. With four regimes, the forward step is
              <C>α_t(k) ∝ b_k(y_t) Σ_j a_jk α_(t−1)(j)</C>: one 4 by 4 matrix-vector product, four multiplies and a
              normalisation per sample.
            </p>
            <Figure
              src="/case-studies/spde-forward-filter.png"
              alt="Forward filter recursion: previous belief goes through a CMSIS-NN fully connected int8 kernel, is multiplied by the emission likelihoods, normalised, and becomes the current belief whose largest entry is the mode"
              w={1137}
              h={503}
              label="Figure 4 · The per-sample recursion"
            >
              The product <C>Aᵀ α_(t−1)</C> has the same shape as a fully connected layer, so it runs on the int8
              fully connected kernel in CMSIS-NN. The emission term uses the lifted offsets, and a fixed-point rescale
              keeps the belief normalised so it never underflows. The largest entry of <C>α_t</C> is the current
              behavioural mode, evaluated locally with no round trip to the GPU.
            </Figure>

            <h2>Why the split works</h2>
            <p>
              The expensive work, factorising a large sparse precision, depends only on how fast the environment
              changes, so it can run every few seconds or minutes. The cheap work depends on every sample, and its cost
              is fixed by the number of regimes, not by the size of the field. Each side runs on the hardware that fits
              it.
            </p>

            <h2>Evidence status</h2>
            <p>
              This is a system design, not a benchmark. Figure 3 is computed from a real lattice precision and a real
              Cholesky factorisation, but no GPU timings, device latencies or quantisation error figures have been
              measured yet. The int8 forward filter in particular needs its accuracy checked against a floating-point
              reference before any latency claim is made.
            </p>

            <h2>References</h2>
            <ul className="cs-refs">
              <li><a href="https://doi.org/10.1111/j.1467-9868.2011.00777.x">Lindgren, Rue and Lindström, An explicit link between Gaussian fields and Gaussian Markov random fields: the SPDE approach</a></li>
              <li><a href="https://docs.nvidia.com/cuda/cusolver/">NVIDIA cuSOLVER documentation</a></li>
              <li><a href="https://docs.nvidia.com/cuda/cudss/">NVIDIA cuDSS documentation</a></li>
              <li><a href="https://docs.nvidia.com/cuda/cusparse/">NVIDIA cuSPARSE documentation</a></li>
              <li><a href="https://github.com/ARM-software/CMSIS-NN">Arm CMSIS-NN</a></li>
            </ul>
            <p>
              <Link to="/case-studies/hmm-gaussian-fields/">Previous case study: Hidden Markov models with Gaussian fields</Link>
            </p>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}
