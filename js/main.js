document.addEventListener("DOMContentLoaded", function () {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear().toString();
  }

  const loadedAt = document.getElementById("form-loaded-at");
  if (loadedAt) {
    loadedAt.value = Date.now().toString();
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

      var languageEl = form.querySelector('input[name="language"]');
      var langCode = languageEl && languageEl.value ? String(languageEl.value).toLowerCase() : "en";
      if (langCode !== "pt" && langCode !== "en" && langCode !== "es") {
        langCode = "en";
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

      try {
        window.location.href = mailtoUrl;

        form.reset();

        if (langCode === "pt") {
          successMessage.textContent = "Mensagem enviada com sucesso. Retornaremos em até 24h úteis.";
        } else if (langCode === "es") {
          successMessage.textContent = "Mensaje enviado con éxito. Le responderemos en un máximo de 24 horas hábiles.";
        } else {
          successMessage.textContent = "Message sent successfully. We will get back to you within 24 business hours.";
        }
      } catch (error) {
        if (langCode === "pt") {
          successMessage.textContent = "Não foi possível enviar sua mensagem agora. Tente novamente em alguns minutos.";
        } else if (langCode === "es") {
          successMessage.textContent = "No pudimos enviar tu mensaje ahora. Inténtalo de nuevo en unos minutos.";
        } else {
          successMessage.textContent = "We couldn't send your message right now. Please try again in a few minutes.";
        }
      }
    });
  }
});

