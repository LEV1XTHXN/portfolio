/* Portfolio — nav behaviour and logo fallbacks. No dependencies. */

(function () {
    'use strict';

    /* ---------- Mobile navigation toggle ---------- */

    var toggle = document.querySelector('.nav-toggle');
    var menu = document.getElementById('nav-menu');

    if (toggle && menu) {
        toggle.addEventListener('click', function () {
            var open = menu.classList.toggle('is-open');
            toggle.setAttribute('aria-expanded', String(open));
        });

        // Close after tapping a link, otherwise the panel covers the target
        menu.addEventListener('click', function (e) {
            if (e.target.closest('a')) {
                menu.classList.remove('is-open');
                toggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    /* ---------- Scroll-spy: highlight the section currently in view ---------- */

    var links = Array.prototype.slice.call(
        document.querySelectorAll('.navbar-nav a[href^="#"]')
    );

    var sections = links
        .map(function (link) {
            return document.querySelector(link.getAttribute('href'));
        })
        .filter(Boolean);

    if (sections.length && 'IntersectionObserver' in window) {
        var visible = new Set();

        var setActive = function () {
            // Of everything on screen, mark the one highest up the document
            var current = sections.filter(function (s) { return visible.has(s); })[0];
            links.forEach(function (link) {
                var match = current && link.getAttribute('href') === '#' + current.id;
                link.classList.toggle('is-active', Boolean(match));
            });
        };

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    visible.add(entry.target);
                } else {
                    visible.delete(entry.target);
                }
            });
            setActive();
        }, {
            // Ignore the strip under the fixed navbar; require a real slice on screen
            rootMargin: '-60px 0px -55% 0px',
            threshold: 0
        });

        sections.forEach(function (section) { observer.observe(section); });
    }

    /* ---------- Engine showcase video ---------- */

    var video = document.querySelector('.engine__video');

    if (video) {
        // The stylesheet already honours reduced motion; an autoplaying loop
        // would contradict it, so hold the poster frame instead.
        var still = window.matchMedia
            && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (still) {
            video.removeAttribute('autoplay');
            video.pause();

            // Controls are added only once the file has actually loaded. Setting
            // them up front makes a missing file render the browser's "no
            // supported source" chrome instead of the poster.
            video.addEventListener('loadeddata', function () {
                video.setAttribute('controls', '');
            });
        }

        // Same defensive pattern as the logo fallback below: if the file is not
        // there yet, show the poster rather than a broken player.
        var source = video.querySelector('source');

        var toPoster = function () {
            var poster = video.getAttribute('poster');
            if (!poster || !video.parentNode) { return; }

            var img = document.createElement('img');
            img.src = poster;
            img.alt = '';
            video.parentNode.replaceChild(img, video);
        };

        video.addEventListener('error', toPoster);
        if (source) { source.addEventListener('error', toPoster); }
    }

    /* ---------- Stack logos: fall back to a wordmark if the file is missing ---------- */

    document.querySelectorAll('.skill__logo img').forEach(function (img) {
        var fail = function () {
            var row = img.closest('.skill');
            if (row) { row.classList.add('is-fallback'); }
        };

        // Already finished loading (possibly failed) before this script ran
        if (img.complete) {
            if (img.naturalWidth === 0) { fail(); }
        } else {
            img.addEventListener('error', fail);
        }
    });

}());
