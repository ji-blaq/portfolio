import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import Scramble from "./Scramble";
import BrowserDemo from "./BrowserDemo";
import Gallery from "./Gallery";
import "../browser-demo.css";

// 420 Collections screenshots
import homeImage from "../assets/home.png";
import productsImage from "../assets/products.png";
import productImage from "../assets/product.png";
import cartImage from "../assets/cart.png";
import checkoutImage from "../assets/checkout.png";

// Apex Advisory screenshots
import apexHome from "../assets/apex-home.png";
import apexServices from "../assets/apex-services.png";
import apexCaseStudies from "../assets/apex-case-studies.png";
import apexInsights from "../assets/apex-insights.png";
import apexContact from "../assets/apex-contact.png";

// ArtMind AI screenshots
import artmindHome from "../assets/artmind-home.jpg";
import artmindExplore from "../assets/artmind-explore.jpg";
import artmindCategories from "../assets/artmind-categories.jpg";
import artmindAi from "../assets/artmind-ai.jpg";
import artmindAbout from "../assets/artmind-about.jpg";

// All your projects live here.
// display: "slider"  -> the slideshow (420 Collections)
// display: "browser" -> the self-playing browser window (Apex Advisory)
// display: "gallery" -> the moving gallery wall (ArtMind AI)
const projects = [
  {
    name: "420 Collections",
    title: "420",
    subtitle: "Collections.",
    description:
      "A fashion e-commerce experience built around product discovery, responsive layouts, and interactive shopping.",
    tags: ["React", "JavaScript", "CSS", "API"],
    category: "ECOMMERCE / FRONTEND",
    link: "https://420-collections.vercel.app/",
    display: "slider",
    slides: [
      { image: homeImage, label: "HOME" },
      { image: productsImage, label: "PRODUCTS" },
      { image: productImage, label: "PRODUCT" },
      { image: cartImage, label: "CART" },
      { image: checkoutImage, label: "CHECKOUT" },
    ],
  },
  {
    name: "Apex Advisory",
    title: "Apex",
    subtitle: "Advisory.",
    description:
      "A concept website for a business consulting firm, built to earn trust fast and guide visitors from services and case studies to booking a free consultation.",
    tags: ["React", "Vite", "Tailwind CSS", "Responsive"],
    category: "CONSULTING / FRONTEND",
    link: "https://consulting-site-lilac.vercel.app/",
    display: "browser",
    domain: "consulting-site-lilac.vercel.app",
    pages: [
      { image: apexHome, label: "Home", path: "/" },
      { image: apexServices, label: "Services", path: "/services" },
      { image: apexCaseStudies, label: "Case studies", path: "/case-studies" },
      { image: apexInsights, label: "Insights", path: "/insights" },
      { image: apexContact, label: "Contact", path: "/contact" },
    ],
  },
  {
    name: "ArtMind AI",
    title: "ArtMind",
    subtitle: "AI.",
    description:
      "An art discovery website built as a team at Aptech. Visitors explore 60 paintings, browse six categories, and search by simply describing what they want to see.",
    tags: ["React", "JavaScript", "CSS", "Team project"],
    category: "TEAM PROJECT / FRONTEND",
    link: "https://artmind-ai-eproject.vercel.app/",
    display: "gallery",
    pieces: [
      { image: artmindHome, title: "Home", note: "Discover art beyond imagination" },
      { image: artmindExplore, title: "Explore Art", note: "60 paintings, tagged by style" },
      { image: artmindCategories, title: "Categories", note: "Six ways into the collection" },
      { image: artmindAi, title: "AI Discovery", note: "Describe it, find it" },
      { image: artmindAbout, title: "About", note: "Where great art meets intelligence" },
    ],
  },
];

// Turns 1 into "01", 2 into "02", and so on
const pad = (number) => String(number).padStart(2, "0");

// The slideshow (same as before)
function Slider({ name, slides }) {
  const [current, setCurrent] = useState(0);

  // Next slide after 4 seconds. The timer restarts whenever the slide
  // changes, so clicking an arrow gives a full 4 seconds before it moves.
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearTimeout(timer);
  }, [current, slides.length]);

  const previous = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const next = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const slide = slides[current];

  return (
    <div className="project-showcase" data-reveal>
      <div className="project-image">
        {/* key makes each new slide fade in */}
        <img
          key={current}
          className="slide-in"
          src={slide.image}
          alt={`${name} ${slide.label}`}
        />
      </div>

      <div className="project-controls">
        <span>
          {pad(current + 1)} / {slide.label}
        </span>

        <div className="slider-buttons">
          <button onClick={previous} aria-label="Previous">
            <ArrowLeft size={17} />
          </button>

          <button onClick={next} aria-label="Next">
            <ArrowRight size={17} />
          </button>
        </div>
      </div>

      <div className="project-progress">
        {slides.map((_, index) => (
          <button
            key={index}
            className={index === current ? "active" : ""}
            onClick={() => setCurrent(index)}
            aria-label={`View slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// One project: heading, description, tags, preview, link
function Project({ project, index, total }) {
  return (
    <article className="project">
      <div className="work-heading">
        <div>
          <span className="project-number">
            PROJECT {pad(index + 1)} / {pad(total)}
          </span>

          <h2>
            <Scramble text={project.title} />
            <br />
            <span>
              <Scramble text={project.subtitle} delay={200} />
            </span>
          </h2>
        </div>

        <div data-reveal style={{ "--reveal-delay": "0.2s" }}>
          <p>{project.description}</p>

          <div className="work-tags">
            {project.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>
      </div>

      {project.display === "browser" && (
        <BrowserDemo
          name={project.name}
          domain={project.domain}
          pages={project.pages}
        />
      )}

      {project.display === "gallery" && (
        <Gallery name={project.name} pieces={project.pieces} />
      )}

      {project.display === "slider" && (
        <Slider name={project.name} slides={project.slides} />
      )}

      <div className="project-bottom">
        <span>{project.category}</span>

        <a href={project.link} target="_blank" rel="noreferrer">
          View project
          <ExternalLink size={15} />
        </a>
      </div>
    </article>
  );
}

function Work() {
  return (
    <section className="section work-section" id="projects">
      <div className="section-label">SELECTED WORK</div>

      {projects.map((project, index) => (
        <Project
          key={project.name}
          project={project}
          index={index}
          total={projects.length}
        />
      ))}
    </section>
  );
}

export default Work;
