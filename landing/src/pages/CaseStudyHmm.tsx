import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Figure from "../components/CsFigure";

const C = ({ children }: { children: string }) => <code className="ic">{children}</code>;

export default function CaseStudyHmm() {
  return (
    <>
      <Header />
      <div className="cs-shell fade-in" id="main">
        <main className="prose-article cs-main">
          <header className="post-header">
            <p className="cs-kicker"><Link to="/case-studies/">Case studies</Link> · 03</p>
            <h1>Hidden Markov Models with Gaussian Fields for Behavioural Time Series</h1>
            <p className="post-dek">
              Human behaviour does two things at once: it jumps between qualitative modes, and it drifts slowly inside
              them. A hidden Markov model captures the jumps. A Gaussian Markov random field captures the drift. Joined
              together, and kept sparse through the SPDE approach, the model stays small enough to filter in real time.
            </p>
            <dl className="cs-facts">
              <div><dt>Discrete</dt><dd>HMM over calm, alert, high-stress and panic, <C>K = 4</C></dd></div>
              <div><dt>Continuous</dt><dd>Gaussian field with sparse precision <C>Q(θ)</C></dd></div>
              <div><dt>Scaling</dt><dd>SPDE link from Matérn fields to GMRFs</dd></div>
            </dl>
          </header>

          <section className="post-body">
            <Figure
              src="/case-studies/hmm-graphical-model.png"
              alt="Graphical model: a chain of discrete regimes S and a chain of continuous field values x both feed each observation y"
              w={1138}
              h={411}
              label="Figure 1 · Two latent layers, one observation"
            >
              The regime chain <C>S_t</C> moves through the transition matrix <C>A</C>. The field <C>x_t</C> is a
              Gaussian Markov structure with precision <C>Q(θ)</C>. Each observation depends on both:
              <C>y_t = μ_S + H x_t + ε_t</C>, with noise <C>ε_t ~ N(0, Σ_S)</C> set by the current regime.
            </Figure>

            <h2>Why a plain HMM is not enough</h2>
            <p>
              A standard HMM assumes that, given the regime, observations are independent draws from a fixed
              distribution. Behavioural signals break that assumption. Fatigue builds over a drive, environmental
              pressure rises and falls, and nearby sensors move together. Forcing that slow variation into discrete
              states either needs far more states than the problem has meaning for, or it shows up as spurious regime
              switches. Neither helps an interface decide when to escalate.
            </p>
            <p>
              The fix is to give the model a second, continuous latent layer. The regimes stay few and interpretable,
              and the field absorbs the gradual drift, the spatial proximity and the non-stationary noise around them.
            </p>

            <h2>The HMM backbone</h2>
            <Figure
              src="/case-studies/hmm-regimes.png"
              alt="Four regimes in a row, calm, alert, high-stress and panic, with self-transitions, transitions between neighbours, and a dashed direct jump from calm to panic"
              w={1138}
              h={419}
              label="Figure 2 · Regimes and transitions"
            >
              Each regime has its own emission <C>N(μ_k + H x_t, Σ_k)</C>. Most mass sits on self-transitions and
              neighbours, but the model keeps a direct path such as <C>a_14</C> from calm to panic, because the moments
              that matter most are the ones with no gradual build-up.
            </Figure>

            <h2>Keeping the field sparse with SPDE</h2>
            <p>
              A Gaussian field with a Matérn covariance is the natural choice for smooth variation, but its covariance
              matrix is dense, and every likelihood evaluation would cost a dense factorisation. The SPDE approach of
              Lindgren, Rue and Lindström replaces it. A Matérn field is the solution of
              <C>(κ² − Δ)^(α/2) (τ x) = W</C>, driven by white noise <C>W</C>. Solving that equation with finite
              elements gives a Gaussian Markov random field whose precision is sparse. For <C>α = 2</C>,
              <C>Q = τ² (κ⁴ C + 2κ² G + G C⁻¹ G)</C>, where <C>C</C> is the lumped mass matrix and <C>G</C> the
              stiffness matrix.
            </p>
            <Figure
              src="/case-studies/hmm-sparse-precision.png"
              alt="Two matrix patterns for a 10 by 10 lattice: the dense covariance fills the whole square, the SPDE precision has a few narrow bands"
              w={919}
              h={491}
              label="Figure 3 · Dense covariance against sparse precision"
            >
              Computed on a 10 by 10 lattice with <C>n = 100</C>. The covariance has 10,000 entries. The precision has
              1,104 nonzeros, at most 13 per row, and that count per row stays fixed as the mesh grows. The parameter
              <C>κ</C> sets the range, about <C>√(8ν)/κ</C> with <C>ν = α − d/2</C>, and <C>τ</C> sets the variance.
            </Figure>

            <h2>Joint inference</h2>
            <p>
              Exact inference in a switching model is out of reach: the posterior over the field is a mixture of
              <C>K^T</C> Gaussians, one for every regime path. The model is split instead. Given the field, the regimes
              are an ordinary HMM, and forward filtering with backward sampling costs <C>O(TK²)</C>. Given the regimes,
              the field is Gaussian with precision <C>Q + Hᵀ D_S H</C>, which is still sparse, so one sparse Cholesky
              factorisation gives its mean and a sample.
            </p>
            <Figure
              src="/case-studies/hmm-inference-loop.png"
              alt="Two boxes exchanging estimates, a forward filter for the regimes and a Gaussian field update, both feeding a hyperparameter update"
              w={973}
              h={428}
              label="Figure 4 · The inference loop"
            >
              The two steps alternate, and the hyperparameters <C>θ = (A, μ_k, Σ_k, κ, τ)</C> are updated from the joint
              likelihood by EM or a Laplace step. The same Cholesky factor <C>L</C> that solves for the field gives
              <C>log|Q| = 2 Σ log L_ii</C>, so the likelihood costs no extra factorisation.
            </Figure>

            <h2>What the model buys</h2>
            <p>
              Few, meaningful regimes that map directly onto interface states and escalation logic. A continuous layer
              that explains slow drift instead of mislabelling it as a regime change. And a cost per step that grows with
              the number of nonzeros in <C>Q</C>, not with the square of the field size.
            </p>

            <h2>Evidence status</h2>
            <p>
              This is a model design, not a measured result. Figure 3 is computed from a real lattice precision, but the
              regimes, transitions and emission parameters are illustrative and have not been fitted to recorded data.
              Detection accuracy and latency are open until they are.
            </p>

            <h2>References</h2>
            <ul className="cs-refs">
              <li><a href="https://doi.org/10.1111/j.1467-9868.2011.00777.x">Lindgren, Rue and Lindström, An explicit link between Gaussian fields and Gaussian Markov random fields: the SPDE approach</a></li>
              <li><a href="https://en.wikipedia.org/wiki/Hidden_Markov_model">Hidden Markov model overview</a></li>
            </ul>
            <p>
              <Link to="/case-studies/armv9-weak-memory-sve2/">Previous case study: Weak memory and SVE2 on Armv9.0-A</Link>
              <br />
              <Link to="/case-studies/spde-gmrf-gpu-edge/">Next case study: Lifting SPDE-GMRF fields to the GPU and the edge</Link>
            </p>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}
