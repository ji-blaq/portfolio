import Scramble from "./Scramble";
import SignalFlow from "./SignalFlow";

function About() {
  const facts = ["Communication", "Interface", "Experience", "Security"];

  return (
    <section className="section about-section" id="about">
      <div className="section-label">ABOUT</div>

      <div className="about-grid">
        <div className="about-intro">
          <h2>
            <Scramble text="I didn't start" />
            <br />
            <span>
              <Scramble text="with code." delay={250} />
            </span>
          </h2>

          <SignalFlow />
        </div>

        <div className="about-copy">
          <p data-reveal>
            My background is in Mass Communication, with a
            focus on PR and Advertising. Before I started
            building interfaces, I was already interested in
            how people receive information, what makes them
            pay attention, and why some messages work while
            others disappear.
          </p>

          <p data-reveal style={{ "--reveal-delay": "0.1s" }}>
            Frontend development became another way to explore
            that same curiosity — except now I get to build
            the thing people interact with.
          </p>

          <p data-reveal style={{ "--reveal-delay": "0.2s" }}>
            Now I'm learning cybersecurity and ethical hacking.
            The tricks that make a message persuasive — urgency,
            authority, trust — are the same ones attackers use
            to fool people. Understanding both sides helps me
            build interfaces that are clearer and harder to
            misuse.
          </p>

          <div className="about-facts" data-reveal-group>
            {facts.map((fact, index) => (
              <div key={fact} style={{ "--i": index }}>
                <strong>{String(index + 1).padStart(2, "0")}</strong>
                <span>{fact}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
