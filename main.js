(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const make = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };

  /* ---- رندر پروژه‌ها از روی projects.js ---- */
  function renderProject(p, index) {
    const filled = Boolean(p.title);
    const card = make("article", "project" + (filled ? "" : " project--empty"));

    const media = make("div", "project__media");
    if (p.image && p.image.src) {
      const img = make("img");
      img.src = p.image.src;
      img.alt = p.image.alt || "";
      if (p.image.width) img.width = p.image.width;
      if (p.image.height) img.height = p.image.height;
      img.loading = "lazy";
      media.append(img);
    } else {
      media.append(make("span", "project__slot", "project_" + (index + 1)));
    }
    card.append(media);

    card.append(make("h3", "", filled ? p.title : "پروژهٔ " + (index === 0 ? "اول" : "دوم")));
    card.append(make("p", "", p.description || (filled ? "" : "این جایگاه برای یکی از پروژه‌های بعدی رزرو شده است.")));

    if (p.tags && p.tags.length) {
      const ul = make("ul", "tags");
      p.tags.forEach((t) => ul.append(make("li", "", t)));
      card.append(ul);
    }

    if (p.url) {
      const a = make("a", "btn btn--ghost", "مشاهدهٔ پروژه");
      a.href = p.url;
      if (p.external) { a.target = "_blank"; a.rel = "noopener noreferrer"; }
      card.append(a);
    } else {
      const s = make("span", "btn", "به‌زودی");
      s.setAttribute("aria-disabled", "true");
      card.append(s);
    }
    return card;
  }

  const list = $("#project-list");
  if (list) (window.GLITCHLOG_PROJECTS || []).forEach((p, i) => list.append(renderProject(p, i)));

  /* ---- منوی موبایل ---- */
  const btn = $(".menu-btn"), nav = $("#nav");
  if (btn && nav) {
    const set = (open) => {
      nav.dataset.open = open;
      btn.setAttribute("aria-expanded", open);
    };
    btn.addEventListener("click", () => set(btn.getAttribute("aria-expanded") !== "true"));
    nav.addEventListener("click", (e) => { if (e.target.closest("a")) set(false); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") set(false); });
  }

  /* ---- لینک فعال در هدر ---- */
  const links = [...document.querySelectorAll(".nav a")];
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        links.forEach((a) => a.toggleAttribute("aria-current", a.getAttribute("href") === "#" + en.target.id));
        links.forEach((a) => a.hasAttribute("aria-current") && a.setAttribute("aria-current", "true"));
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    links.forEach((a) => { const s = $(a.getAttribute("href")); if (s) io.observe(s); });
  }

  /* ---- سال کپی‌رایت ---- */
  const y = $("#year");
  if (y) y.textContent = new Date().getFullYear();
})();
