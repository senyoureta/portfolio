/* =========================================================
   معرض الأعمال — حركة الصفحات وسلوك الواجهة
   ========================================================= */
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  var header = document.getElementById("siteHeader");
  var nav = document.getElementById("primary-nav");
  var toggle = document.querySelector(".nav-toggle");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- قائمة الجوال ---------- */
  function setNav(open) {
    if (!header || !toggle) return;
    header.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "إغلاق القائمة" : "فتح القائمة");
    document.body.classList.toggle("nav-locked", open && window.innerWidth <= 900);
  }

  if (toggle && header) {
    toggle.addEventListener("click", function () {
      setNav(!header.classList.contains("nav-open"));
    });
  }

  if (nav) {
    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) setNav(false);
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") setNav(false);
  });

  document.addEventListener("click", function (event) {
    if (!header || !header.classList.contains("nav-open")) return;
    if (!header.contains(event.target)) setNav(false);
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 900) setNav(false);
  });

  /* ---------- ظل الترويسة عند التمرير ---------- */
  var scrollQueued = false;

  function updateHeader() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 8);
    scrollQueued = false;
  }

  if (header) {
    updateHeader();
    window.addEventListener(
      "scroll",
      function () {
        if (scrollQueued) return;
        scrollQueued = true;
        window.requestAnimationFrame(updateHeader);
      },
      { passive: true }
    );
  }

  /* ---------- ظهور العناصر عند التمرير ---------- */
  var revealItems = document.querySelectorAll("[data-reveal]");

  if (!reduceMotion && "IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    revealItems.forEach(function (item) {
      observer.observe(item);
    });
  } else {
    revealItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
  }

  /* ---------- نموذج التواصل عبر واتساب ---------- */
  var form = document.getElementById("contactForm");
  var status = document.getElementById("formStatus");
  var whatsappNumber = "966501896483";

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var nameField = form.elements.namedItem("name");
      var messageField = form.elements.namedItem("message");
      var name = nameField ? nameField.value.trim() : "";
      var message = messageField ? messageField.value.trim() : "";

      if (!name || !message) {
        if (status) {
          status.textContent = "يرجى كتابة الاسم والرسالة قبل الإرسال.";
          status.classList.remove("is-success");
          status.classList.add("is-error");
        }
        if (!name && nameField) nameField.focus();
        else if (messageField) messageField.focus();
        return;
      }

      var text = "مرحبًا، أنا " + name + ".\n" + message;
      var url =
        "https://wa.me/" +
        whatsappNumber +
        "?text=" +
        encodeURIComponent(text);

      window.open(url, "_blank", "noopener,noreferrer");

      if (status) {
        status.textContent = "تم فتح واتساب في تبويب جديد — أكمل الإرسال من هناك.";
        status.classList.remove("is-error");
        status.classList.add("is-success");
      }
    });
  }

  /* ---------- سنة الحقوق ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
