import {
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6";
import { Mail } from "lucide-react";
import Scramble from "./Scramble";

function Contact() {
  return (
    <section className="section contact-section" id="contact">
      <div className="section-label">CONTACT</div>

      <div className="contact-main">
        <div className="contact-heading">
          <h2>
            <Scramble text="Let's build" />
            <br />
            <span>
              <Scramble text="something useful." delay={250} />
            </span>
          </h2>

          {/* radar: the sweep lights up each dot as it passes */}
          <div className="radar-wrap" data-reveal style={{ "--reveal-delay": "0.3s" }}>
            <div className="radar" aria-hidden="true">
              <div className="radar-ring" />
              <div className="radar-ring" />
              <div className="radar-ring" />
              <div className="radar-sweep" />
              <div className="radar-blip b1" />
              <div className="radar-blip b2" />
              <div className="radar-blip b3" />
              <div className="radar-blip b4" />
              <div className="radar-center" />
            </div>

            <p className="radar-caption">Scanning for new projects</p>
          </div>
        </div>

        <div className="contact-right" data-reveal style={{ "--reveal-delay": "0.15s" }}>
          <p>
            Have a project, idea, or opportunity that needs someone who
            thinks about the interface, the message, and keeping both
            safe? Let's talk about it.
          </p>

          <a
            href="mailto:ajimatioluwatimilehinazeez@gmail.com"
            className="email-link"
          >
            <span>
              <Scramble
                text="ajimatioluwatimilehinazeez@gmail.com"
                delay={500}
                duration={1300}
              />
            </span>
            <span className="email-arrow">↗</span>
          </a>

          <div className="socials">
            <a
              href="https://www.instagram.com/ji_blaq0?igsi=bmxwaGNwdTdkcWJz&utm_source=qr"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram size={19} />
            </a>

            <a
              href="https://www.linkedin.com/in/oluwatimilehin-ajimati-b339633b6?utm_source=share_via&utm_content=profile&utm_medium=member_ios"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
            >
              <FaLinkedinIn size={18} />
            </a>

            <a
              href="https://x.com/ji_blaq?s=11"
              target="_blank"
              rel="noreferrer"
              aria-label="X"
            >
              <FaXTwitter size={17} />
            </a>

            <a
              href="mailto:ajimatioluwatimilehinazeez@gmail.com"
              aria-label="Email"
            >
              <Mail size={19} />
            </a>
          </div>
        </div>
      </div>

      <footer>
        <span>OLUWATIMILEHIN AZEEZ AJIMATI</span>
        <span>FRONTEND × COMMUNICATION × SECURITY</span>
        <span>© 2026</span>
      </footer>
    </section>
  );
}

export default Contact;