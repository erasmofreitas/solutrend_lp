document.addEventListener("DOMContentLoaded", function () {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear().toString();
  }

  const navToggle = document.querySelector(".nav-toggle");
  const navList = document.querySelector(".nav-list");

  if (navToggle && navList) {
    navToggle.addEventListener("click", () => {
      const isOpen = navList.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    navList.addEventListener("click", (event) => {
      const target = event.target;
      if (target instanceof HTMLElement && target.tagName.toLowerCase() === "a") {
        navList.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  const header = document.querySelector(".site-header");
  const hero = document.querySelector(".section-hero");

  if (header && hero) {
    const headerHeight = header.getBoundingClientRect().height;

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (event) => {
        const href = link.getAttribute("href");
        if (!href || href === "#" || href === "#top") {
          return;
        }

        const targetId = href.slice(1);
        const targetEl = document.getElementById(targetId);
        if (!targetEl) {
          return;
        }

        event.preventDefault();

        const targetRect = targetEl.getBoundingClientRect();
        const offset = window.scrollY + targetRect.top - headerHeight - 12;

        window.scrollTo({
          top: offset,
          behavior: "smooth"
        });
      });
    });
  }
});

