import Scramble from "./Scramble";

function Identity() {
  return (
    <section className="section identity-section" id="identity">
      <div className="section-label">IDENTITY</div>

      <div className="identity-grid">
        <div>
          <h2>
            <Scramble text="Three disciplines." />
            <br />
            <span>
              <Scramble text="One way of thinking." delay={250} />
            </span>
          </h2>
        </div>

        <div className="identity-visual" data-reveal>
          <div className="identity-world">
            <div className="orbit orbit-one">
              <span>PR</span>
            </div>

            <div className="orbit orbit-two">
              <span>UI</span>
            </div>

            <div className="orbit orbit-three">
              <span>SEC</span>
            </div>

            <div className="identity-center">+</div>
          </div>

          <p className="identity-caption">
            Campaign thinking meets product thinking,
            <br />
            with security protecting both.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Identity;
