(function () {
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.querySelector('header nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', function (e) {
    e.stopPropagation();
    var isOpen = nav.classList.toggle('open');
    toggle.innerHTML = isOpen ? '&#10005;' : '&#9776;';
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('header')) {
      nav.classList.remove('open');
      toggle.innerHTML = '&#9776;';
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      nav.classList.remove('open');
      toggle.innerHTML = '&#9776;';
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
})();
