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

	function markSeen() {
		try {
			sessionStorage.setItem('lt-intro', '1');
		} catch (e) {}
	}

	function finish() {
		if (!root.classList.contains('is-loading')) return;
		root.classList.remove('is-loading');
		markSeen();
		startReveal();
		window.setTimeout(function () {
			if (preloader && preloader.parentNode) preloader.parentNode.removeChild(preloader);
		}, 600);
	}

	armReveal();

	// The head script only adds .is-loading on the first page of a visit; every
	// page after that skips straight to the content.
	if (!preloader || !root.classList.contains('is-loading')) {
		markSeen();
		root.classList.remove('is-loading');
		if (preloader && preloader.parentNode) preloader.parentNode.removeChild(preloader);
		startReveal();
		return;
	}

	if (reduce) {
		// No theatre for anyone who asked for less motion — just get out of the way.
		finish();
		return;
	}

	var started = Date.now();
	// Long enough to read one burst of the mark, and never longer than MAX_WAIT.
	var MIN_VISIBLE = 900;
	var MAX_WAIT = 3500;
	var done = false;

	function complete() {
		if (done) return;
		done = true;
		var waited = Date.now() - started;
		window.setTimeout(finish, Math.max(0, MIN_VISIBLE - waited));
	}

	if (document.readyState === 'complete') complete();
	else window.addEventListener('load', complete);

	// Never trap the page behind the loader.
	window.setTimeout(complete, MAX_WAIT);
})();
