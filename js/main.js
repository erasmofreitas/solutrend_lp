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
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const sendingLabels = { pt: "Enviando...", en: "Sending...", es: "Enviando..." };
    const successLabels = {
      pt: "Mensagem enviada com sucesso. Retornaremos em até 24h úteis.",
      en: "Message sent successfully. We will get back to you within 24 business hours.",
      es: "Mensaje enviado con éxito. Le responderemos en un máximo de 24 horas hábiles."
    };
    const errorLabels = {
      pt: "Não foi possível enviar sua mensagem agora. Tente novamente em alguns minutos.",
      en: "We couldn't send your message right now. Please try again in a few minutes.",
      es: "No pudimos enviar tu mensaje ahora. Inténtalo de nuevo en unos minutos."
    };

    function getLangCode(form) {
      const languageEl = form.querySelector('input[name="language"]');
      let code = languageEl && languageEl.value ? String(languageEl.value).toLowerCase() : "en";
      if (code !== "pt" && code !== "en" && code !== "es") code = "en";
      return code;
    }

    function setButtonState(button, disabled, text) {
      if (!button) return;
      button.disabled = disabled;
      if (text !== undefined) button.textContent = text;
    }

    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const form = event.target;
      if (!(form instanceof HTMLFormElement)) return;

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const langCode = getLangCode(form);

      const getVal = function (name) {
        const el = form.querySelector("[name=\"" + name + "\"]");
        if (!el) return "";
        const v = el.value;
        return typeof v === "string" ? v.trim() : "";
      };

      const name = getVal("name");
      const email = getVal("email");
      const company = getVal("company");
      const needType = getVal("need_type");
      const projectContext = getVal("project_context");
      const message = getVal("message");
      const website = getVal("website");
      const formLoadedAt = getVal("formLoadedAt");
      const language = getVal("language");
      const page = getVal("page");

      const payload = {
        name: name,
        email: email,
        company: company,
        needType: needType,
        projectContext: projectContext,
        message: message,
        website: website,
        formLoadedAt: formLoadedAt,
        language: language,
        page: page
      };

      const originalBtnText = submitBtn ? submitBtn.textContent : "";
      setButtonState(submitBtn, true, sendingLabels[langCode]);
      successMessage.textContent = "";

      fetch("https://api.solutrend.com.br/v1/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
        .then(function (response) {
          if (!response.ok) {
            throw new Error("API error: " + response.status);
          }
          return response;
        })
        .then(function () {
          successMessage.textContent = successLabels[langCode];
          form.reset();

          const loadedAtInput = form.querySelector("#form-loaded-at");
          if (loadedAtInput) {
            loadedAtInput.value = Date.now().toString();
          }
          const languageInput = form.querySelector('input[name="language"]');
          const pageInput = form.querySelector('input[name="page"]');
          if (languageInput) languageInput.value = language;
          if (pageInput) pageInput.value = page;

          setButtonState(submitBtn, false, originalBtnText);
        })
        .catch(function () {
          successMessage.textContent = errorLabels[langCode];
          setButtonState(submitBtn, false, originalBtnText);
        });
    });
  }
});
