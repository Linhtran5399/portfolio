/* Page loader + scroll reveal, shared by every page. */
(function () {
	'use strict';

	var root = document.documentElement;
	var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	/* ---------- Reveal ---------- */

	// Listed finest-first: an entry is skipped when it overlaps one already picked,
	// so each block reveals once instead of fading inside another fade.
	var UNITS = [
		// Home
		'.hero', '.bento', '.section-title', '.work-card', '.more-head', '.more-grid', '.cta',
		// About
		'.about-hero', '.drives', '.outside', '.connect',
		// Case studies — the body sections, then the intro block
		'article > section',
		'main > section'
	];

	var revealTargets = [];

	function collectTargets() {
		UNITS.forEach(function (selector) {
			Array.prototype.forEach.call(document.querySelectorAll(selector), function (el) {
				var overlaps = revealTargets.some(function (picked) {
					return picked === el || picked.contains(el) || el.contains(picked);
				});
				if (!overlaps) revealTargets.push(el);
			});
		});

		revealTargets.sort(function (a, b) {
			var pos = a.compareDocumentPosition(b);
			if (pos & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
			if (pos & Node.DOCUMENT_POSITION_PRECEDING) return 1;
			return 0;
		});
	}

	function armReveal() {
		if (reduce || !('IntersectionObserver' in window)) return;
		collectTargets();
		revealTargets.forEach(function (el) { el.classList.add('reveal'); });
	}

	function startReveal() {
		if (!revealTargets.length) return;

		var observer = new IntersectionObserver(function (entries, obs) {
			entries.forEach(function (entry) {
				if (!entry.isIntersecting) return;
				entry.target.classList.add('is-visible');
				obs.unobserve(entry.target);
			});
		}, { rootMargin: '0px 0px -8% 0px', threshold: 0 });

		// Whatever is already on screen comes in on a short stagger; the rest waits
		// for the observer.
		var shown = 0;
		revealTargets.forEach(function (el) {
			var box = el.getBoundingClientRect();
			var onScreen = box.top < window.innerHeight && box.bottom > 0;

			if (onScreen && shown < 6) {
				el.style.transitionDelay = (shown * 90) + 'ms';
				shown += 1;
				requestAnimationFrame(function () {
					el.classList.add('is-visible');
					window.setTimeout(function () { el.style.transitionDelay = ''; }, 900);
				});
			} else {
				observer.observe(el);
			}
		});
	}

	/* ---------- Preloader ---------- */

	var preloader = document.getElementById('preloader');
	var bar = preloader && preloader.querySelector('.preloader__bar');

	function finish() {
		if (!root.classList.contains('is-loading')) return;
		root.classList.remove('is-loading');
		startReveal();
		window.setTimeout(function () {
			if (preloader && preloader.parentNode) preloader.parentNode.removeChild(preloader);
		}, 600);
	}

	armReveal();

	if (!preloader) {
		finish();
		return;
	}

	var started = Date.now();
	var MIN_VISIBLE = 650;
	var MAX_WAIT = 3500;
	var progress = 8;
	var trickle;

	function paint(value) {
		progress = Math.min(100, value);
		if (bar) bar.style.width = progress + '%';
	}

	function complete() {
		window.clearInterval(trickle);
		paint(100);
		var waited = Date.now() - started;
		window.setTimeout(finish, Math.max(0, MIN_VISIBLE - waited) + 220);
	}

	paint(progress);

	if (reduce) {
		// No theatre for anyone who asked for less motion — just get out of the way.
		paint(100);
		finish();
	} else {
		// Creep towards 90% so the bar keeps moving even while a slow image loads.
		trickle = window.setInterval(function () {
			if (progress >= 90) return;
			paint(progress + Math.max(1, (90 - progress) * 0.12));
		}, 120);

		if (document.readyState === 'complete') complete();
		else window.addEventListener('load', complete);

		// Never trap the page behind the loader.
		window.setTimeout(complete, MAX_WAIT);
	}
})();
