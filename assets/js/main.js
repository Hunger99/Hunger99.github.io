// Homepage behaviour: mobile menu, stand-ins for images not added yet, WeChat dialog,
// and the fade-in of publication rows.
(function () {
  // Mobile navigation toggle.
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.getElementById('mobile-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // An image with data-fallback is replaced by a grey box with that text until its file exists.
  function useFallback(img) {
    var box = document.createElement('span');
    box.className = img.className + ' logo-fallback';
    box.setAttribute('role', 'img');
    box.setAttribute('aria-label', img.alt || '');
    box.textContent = img.getAttribute('data-fallback');
    box.style.whiteSpace = 'pre-line';
    var w = img.getAttribute('width'), h = img.getAttribute('height');
    if (w && !img.classList.contains('degree-badge')) box.style.width = w + 'px';
    if (h && !img.classList.contains('degree-badge')) box.style.height = h + 'px';
    if (img.classList.contains('degree-badge')) box.style.height = '1rem';
    img.replaceWith(box);
  }
  document.querySelectorAll('img[data-fallback]').forEach(function (img) {
    if (img.complete && img.naturalWidth === 0) useFallback(img);
    else img.addEventListener('error', function () { useFallback(img); });
  });

  // WeChat QR dialog.
  document.querySelectorAll('[data-open]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var d = document.getElementById(btn.getAttribute('data-open'));
      if (d && d.showModal) d.showModal();
    });
  });
  document.querySelectorAll('dialog').forEach(function (d) {
    d.addEventListener('click', function (e) {
      if (e.target === d || e.target.hasAttribute('data-close')) d.close();
    });
  });

  // Publication rows fade in as they scroll into view.
  var list = document.querySelector('.pub-list');
  if (list && 'IntersectionObserver' in window) {
    list.classList.add('reveal-ready');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    list.querySelectorAll('.pub').forEach(function (row, i) {
      row.style.animationDelay = (i * 0.06) + 's';
      io.observe(row);
    });
  }
})();
