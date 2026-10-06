(function () {
  var toggle = document.querySelector(".menu-toggle");
  var links = document.querySelector(".nav-links");
  var header = document.querySelector(".site-header");
  var lastNav = 0;

  function samePageTarget(link) {
    var href = link.getAttribute("href") || "";
    var hashAt = href.indexOf("#");
    var hash = hashAt === -1 ? "" : href.slice(hashAt);
    if (hash.length < 2) return null;
    return { hash: hash, target: document.querySelector(hash) };
  }

  function anchorOffset() {
    var raw = getComputedStyle(document.documentElement).scrollPaddingTop || "0";
    var value = parseFloat(raw);
    return isNaN(value) ? 0 : value;
  }

  function scrollToTarget(target) {
    var top = target.getBoundingClientRect().top + window.pageYOffset - anchorOffset();
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  }

  function closeMenu() {
    if (!links || !toggle) return;
    links.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }

  function followHeaderLink(link, event) {
    var found = samePageTarget(link);
    if (!found || !found.target) return;
    if (event) event.preventDefault();
    var now = Date.now();
    if (now - lastNav < 400) return;
    lastNav = now;
    closeMenu();
    scrollToTarget(found.target);
    if (history.pushState) history.pushState(null, "", found.hash);
    link.blur();
  }

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  if (links) {
    links.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("pointerdown", function (event) {
        var found = samePageTarget(link);
        if (found && found.target) event.preventDefault();
      });
      link.addEventListener("click", function (event) {
        followHeaderLink(link, event);
      });
    });
  }

  if (header) {
    var markHeader = function () {
      header.classList.toggle("is-stuck", window.scrollY > 8);
    };
    var pinHeader = function () {
      var mobile = window.matchMedia("(max-width: 760px)").matches;
      if (!mobile || !window.visualViewport) {
        header.style.top = "";
        return;
      }
      header.style.top = window.visualViewport.offsetTop + "px";
    };
    markHeader();
    pinHeader();
    window.addEventListener("scroll", function () {
      markHeader();
      pinHeader();
    }, { passive: true });
    if (window.visualViewport) {
      window.visualViewport.addEventListener("scroll", pinHeader);
      window.visualViewport.addEventListener("resize", pinHeader);
    }
  }

  document.querySelectorAll(".faq-item button").forEach(function (button) {
    button.addEventListener("click", function () {
      var item = button.parentElement;
      var open = item.classList.contains("open");
      document.querySelectorAll(".faq-item").forEach(function (other) {
        other.classList.remove("open");
        other.querySelector("button").setAttribute("aria-expanded", "false");
      });
      if (!open) {
        item.classList.add("open");
        button.setAttribute("aria-expanded", "true");
      }
    });
  });

  document.querySelectorAll("[data-role]").forEach(function (button) {
    button.addEventListener("click", function () {
      var target = document.querySelector("#apply");
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
})();
