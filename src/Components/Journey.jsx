import Scramble from "./Scramble";
import SkillIcon from "./SkillIcon";

function Journey() {
  const skills = [
    {
      icon: "html",
      number: "01",
      name: "HTML",
      text: "Structure",
    },
    {
      icon: "css",
      number: "02",
      name: "CSS",
      text: "Visual language",
    },
    {
      icon: "js",
      number: "03",
      name: "JavaScript",
      text: "Interaction",
    },
    {
      icon: "react",
      number: "04",
      name: "React",
      text: "Experience",
    },
    {
      icon: "security",
      number: "05",
      name: "Security",
      text: "Protection",
    },
  ];

  return (
    <section className="section journey-section" id="journey">
      <div className="section-label">JOURNEY</div>

      <div className="journey-heading">
        <h2>
          <Scramble text="Learning the tools." />
          <br />
          <span>
            <Scramble text="Building the experience." delay={250} />
          </span>
        </h2>

        <p data-reveal style={{ "--reveal-delay": "0.3s" }}>
          Every technology changed the way I think about
          building for the web. Security changed how I
          think about protecting it.
        </p>
      </div>

      <div className="skills-track" data-reveal-group>
        {skills.map((skill, index) => (
          <div
            className="skill-card"
            key={skill.name}
            style={{ "--i": index }}
          >
            <div className="skill-top">
              <span>{skill.number}</span>
              <SkillIcon type={skill.icon} />
            </div>

            <h3>{skill.name}</h3>

            <p>{skill.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Journey;
