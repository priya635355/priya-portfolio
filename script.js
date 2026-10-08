const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".nav");
const themeButton = document.querySelector(".theme-toggle");
const profilePhoto = document.querySelector("#profile-photo");

function showProfilePhoto() {
  profilePhoto?.closest(".portrait-card")?.classList.add("has-photo");
  profilePhoto?.closest(".portrait-card")?.classList.remove("photo-missing");
}

function showPhotoPlaceholder() {
  profilePhoto?.closest(".portrait-card")?.classList.remove("has-photo");
  profilePhoto?.closest(".portrait-card")?.classList.add("photo-missing");
}

if (profilePhoto) {
  profilePhoto.addEventListener("load", showProfilePhoto);
  profilePhoto.addEventListener("error", showPhotoPlaceholder);
  if (profilePhoto.complete && profilePhoto.naturalWidth > 0)
    showProfilePhoto();
}

function closeMenu({ restoreFocus = false } = {}) {
  if (!menuButton || !navigation) return;
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open navigation");
  navigation.classList.remove("open");
  if (restoreFocus) menuButton.focus();
}

menuButton?.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menuButton.setAttribute(
    "aria-label",
    isOpen ? "Open navigation" : "Close navigation",
  );
  navigation?.classList.toggle("open", !isOpen);
});

navigation?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => closeMenu());
});

document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    menuButton?.getAttribute("aria-expanded") === "true"
  ) {
    closeMenu({ restoreFocus: true });
  }
});

document.addEventListener("click", (event) => {
  if (
    menuButton?.getAttribute("aria-expanded") === "true" &&
    !navigation?.contains(event.target) &&
    !menuButton.contains(event.target)
  )
    closeMenu();
});

const mobileBreakpoint = window.matchMedia("(max-width: 620px)");
mobileBreakpoint.addEventListener?.("change", (event) => {
  if (!event.matches) closeMenu();
});

function setTheme(dark, rememberChoice = false) {
  document.body.classList.toggle("dark", dark);
  themeButton?.setAttribute(
    "aria-label",
    dark ? "Switch to light theme" : "Switch to dark theme",
  );
  themeButton?.setAttribute("aria-pressed", String(dark));
  themeButton?.setAttribute(
    "title",
    dark ? "Switch to light theme" : "Switch to dark theme",
  );
  if (themeButton) themeButton.textContent = dark ? "☼" : "◐";
  if (rememberChoice) {
    try {
      localStorage.setItem("portfolio-theme-choice", dark ? "dark" : "light");
    } catch {
      // Theme switching still works when browser storage is unavailable.
    }
  }
}

let savedTheme = null;
try {
  savedTheme = localStorage.getItem("portfolio-theme-choice");
} catch {
  // Keep the default dark theme when browser storage is unavailable.
}
// Dark is the default. A theme changes only after the visitor switches it.
setTheme(savedTheme === "light" ? false : true);

themeButton?.addEventListener("click", () => {
  setTheme(!document.body.classList.contains("dark"), true);
});

const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();

const navLinks = [...document.querySelectorAll('.nav a[href^="#"]')];
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if ("IntersectionObserver" in window && sections.length) {
  const activeSectionObserver = new IntersectionObserver(
    (entries) => {
      const visibleSections = entries.filter((entry) => entry.isIntersecting);
      if (!visibleSections.length) return;
      const current = visibleSections.sort(
        (a, b) =>
          Math.abs(a.boundingClientRect.top - 120) -
          Math.abs(b.boundingClientRect.top - 120),
      )[0].target;

      navLinks.forEach((link) => {
        if (link.getAttribute("href") === `#${current.id}`) {
          link.setAttribute("aria-current", "location");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    },
    { rootMargin: "-15% 0px -65% 0px" },
  );

  sections.forEach((section) => activeSectionObserver.observe(section));
}

if (
  "IntersectionObserver" in window &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  const revealTargets = document.querySelectorAll(
    ".hero-copy, .portrait-card, .section-heading, .project, .about-grid, .job, .skills-grid article, .credentials article, .contact-inner",
  );

  if (revealTargets.length) {
    document.body.classList.add("js-motion");
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );

    revealTargets.forEach((target) => {
      target.classList.add("reveal");
      revealObserver.observe(target);
    });
  }
}
