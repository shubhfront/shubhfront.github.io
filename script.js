// Dynamic year in footer
document.getElementById("year").textContent = new Date().getFullYear();

// Scroll to Projects section on button click
document.getElementById("viewProjects").addEventListener("click", () => {
  document.getElementById("projects").scrollIntoView({ behavior: "smooth" });
});

// Subtle fade-in animation on scroll
const elements = document.querySelectorAll("section, .project-card, .skill");
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, { threshold: 0.1 });

elements.forEach((el) => observer.observe(el));

// CSS for animation (inject dynamically)
const style = document.createElement("style");
style.textContent = `
  .visible {
    opacity: 1 !important;
    transform: translateY(0) !important;
  }
  section, .project-card, .skill {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.6s ease-out;
  }
`;
document.head.appendChild(style);
