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

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" || event.key === "Esc") {
        if (navList.classList.contains("is-open")) {
          navList.classList.remove("is-open");
          navToggle.setAttribute("aria-expanded", "false");
        }
      }
    });
  }

  const header = document.querySelector(".site-header");
  if (header) {
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

  const langLinks = document.querySelectorAll(".lang-link");
  if (langLinks.length > 0) {
    langLinks.forEach((link) => {
      link.addEventListener("click", (event) => {
        const href = link.getAttribute("href");
        if (!href) return;

        event.preventDefault();

        const currentHash = window.location.hash || "";
        const targetUrl = href + currentHash;
        window.location.href = targetUrl;
      });
    });
  }

  const contactForm = document.getElementById("contact-form");
  const successMessage = document.getElementById("form-success");

  if (contactForm && successMessage) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const form = event.target;
      if (!(form instanceof HTMLFormElement)) {
        return;
      }

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var nameEl = form.querySelector('[name="name"]');
      var emailEl = form.querySelector('[name="email"]');
      var companyEl = form.querySelector('[name="company"]');
      var needEl = form.querySelector('[name="need_type"]');
      var messageEl = form.querySelector('[name="message"]');

      var nameVal = nameEl ? (nameEl.value || "").trim() : "";
      var emailVal = emailEl ? (emailEl.value || "").trim() : "";
      var companyVal = companyEl ? (companyEl.value || "").trim() : "";
      var needVal = needEl && needEl.value ? needEl.value.trim() : "";
      var messageVal = messageEl ? (messageEl.value || "").trim() : "";

      var bodyLines = ["Name: " + nameVal, "Email: " + emailVal];
      if (companyVal) bodyLines.push("Company: " + companyVal);
      if (needVal) bodyLines.push("Need type: " + needVal);
      bodyLines.push("Message: " + messageVal);
      var body = bodyLines.join("\n");
      var mailtoUrl = "mailto:contato@solutrend.com?subject=Contact%20form&body=" + encodeURIComponent(body);

      window.location.href = mailtoUrl;

      form.reset();
      var lang = (document.documentElement.lang || "en").toLowerCase();
      successMessage.textContent = lang.indexOf("pt") === 0 ? "Obrigado! Responderemos em breve." : lang.indexOf("es") === 0 ? "¡Gracias! Te responderemos pronto." : "Thanks! We'll reply soon.";
    });
  }
});

