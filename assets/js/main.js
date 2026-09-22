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

  /* ---------- Rotating hero skill cards ---------- */
  var fc1Icon = document.getElementById("fc1Icon");
  var fc1Text = document.getElementById("fc1Text");
  var fc2Icon = document.getElementById("fc2Icon");
  var fc2Text = document.getElementById("fc2Text");

  if (fc1Icon && fc2Icon) {
    var ICON_STROKE = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
    var slot1Items = [
      {
        title: "Dynamics 365",
        sub: "CRM Customization",
        icon: '<svg ' + ICON_STROKE + '><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>'
      },
      {
        title: "C# &amp; .NET",
        sub: "Backend Development",
        icon: '<svg ' + ICON_STROKE + '><path d="M9 3c-1.6 0-2.6 1-2.6 2.6v2.1c0 1-.8 1.6-1.6 1.6.8 0 1.6.6 1.6 1.6v2.1C6.4 15.6 7.4 16.6 9 16.6"></path><path d="M15 3c1.6 0 2.6 1 2.6 2.6v2.1c0 1 .8 1.6 1.6 1.6-.8 0-1.6.6-1.6 1.6v2.1c0 1.6-1 2.6-2.6 2.6"></path></svg>'
      },
      {
        title: "Copilot",
        sub: "AI-Assisted Workflows",
        icon: '<svg viewBox="0 0 24 24"><path d="M9 4.6c-3 0-5 2-5 4.3s2 4.3 5 4.3h1.7c3 0 5 2 5 4.3s-2 4.3-5 4.3h-2" fill="none" stroke="url(#copilotGrad)" stroke-width="2.1" stroke-linecap="round"></path></svg>'
      }
    ];
    var slot2Items = [
      {
        title: "Power Automate",
        sub: "Process Automation",
        icon: '<svg ' + ICON_STROKE + '><path d="M13 2L3 14h7l-1 8 10-12h-7z"></path></svg>'
      },
      {
        title: "SSRS Reporting",
        sub: "Data &amp; Reports",
        icon: '<svg ' + ICON_STROKE + '><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"></path></svg>'
      },
      {
        title: "Git &amp; DevOps",
        sub: "Source Control",
        icon: '<svg ' + ICON_STROKE + '><line x1="6" y1="3" x2="6" y2="15"></line><circle cx="18" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><path d="M18 9a9 9 0 0 1-9 9"></path></svg>'
      }
    ];

    var slotIndex = 0;
    function swapCard(iconEl, textEl, item) {
      iconEl.closest(".float-card").classList.add("fc-fading");
      setTimeout(function () {
        iconEl.innerHTML = item.icon;
        textEl.innerHTML = item.title + "<small>" + item.sub + "</small>";
        iconEl.closest(".float-card").classList.remove("fc-fading");
      }, 320);
    }

    setInterval(function () {
      slotIndex = (slotIndex + 1) % slot1Items.length;
      swapCard(fc1Icon, fc1Text, slot1Items[slotIndex]);
      swapCard(fc2Icon, fc2Text, slot2Items[slotIndex]);
    }, 3400);
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("footerYear");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
