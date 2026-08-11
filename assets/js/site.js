/* ==========================================================================
   Scammer Info Malaysia — shared behaviour
   i18n · navigation · reveal · counters · lightbox · gallery · scrollspy
   ========================================================================== */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* --------------------------------------------------------------- i18n -- */

  var BASE = {
    en: {
      "nav.home": "Home",
      "nav.case": "The Case",
      "nav.faq": "FAQ",
      "nav.links": "Report & Help",
      "nav.privacy": "Privacy & Legal",
      "brand.tag": "Scam awareness · Malaysia",
      "foot.about.title": "About",
      "foot.about.body":
        "An independent public-interest record of a documented fraud case in Malaysia. Everything published here is backed by receipts, documents and a police report.",
      "foot.nav.title": "Pages",
      "foot.help.title": "Get help now",
      "foot.help.nsrc": "NSRC hotline 997 — financial scams",
      "foot.help.mule": "Semak Mule — check accounts & phones",
      "foot.help.police": "Royal Malaysia Police",
      "foot.contact":
        "Spotted an error, or have information to add? Email us — corrections are welcome.",
      "foot.rights": "© 2024–2026 Scammer Info Malaysia. All rights reserved.",
      "foot.disclaimer":
        "Published in the public interest. Information is presented as documented by the victim and supporting evidence.",
      "sos.h2": "Just been scammed? Do not wait.",
      "sos.p": "The National Scam Response Centre answers 24 hours a day. Every minute matters when funds are still moving between accounts.",
      "sos.label": "NSRC hotline",
      "wa.frame": "Screenshot {n} of {m}",
      "lb.full": "Open full size",
      "lb.close": "Close",
      "lb.prev": "Previous",
      "lb.next": "Next",
      "top": "Back to top",
      "menu": "Menu"
    },
    ms: {
      "nav.home": "Laman Utama",
      "nav.case": "Kes Penipuan",
      "nav.faq": "Soalan Lazim",
      "nav.links": "Lapor & Bantuan",
      "nav.privacy": "Privasi & Undang-undang",
      "brand.tag": "Kesedaran penipuan · Malaysia",
      "foot.about.title": "Mengenai kami",
      "foot.about.body":
        "Rekod kepentingan awam yang bebas mengenai satu kes penipuan yang didokumentasi di Malaysia. Setiap maklumat di sini disokong resit, dokumen dan laporan polis.",
      "foot.nav.title": "Halaman",
      "foot.help.title": "Dapatkan bantuan",
      "foot.help.nsrc": "Talian NSRC 997 — penipuan kewangan",
      "foot.help.mule": "Semak Mule — semak akaun & telefon",
      "foot.help.police": "Polis Diraja Malaysia",
      "foot.contact":
        "Terjumpa maklumat tidak tepat, atau ada maklumat tambahan? E-mel kami — pembetulan dialu-alukan.",
      "foot.rights": "© 2024–2026 Scammer Info Malaysia. Hak cipta terpelihara.",
      "foot.disclaimer":
        "Diterbitkan untuk kepentingan awam. Maklumat dipaparkan seperti yang didokumentasi oleh mangsa dan bukti sokongan.",
      "sos.h2": "Baru sahaja ditipu? Jangan tunggu.",
      "sos.p": "Pusat Respons Penipuan Nasional menjawab 24 jam sehari. Setiap minit penting selagi wang masih bergerak antara akaun.",
      "sos.label": "Talian NSRC",
      "wa.frame": "Tangkapan skrin {n} daripada {m}",
      "lb.full": "Buka saiz penuh",
      "lb.close": "Tutup",
      "lb.prev": "Sebelum",
      "lb.next": "Seterusnya",
      "top": "Kembali ke atas",
      "menu": "Menu"
    }
  };

  var DICT = {
    en: Object.assign({}, BASE.en, (window.PAGE_I18N && window.PAGE_I18N.en) || {}),
    ms: Object.assign({}, BASE.ms, (window.PAGE_I18N && window.PAGE_I18N.ms) || {})
  };

  var STORE_KEY = "sim-lang";
  var lang = "en";

  function detectLang() {
    var saved;
    try { saved = localStorage.getItem(STORE_KEY); } catch (e) { /* private mode */ }
    if (saved === "en" || saved === "ms") return saved;
    var nav = (navigator.language || "en").toLowerCase();
    return nav.indexOf("ms") === 0 || nav.indexOf("id") === 0 ? "ms" : "en";
  }

  function t(key) {
    return (DICT[lang] && DICT[lang][key]) || (DICT.en && DICT.en[key]) || "";
  }

  function applyLang(next) {
    lang = next;
    var root = document.documentElement;
    root.setAttribute("lang", lang);
    root.setAttribute("data-lang", lang);

    try { localStorage.setItem(STORE_KEY, lang); } catch (e) { /* ignore */ }

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var v = t(el.getAttribute("data-i18n"));
      if (v) el.textContent = v;
    });
    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var v = t(el.getAttribute("data-i18n-html"));
      if (v) el.innerHTML = v;
    });
    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      var v = t(el.getAttribute("data-i18n-aria"));
      if (v) el.setAttribute("aria-label", v);
    });

    var title = t("page.title");
    if (title) document.title = title;

    document.querySelectorAll(".lang button").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.lang === lang));
    });

    // The head bootstrap hides translated nodes when the stored language is
    // not the one the HTML is authored in; they are safe to show now.
    root.classList.remove("i18n-pending");

    document.dispatchEvent(new CustomEvent("sim:lang", { detail: { lang: lang } }));
  }

  /* --------------------------------------------------------------- icons -- */

  var ICON = {
    bars: '<path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    x: '<path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    up: '<path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    left: '<path d="M15 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    right: '<path d="M9 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
  };

  function svg(path, cls) {
    return '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"' +
      (cls ? ' class="' + cls + '"' : "") + ">" + path + "</svg>";
  }

  /* ---------------------------------------------------------- navigation -- */

  function initNav() {
    var bar = document.querySelector(".topbar");
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.getElementById("primary-nav");

    if (bar) {
      var onScroll = function () { bar.classList.toggle("is-stuck", window.scrollY > 12); };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }

    if (toggle && nav) {
      toggle.innerHTML = svg(ICON.bars, "icon-bars") + svg(ICON.x, "icon-x");
      toggle.addEventListener("click", function () {
        var open = nav.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", String(open));
      });
      nav.addEventListener("click", function (e) {
        if (e.target.closest("a")) {
          nav.classList.remove("is-open");
          toggle.setAttribute("aria-expanded", "false");
        }
      });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && nav.classList.contains("is-open")) {
          nav.classList.remove("is-open");
          toggle.setAttribute("aria-expanded", "false");
          toggle.focus();
        }
      });
    }

    document.querySelectorAll(".lang button").forEach(function (b) {
      b.addEventListener("click", function () { applyLang(b.dataset.lang); });
    });

    // Mark the current page. Compare full resolved paths, not file names:
    // from /mmr/index.html the Home link "../index.html" also ends in
    // "index.html", which would light up Home and The Case at the same time.
    var normalise = function (url) {
      return url.pathname.replace(/\/$/, "/index.html");
    };
    var here = normalise(new URL(location.href));

    document.querySelectorAll(".nav a").forEach(function (a) {
      var href = a.getAttribute("href");
      if (!href || /^(https?:|mailto:|tel:|#)/i.test(href)) return;
      if (normalise(new URL(href, location.href)) === here) {
        a.setAttribute("aria-current", "page");
      } else {
        a.removeAttribute("aria-current");
      }
    });
  }

  /* ------------------------------------------------------------- to top -- */

  function initToTop() {
    var btn = document.querySelector(".to-top");
    if (!btn) return;
    btn.innerHTML = svg(ICON.up);
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
    var onScroll = function () { btn.classList.toggle("is-visible", window.scrollY > 520); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ------------------------------------------------------------- reveal -- */

  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    var showAll = function () {
      document.documentElement.classList.remove("js-reveal");
      items.forEach(function (el) { el.classList.add("is-in"); });
    };

    if (reduceMotion || !("IntersectionObserver" in window)) { showAll(); return; }

    // Only now is it safe to hide anything — the CSS rule is scoped to this class.
    document.documentElement.classList.add("js-reveal");

    var delivered = false;
    var io = new IntersectionObserver(function (entries) {
      delivered = true;
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var delay = parseInt(el.dataset.delay || "0", 10);
        setTimeout(function () { el.classList.add("is-in"); }, delay);
        io.unobserve(el);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

    items.forEach(function (el) { io.observe(el); });

    // If the observer never reports (throttled tab, exotic engine), drop the
    // effect entirely rather than leaving the page invisible.
    setTimeout(function () { if (!delivered) showAll(); }, 1500);
  }

  /* ----------------------------------------------------------- counters -- */

  function initCounters() {
    var nums = document.querySelectorAll("[data-count]");
    if (!nums.length) return;

    function run(el) {
      var target = parseFloat(el.dataset.count);
      var prefix = el.dataset.prefix || "";
      var suffix = el.dataset.suffix || "";
      if (reduceMotion) {
        el.textContent = prefix + target.toLocaleString("en-MY") + suffix;
        return;
      }
      var start = performance.now();
      var dur = 1300;
      function tick(now) {
        var p = Math.min((now - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = prefix + Math.round(target * eased).toLocaleString("en-MY") + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }

    if (!("IntersectionObserver" in window)) { nums.forEach(run); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { run(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.4 });
    nums.forEach(function (el) { io.observe(el); });
  }

  /* ------------------------------------------------------------- e-mail -- */

  function initEmail() {
    // kept obfuscated in source, assembled at runtime
    var user = ["4", "r", "r", "d", "c", "y", "f", "d", "v"].join("");
    var host = ["mozmail", "com"].join(".");
    var addr = user + "@" + host;
    document.querySelectorAll(".email").forEach(function (el) {
      var a = document.createElement("a");
      a.href = "mailto:" + addr;
      a.textContent = addr;
      el.textContent = "";
      el.appendChild(a);
    });
  }

  /* ----------------------------------------------------------- lightbox -- */

  var LB = {
    items: [],
    index: 0,
    el: null,
    img: null,
    cap: null,
    count: null,
    lastFocus: null
  };

  function buildLightbox() {
    var el = document.createElement("div");
    el.className = "lb";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-modal", "true");
    el.innerHTML =
      '<div class="lb__bar">' +
        '<span class="lb__count"></span>' +
        // The evidence screenshots are far wider than a phone screen; this
        // hands the raw file to the browser's own viewer so it can be zoomed.
        '<a class="lb__full" target="_blank" rel="noopener noreferrer"></a>' +
        '<button type="button" class="lb__btn lb__close">' + svg(ICON.x) + "</button>" +
      "</div>" +
      '<div class="lb__stage">' +
        '<button type="button" class="lb__btn lb__nav lb__nav--prev">' + svg(ICON.left) + "</button>" +
        '<img alt="">' +
        '<button type="button" class="lb__btn lb__nav lb__nav--next">' + svg(ICON.right) + "</button>" +
      "</div>" +
      '<p class="lb__cap"></p>';
    document.body.appendChild(el);

    LB.el = el;
    LB.img = el.querySelector("img");
    LB.cap = el.querySelector(".lb__cap");
    LB.count = el.querySelector(".lb__count");
    LB.full = el.querySelector(".lb__full");

    el.querySelector(".lb__close").addEventListener("click", closeLB);
    el.querySelector(".lb__nav--prev").addEventListener("click", function () { step(-1); });
    el.querySelector(".lb__nav--next").addEventListener("click", function () { step(1); });
    el.addEventListener("click", function (e) {
      if (e.target === el || e.target.classList.contains("lb__stage")) closeLB();
    });

    var x0 = null;
    el.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    el.addEventListener("touchend", function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 45) step(dx < 0 ? 1 : -1);
      x0 = null;
    }, { passive: true });

    document.addEventListener("keydown", function (e) {
      if (!el.classList.contains("is-open")) return;
      if (e.key === "Escape") closeLB();
      else if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "ArrowRight") step(1);
    });

    document.addEventListener("sim:lang", function () {
      if (el.classList.contains("is-open")) render();
      var c = el.querySelector(".lb__close");
      c.setAttribute("aria-label", t("lb.close"));
      el.querySelector(".lb__nav--prev").setAttribute("aria-label", t("lb.prev"));
      el.querySelector(".lb__nav--next").setAttribute("aria-label", t("lb.next"));
    });
  }

  function collectGroup(group) {
    return Array.prototype.slice.call(
      document.querySelectorAll('[data-lb][data-lb-group="' + group + '"]')
    ).filter(function (a) { return a.offsetParent !== null || a.dataset.lbForce === "1"; });
  }

  // Trigger may be an <a href> or any element carrying data-lb-href.
  function sourceOf(el) {
    return el.getAttribute("href") || el.dataset.lbHref || el.getAttribute("src") || "";
  }

  function render() {
    var a = LB.items[LB.index];
    if (!a) return;
    LB.img.src = sourceOf(a);
    LB.img.alt = a.dataset.lbAlt || a.getAttribute("alt") || "";
    var capKey = a.dataset.lbCapKey;
    var cap = capKey
      ? t(capKey)
      : (a.dataset["lbCap" + (lang === "ms" ? "Ms" : "En")] || a.dataset.lbCap || LB.img.alt);
    LB.cap.textContent = cap;
    LB.count.textContent = (LB.index + 1) + " / " + LB.items.length;
    LB.full.href = LB.img.src;
    LB.full.textContent = t("lb.full");
    var multi = LB.items.length > 1;
    LB.el.querySelector(".lb__nav--prev").style.display = multi ? "" : "none";
    LB.el.querySelector(".lb__nav--next").style.display = multi ? "" : "none";
    // preload neighbours
    [LB.index - 1, LB.index + 1].forEach(function (i) {
      var n = LB.items[(i + LB.items.length) % LB.items.length];
      if (n) { var im = new Image(); im.src = sourceOf(n); }
    });
  }

  function step(delta) {
    if (!LB.items.length) return;
    LB.index = (LB.index + delta + LB.items.length) % LB.items.length;
    render();
  }

  function openLB(anchor) {
    var group = anchor.dataset.lbGroup || "default";
    LB.items = collectGroup(group);
    LB.index = Math.max(0, LB.items.indexOf(anchor));
    LB.lastFocus = document.activeElement;
    LB.el.classList.add("is-open");
    document.body.style.overflow = "hidden";
    render();
    LB.el.querySelector(".lb__close").focus();
  }

  function closeLB() {
    LB.el.classList.remove("is-open");
    LB.img.removeAttribute("src");
    document.body.style.overflow = "";
    if (LB.lastFocus && LB.lastFocus.focus) LB.lastFocus.focus();
  }

  function initLightbox() {
    if (!document.querySelector("[data-lb]")) return;
    buildLightbox();
    document.addEventListener("click", function (e) {
      var a = e.target.closest("[data-lb]");
      if (!a) return;
      e.preventDefault();
      openLB(a);
    });
  }

  /* ------------------------------------------------- WhatsApp gallery -- */

  function initGallery() {
    var host = document.getElementById("wa-gallery");
    if (!host) return;

    var total = parseInt(host.dataset.total || "0", 10);
    var initial = parseInt(host.dataset.initial || "18", 10);
    var path = host.dataset.path || "WhatsApp/";
    var ext = host.dataset.ext || ".PNG";
    var caps = window.WA_CAPTIONS || {};

    var numbered = function (dict, i) {
      return (dict["wa.frame"] || "{n} / {m}")
        .replace("{n}", String(i))
        .replace("{m}", String(total));
    };

    var frag = document.createDocumentFragment();
    for (var i = 1; i <= total; i++) {
      var a = document.createElement("a");
      a.className = "thumb";
      a.href = path + i + ext;
      a.dataset.lb = "";
      a.dataset.lbGroup = "wa";
      a.dataset.lbAlt = numbered(DICT.en, i);
      if (caps[i]) {
        a.dataset.lbCapEn = caps[i].en;
        a.dataset.lbCapMs = caps[i].ms;
      } else {
        a.dataset.lbCapEn = numbered(DICT.en, i);
        a.dataset.lbCapMs = numbered(DICT.ms, i);
      }
      if (i > initial) a.hidden = true;
      var img = document.createElement("img");
      img.src = path + i + ext;
      img.alt = "WhatsApp " + i;
      img.loading = "lazy";
      img.decoding = "async";
      a.appendChild(img);
      frag.appendChild(a);
    }
    host.appendChild(frag);

    var btn = document.getElementById("wa-more");
    if (!btn) return;
    if (total <= initial) { btn.parentElement.hidden = true; return; }

    btn.addEventListener("click", function () {
      host.querySelectorAll("a[hidden]").forEach(function (a) { a.hidden = false; });
      btn.parentElement.hidden = true;
    });
  }

  // hidden anchors must still be reachable by the lightbox once revealed;
  // offsetParent check in collectGroup handles that automatically.

  /* ----------------------------------------------------------- scrollspy -- */

  function initScrollSpy() {
    var links = document.querySelectorAll(".toc a[href^='#']");
    if (!links.length || !("IntersectionObserver" in window)) return;

    var map = {};
    var targets = [];
    links.forEach(function (a) {
      var id = a.getAttribute("href").slice(1);
      var el = document.getElementById(id);
      if (el) { map[id] = a; targets.push(el); }
    });

    var visible = new Set();
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) visible.add(e.target.id);
        else visible.delete(e.target.id);
      });
      var first = targets.find(function (el) { return visible.has(el.id); });
      links.forEach(function (a) { a.classList.remove("is-active"); });
      if (first && map[first.id]) map[first.id].classList.add("is-active");
    }, { rootMargin: "-15% 0px -70% 0px", threshold: 0 });

    targets.forEach(function (el) { io.observe(el); });
  }

  /* --------------------------------------------------------- hero video -- */

  function initHeroVideo() {
    var v = document.querySelector("[data-video-src]");
    if (!v) return;

    // Skip the 4 MB clip on small screens, data-saver connections and
    // when the visitor prefers reduced motion.
    var conn = navigator.connection || {};
    if (reduceMotion || conn.saveData || /2g/.test(conn.effectiveType || "")) return;

    var wide = window.matchMedia("(min-width: 768px)");
    var load = function () {
      if (!wide.matches || v.src) return;
      v.src = v.dataset.videoSrc;
      var play = v.play();
      if (play && play.catch) play.catch(function () { /* autoplay blocked */ });
    };
    load();
    if (wide.addEventListener) wide.addEventListener("change", load);
  }

  /* ------------------------------------------------------------- start -- */

  function init() {
    applyLang(detectLang());
    initNav();
    initToTop();
    initEmail();
    initGallery();
    initLightbox();
    initReveal();
    initCounters();
    initScrollSpy();
    initHeroVideo();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
