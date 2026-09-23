const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Reveal sections once as they enter the viewport. IntersectionObserver keeps this
// off the scroll thread, so the page stays smooth even on integrated graphics.
const revealItems = document.querySelectorAll(".reveal");
if (!prefersReducedMotion && "IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

// Update the nav without running layout calculations on every scroll event.
const navLinks = [...document.querySelectorAll(".nav a")];
const sectionMap = new Map();

navLinks.forEach((link) => {
  const section = document.querySelector(link.getAttribute("href"));
  if (section) sectionMap.set(section, link);
});

if ("IntersectionObserver" in window) {
  const navObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;
      const activeLink = sectionMap.get(visible.target);
      navLinks.forEach((link) => link.classList.toggle("is-active", link === activeLink));
    },
    { rootMargin: "-28% 0px -58% 0px", threshold: [0, 0.01, 0.2] }
  );

  sectionMap.forEach((_, section) => navObserver.observe(section));
}
