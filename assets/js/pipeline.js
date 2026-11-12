// Pipeline buttons and fragment links reveal the matching stage panel.
(function () {
  document.querySelectorAll('[data-pipeline]').forEach(function (root) {
    var tabs = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
    var panels = tabs.map(function (tab) {
      return document.getElementById(tab.getAttribute('aria-controls'));
    });

    function select(index, focus) {
      tabs.forEach(function (tab, i) {
        var on = i === index;
        tab.setAttribute('aria-selected', on ? 'true' : 'false');
        tab.tabIndex = on ? 0 : -1;
        panels[i].hidden = !on;
      });
      if (focus) tabs[index].focus();
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { select(i, false); });
      tab.addEventListener('keydown', function (e) {
        var last = tabs.length - 1, next = null;
        if (e.key === 'ArrowRight') next = i === last ? 0 : i + 1;
        if (e.key === 'ArrowLeft') next = i === 0 ? last : i - 1;
        if (e.key === 'Home') next = 0;
        if (e.key === 'End') next = last;
        if (next !== null) { e.preventDefault(); select(next, true); }
      });
    });

    function revealHash() {
      var id;
      try { id = decodeURIComponent(window.location.hash.slice(1)); }
      catch (e) { return; }
      var target = document.getElementById(id);
      if (!target) return;
      var index = panels.findIndex(function (panel) {
        return panel === target || panel.contains(target);
      });
      if (index < 0) return;
      select(index, false);
      window.requestAnimationFrame(function () {
        target.scrollIntoView({ block: 'center' });
        target.focus({ preventScroll: true });
      });
    }

    select(0, false);
    revealHash();
    window.addEventListener('hashchange', revealHash);
    document.addEventListener('click', function (event) {
      if (!(event.target instanceof Element)) return;
      var link = event.target.closest('a[href^="#"]');
      if (link && link.getAttribute('href') === window.location.hash) revealHash();
    });
  });
})();
