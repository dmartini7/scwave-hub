(function () {
  // ── Hamburger nav toggle ──────────────────────────────────────────────────
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.querySelector('header nav');
  if (toggle && nav) {
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
  }

  // ── YouTube facade: tap thumbnail → video plays in-page ──────────────────
  function embedYT(container, vid) {
    container.innerHTML =
      '<iframe src="https://www.youtube.com/embed/' + vid +
      '?autoplay=1&rel=0" ' +
      'allow="accelerometer; autoplay; clipboard-write; encrypted-media; ' +
      'gyroscope; picture-in-picture" allowfullscreen ' +
      'style="position:absolute;inset:0;width:100%;height:100%;border:none;">' +
      '</iframe>';
  }

  // Home-page / explicit facade elements (.yt-facade with data-vid)
  document.querySelectorAll('.yt-facade').forEach(function (el) {
    el.addEventListener('click', function () {
      var wrap = this.closest('.yt-wrap');
      if (wrap) embedYT(wrap, this.dataset.vid);
    });
  });

  // Tactical page WC cards (<a class="video-card"> inside .wc-video-grid)
  document.querySelectorAll('.wc-video-grid .video-card').forEach(function (card) {
    card.addEventListener('click', function (e) {
      e.preventDefault();
      var href = this.getAttribute('href') || '';
      var m = href.match(/[?&]v=([^&#]+)/);
      if (!m) return;
      var thumb = this.querySelector('.video-thumb');
      if (!thumb) return;
      // Switch thumb from aspect-ratio box to padded iframe container
      thumb.style.cssText =
        'position:relative;padding-top:56.25%;aspect-ratio:unset;overflow:hidden;background:#000;';
      embedYT(thumb, m[1]);
    });
  });
})();
