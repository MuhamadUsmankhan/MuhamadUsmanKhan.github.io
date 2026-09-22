(function () {
  "use strict";

  /* ---------- Theme toggle ---------- */
  var root = document.documentElement;
  var themeBtn = document.getElementById("themeToggle");
  var storedTheme = null;
  try { storedTheme = localStorage.getItem("uk-theme"); } catch (e) {}
  if (storedTheme) root.setAttribute("data-theme", storedTheme);

  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var current = root.getAttribute("data-theme") === "light" ? "light" : "dark";
      var next = current === "light" ? "dark" : "light";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("uk-theme", next); } catch (e) {}
    });
  }

  /* ---------- Navbar scroll state ---------- */
  var navbar = document.getElementById("navbar");
  var backToTop = document.getElementById("backToTop");
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (navbar) navbar.classList.toggle("scrolled", y > 20);
    if (backToTop) backToTop.classList.toggle("visible", y > 500);
  }
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (backToTop) {
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- Mobile menu ---------- */
  var burger = document.getElementById("navBurger");
  var mobileMenu = document.getElementById("mobileMenu");
  if (burger && mobileMenu) {
    burger.addEventListener("click", function () {
      burger.classList.toggle("open");
      mobileMenu.classList.toggle("open");
    });
    mobileMenu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        burger.classList.remove("open");
        mobileMenu.classList.remove("open");
      });
    });
  }

  /* ---------- Active nav link on scroll ---------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-links a"));
  function setActiveLink() {
    var scrollPos = window.scrollY + 140;
    var current = sections[0] && sections[0].id;
    sections.forEach(function (sec) {
      if (scrollPos >= sec.offsetTop) current = sec.id;
    });
    navLinks.forEach(function (link) {
      link.classList.toggle("active", link.getAttribute("href") === "#" + current);
    });
  }
  document.addEventListener("scroll", setActiveLink, { passive: true });
  setActiveLink();

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in-view"); });
  }

  /* ---------- Animated skill bars + rings on view ---------- */
  var skillsSection = document.getElementById("skills");
  var animated = false;
  function animateSkills() {
    if (animated || !skillsSection) return;
    var rect = skillsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.75) {
      animated = true;
      document.querySelectorAll(".skill-bar-fill").forEach(function (bar) {
        bar.style.width = bar.getAttribute("data-percent") + "%";
      });
      document.querySelectorAll(".ring-fill").forEach(function (ring) {
        var pct = parseInt(ring.getAttribute("data-percent"), 10) || 0;
        var circumference = 226;
        var offset = circumference - (circumference * pct) / 100;
        ring.style.strokeDashoffset = offset;
      });
    }
  }
  document.addEventListener("scroll", animateSkills, { passive: true });
  animateSkills();

  /* ---------- Animated counters (hero stats) ---------- */
  var counters = document.querySelectorAll(".stat-num[data-count]");
  var countersDone = false;
  function animateCounters() {
    if (countersDone || counters.length === 0) return;
    var rect = counters[0].getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92) {
      countersDone = true;
      counters.forEach(function (el) {
        var target = parseFloat(el.getAttribute("data-count"));
        var suffix = el.getAttribute("data-suffix") || "";
        var duration = 1400;
        var start = null;
        function step(ts) {
          if (!start) start = ts;
          var progress = Math.min((ts - start) / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          var value = target * eased;
          el.textContent = (target % 1 === 0 ? Math.floor(value) : value.toFixed(1)) + suffix;
          if (progress < 1) requestAnimationFrame(step);
          else el.textContent = target + suffix;
        }
        requestAnimationFrame(step);
      });
    }
  }
  document.addEventListener("scroll", animateCounters, { passive: true });
  window.addEventListener("load", animateCounters);

  /* ---------- Typing effect for role line ---------- */
  var typeTarget = document.getElementById("typedRole");
  var roles = [
    "Dynamics 365 CRM Consultant",
    "Power Platform Developer",
    "Power Automate Specialist",
    "Integration & REST API Engineer"
  ];
  if (typeTarget) {
    var roleIndex = 0, charIndex = 0, deleting = false;
    function typeLoop() {
      var current = roles[roleIndex];
      if (!deleting) {
        charIndex++;
        typeTarget.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(typeLoop, 1600);
          return;
        }
      } else {
        charIndex--;
        typeTarget.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
        }
      }
      setTimeout(typeLoop, deleting ? 35 : 65);
    }
    typeLoop();
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("footerYear");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
