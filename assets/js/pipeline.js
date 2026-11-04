// Pipeline stage buttons: each button shows its stage's panel below and hides the others.
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

    select(0, false);
  });
})();
