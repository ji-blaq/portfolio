function Education() {
  return (
    <section className="section education-section" id="education">
      <div className="section-label">EDUCATION</div>

      <div className="timeline">
        <div className="timeline-item active" data-reveal>
          <div className="timeline-year">2019 — 2024</div>

          <div className="timeline-line">
            <span></span>
          </div>

          <div className="timeline-content">
            <h3>Mass Communication</h3>

            <p>
              Kwara State University
              <br />
              Malete, Nigeria
            </p>

            <small>
              PR · Advertising · Media · Communication
            </small>
          </div>
        </div>

        <div className="timeline-item" data-reveal>
          <div className="timeline-year">NOW</div>

          <div className="timeline-line">
            <span></span>
          </div>

          <div className="timeline-content">
            <h3>Frontend Development</h3>

            <p>
              Turning communication principles into
              interactive digital experiences.
            </p>

            <small>
              HTML · CSS · JavaScript · React
            </small>
          </div>
        </div>

        <div className="timeline-item" data-reveal>
          <div className="timeline-year">LEARNING</div>

          <div className="timeline-line">
            <span></span>
          </div>

          <div className="timeline-content">
            <h3>Cybersecurity &amp; Ethical Hacking</h3>

            <p>
              Learning how systems get attacked, so I can
              build interfaces that hold up.
            </p>

            <small>
              Web Security · Ethical Hacking · Networking · Linux
            </small>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Education;