/* =============================================================
   PORTFOLIO — SARAH FITAHINA SOANOMENIAVO
   Script principal (JavaScript vanilla)
   Sommaire :
   1. Navigation (sticky, hamburger, lien actif, scroll fluide)
   2. Animations au scroll (IntersectionObserver)
   3. Animation d'entrée du Hero
   4. Filtre des projets
   5. Validation du formulaire de contact
   6. Bouton retour en haut
   7. Mode sombre
============================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* -----------------------------------------------------------
     1. NAVIGATION
  ------------------------------------------------------------ */
  const navbar   = document.getElementById("navbar");
  const navToggle = document.getElementById("navToggle");
  const navMenu   = document.getElementById("navMenu");
  const navLinks  = document.querySelectorAll(".nav-link");

  // Ombre + fond de la navbar au scroll
  const handleNavbarScroll = () => {
    navbar.classList.toggle("is-scrolled", window.scrollY > 12);
  };
  handleNavbarScroll();
  window.addEventListener("scroll", handleNavbarScroll, { passive: true });

  // Menu hamburger (mobile)
  const closeMenu = () => {
    navMenu.classList.remove("is-open");
    navToggle.classList.remove("is-active");
    navToggle.setAttribute("aria-expanded", "false");
  };

  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("is-open");
    navToggle.classList.toggle("is-active", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Fermer le menu après un clic sur un lien (mobile) + scroll fluide
  navLinks.forEach((link) => {
    link.addEventListener("click", () => closeMenu());
  });

  // Mise en évidence du lien actif selon la section visible
  const sections = document.querySelectorAll("main section[id], main#accueil");
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute("id");
        navLinks.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
        });
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((section) => sectionObserver.observe(section));

  /* -----------------------------------------------------------
     2. ANIMATIONS AU SCROLL (IntersectionObserver)
  ------------------------------------------------------------ */
  const revealEls = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  revealEls.forEach((el) => revealObserver.observe(el));

  /* -----------------------------------------------------------
     3. ANIMATION D'ENTRÉE DU HERO
  ------------------------------------------------------------ */
  const hero = document.querySelector(".hero");
  // On déclenche la séquence dès le chargement, sans attendre le scroll
  requestAnimationFrame(() => hero.classList.add("is-loaded"));
  // Les éléments du hero sont aussi marqués .reveal : on les rend visibles
  // directement pour ne pas dépendre de l'IntersectionObserver au chargement.
  hero.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));

  /* -----------------------------------------------------------
     4. FILTRE DES PROJETS
  ------------------------------------------------------------ */
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards  = document.querySelectorAll(".project-card");
  const filterEmpty   = document.getElementById("filterEmpty");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.getAttribute("data-filter");

      filterButtons.forEach((b) => b.classList.remove("is-active"));
      button.classList.add("is-active");

      let visibleCount = 0;

      projectCards.forEach((card) => {
        const matches = filter === "Tous" || card.getAttribute("data-tech") === filter;
        card.classList.toggle("is-hidden", !matches);
        if (matches) visibleCount += 1;
      });

      filterEmpty.hidden = visibleCount !== 0;
    });
  });

  /* -----------------------------------------------------------
     5. VALIDATION DU FORMULAIRE DE CONTACT
  ------------------------------------------------------------ */
  const contactForm = document.getElementById("contactForm");
  const confirmation = document.getElementById("formConfirmation");

  const fields = {
    name: {
      input: document.getElementById("name"),
      error: document.getElementById("nameError"),
      validate: (value) => value.trim().length >= 2,
      message: "Merci d'indiquer votre nom (2 caractères minimum).",
    },
    email: {
      input: document.getElementById("email"),
      error: document.getElementById("emailError"),
      validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),
      message: "Merci d'indiquer une adresse email valide.",
    },
    subject: {
      input: document.getElementById("subject"),
      error: document.getElementById("subjectError"),
      validate: (value) => value.trim().length >= 3,
      message: "Merci d'indiquer un sujet (3 caractères minimum).",
    },
    message: {
      input: document.getElementById("message"),
      error: document.getElementById("messageError"),
      validate: (value) => value.trim().length >= 10,
      message: "Votre message doit contenir au moins 10 caractères.",
    },
  };

  const validateField = (field) => {
    const isValid = field.validate(field.input.value);
    field.input.closest(".form-group").classList.toggle("has-error", !isValid);
    field.error.textContent = isValid ? "" : field.message;
    return isValid;
  };

  Object.values(fields).forEach((field) => {
    field.input.addEventListener("blur", () => validateField(field));
    field.input.addEventListener("input", () => {
      if (field.input.closest(".form-group").classList.contains("has-error")) {
        validateField(field);
      }
    });
  });

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const allValid = Object.values(fields)
      .map((field) => validateField(field))
      .every(Boolean);

    if (!allValid) {
      confirmation.textContent = "";
      return;
    }

    // Aucun backend n'est connecté : on affiche uniquement une confirmation
    // côté client. Le message n'est pas réellement envoyé par email.
    confirmation.textContent =
      "Merci ! Votre message a bien été préparé (aucun envoi réel : pensez à connecter un service d'envoi d'email).";
    contactForm.reset();

    setTimeout(() => { confirmation.textContent = ""; }, 6000);
  });

  /* -----------------------------------------------------------
     6. BOUTON RETOUR EN HAUT
  ------------------------------------------------------------ */
  const backToTop = document.getElementById("backToTop");

  window.addEventListener(
    "scroll",
    () => backToTop.classList.toggle("is-visible", window.scrollY > 480),
    { passive: true }
  );

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* -----------------------------------------------------------
     7. MODE SOMBRE
  ------------------------------------------------------------ */
  const themeToggle = document.getElementById("themeToggle");
  const root = document.documentElement;
  const STORAGE_KEY = "sarah-portfolio-theme";

  const applyTheme = (theme) => {
    if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
      themeToggle.setAttribute("aria-label", "Activer le mode clair");
    } else {
      root.removeAttribute("data-theme");
      themeToggle.setAttribute("aria-label", "Activer le mode sombre");
    }
  };

  // Récupère la préférence enregistrée, sinon celle du système
  let savedTheme = null;
  try {
    savedTheme = localStorage.getItem(STORAGE_KEY);
  } catch (error) {
    // localStorage indisponible (navigation privée, etc.) : on ignore.
  }

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(savedTheme || (prefersDark ? "dark" : "light"));

  themeToggle.addEventListener("click", () => {
    const isDark = root.getAttribute("data-theme") === "dark";
    const nextTheme = isDark ? "light" : "dark";
    applyTheme(nextTheme);
    try {
      localStorage.setItem(STORAGE_KEY, nextTheme);
    } catch (error) {
      // Impossible de sauvegarder la préférence : on continue sans bloquer.
    }
  });

});