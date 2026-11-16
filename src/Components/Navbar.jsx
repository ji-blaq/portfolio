import { Menu, X } from "lucide-react";
import { useState } from "react";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    ["Identity", "identity"],
    ["About", "about"],
    ["Education", "education"],
    ["Journey", "journey"],
    ["Projects", "projects"],
    ["Contact", "contact"],
  ];

  const goTo = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });

    setMenuOpen(false);
  };

  return (
    <header className="navbar">
      <button
        className="logo"
        onClick={() =>
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          })
        }
      >
        OAA.
      </button>

      <nav className="desktop-nav">
        {links.map(([name, id]) => (
          <button key={id} onClick={() => goTo(id)}>
            {name}
          </button>
        ))}
      </nav>

      <button
        className="hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Open menu"
      >
        {menuOpen ? <X size={23} /> : <Menu size={23} />}
      </button>

      {menuOpen && (
        <nav className="mobile-nav">
          {links.map(([name, id]) => (
            <button key={id} onClick={() => goTo(id)}>
              {name}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}

export default Navbar;