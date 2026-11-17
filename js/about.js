/* About page interactions — Figma "Portfolio" / About (node 649:36807) */
(function () {
	'use strict';

	var MOBILE_QUERY = window.matchMedia('(max-width: 760px)');
	var FINE_POINTER = window.matchMedia('(hover: hover) and (pointer: fine)');

	/* ---------- Scale the fixed-size Figma canvases to the available width ---------- */
	var SCALE_SOURCES = [
		{ selector: '[data-scale-target="collage"]', frame: '.collage-frame', width: 540, prop: '--collage-scale' },
		{ selector: '[data-scale-target="wall"]', frame: '.wall-frame', width: 1160, prop: '--wall-scale' }
	];

	function syncScales() {
		var stacked = MOBILE_QUERY.matches;

		SCALE_SOURCES.forEach(function (source) {
			var node = document.querySelector(source.selector);
			if (!node) return;
			var frame = node.closest(source.frame);
			if (!frame) return;

			if (stacked && source.prop === '--wall-scale') {
				document.body.style.setProperty(source.prop, '1');
				frame.style.height = '';
				return;
			}

			var scale = Math.min(1, frame.clientWidth / source.width);
			document.body.style.setProperty(source.prop, String(scale));
		});
	}

	if (window.ResizeObserver) {
		var observer = new ResizeObserver(syncScales);
		SCALE_SOURCES.forEach(function (source) {
			var frame = document.querySelector(source.frame);
			if (frame) observer.observe(frame);
		});
	}
	window.addEventListener('resize', syncScales);
	syncScales();

	/* ---------- "What drives me" accordion ---------- */
	var drives = Array.prototype.slice.call(document.querySelectorAll('[data-drive]'));

	drives.forEach(function (drive) {
		var head = drive.querySelector('.drive__head');
		var icon = drive.querySelector('[data-drive-icon]');
		if (!head) return;

		head.addEventListener('click', function () {
			var willOpen = drive.getAttribute('data-open') !== 'true';

			drives.forEach(function (other) {
				var otherHead = other.querySelector('.drive__head');
				var otherIcon = other.querySelector('[data-drive-icon]');
				var open = other === drive && willOpen;
				other.setAttribute('data-open', open ? 'true' : 'false');
				if (otherHead) otherHead.setAttribute('aria-expanded', open ? 'true' : 'false');
				if (otherIcon) otherIcon.textContent = open ? '×' : '+';
			});

			if (icon) icon.textContent = willOpen ? '×' : '+';
		});
	});

	/* ---------- "say hi" sticker ---------- */
	var sayhi = document.querySelector('[data-sayhi]');

	if (sayhi) {
		var trigger = sayhi.querySelector('[data-sayhi-trigger]');
		var toast = sayhi.querySelector('[data-sayhi-toast]');
		var popover = sayhi.querySelector('[data-sayhi-popover]');
		var closeBtn = sayhi.querySelector('[data-sayhi-close]');
		var form = sayhi.querySelector('[data-sayhi-form]');
		var input = form ? form.querySelector('input') : null;
		var timers = [];
		var busy = false;

		function clearTimers() {
			timers.forEach(clearTimeout);
			timers = [];
		}

		function after(ms, fn) {
			timers.push(setTimeout(fn, ms));
		}

		function showToast(message) {
			if (!toast) return;
			toast.textContent = message;
			toast.setAttribute('data-visible', 'true');
		}

		function hideToast() {
			if (toast) toast.setAttribute('data-visible', 'false');
		}

		function showPopover(visible) {
			if (!popover) return;
			popover.setAttribute('data-visible', visible ? 'true' : 'false');
			if (visible && input) input.focus();
		}

		function reset() {
			clearTimers();
			hideToast();
			showPopover(false);
			if (form) form.reset();
			busy = false;
		}

		if (trigger) {
			trigger.addEventListener('click', function () {
				if (busy) return;
				busy = true;
				clearTimers();
				showPopover(false);

				showToast('Sending your hi…');
				after(800, function () {
					showToast('Hi sent! Linh will see it soon 👋');
					after(1200, function () {
						hideToast();
						showPopover(true);
						busy = false;
					});
				});
			});
		}

		if (closeBtn) closeBtn.addEventListener('click', reset);

		if (form) {
			form.addEventListener('submit', function (event) {
				event.preventDefault();
				clearTimers();
				showPopover(false);
				showToast('Thanks! I’ll be in touch 💌');
				after(1600, reset);
			});
		}

		document.addEventListener('keydown', function (event) {
			if (event.key === 'Escape' && popover && popover.getAttribute('data-visible') === 'true') reset();
		});
	}

	/* ---------- Draggable photo wall ---------- */
	var wall = document.querySelector('[data-wall]');

	if (wall && window.PointerEvent && FINE_POINTER.matches) {
		var topLayer = 10;

		Array.prototype.forEach.call(wall.querySelectorAll('.wall-item--grab'), function (item) {
			var pointerId = null;
			var startX = 0;
			var startY = 0;
			var baseX = 0;
			var baseY = 0;
			var moved = false;
			var polaroid = item.querySelector('.polaroid');

			function currentScale() {
				var rect = wall.getBoundingClientRect();
				return rect.width ? rect.width / wall.offsetWidth : 1;
			}

			item.addEventListener('pointerdown', function (event) {
				if (MOBILE_QUERY.matches || !FINE_POINTER.matches || pointerId !== null || event.button !== 0) return;

				pointerId = event.pointerId;
				startX = event.clientX;
				startY = event.clientY;
				baseX = parseFloat(item.style.getPropertyValue('--dx')) || 0;
				baseY = parseFloat(item.style.getPropertyValue('--dy')) || 0;
				moved = false;

				item.setPointerCapture(pointerId);
				item.classList.add('is-dragging');
				topLayer += 1;
				item.style.zIndex = String(topLayer);
			});

			item.addEventListener('pointermove', function (event) {
				if (event.pointerId !== pointerId) return;

				var scale = currentScale() || 1;
				var dx = (event.clientX - startX) / scale;
				var dy = (event.clientY - startY) / scale;

				if (!moved && Math.abs(dx) + Math.abs(dy) > 3) {
					moved = true;
					if (polaroid) polaroid.classList.add('is-dragging');
				}

				item.style.setProperty('--dx', (baseX + dx) + 'px');
				item.style.setProperty('--dy', (baseY + dy) + 'px');
			});

			function endDrag(event) {
				if (event.pointerId !== pointerId) return;
				item.releasePointerCapture(pointerId);
				pointerId = null;
				item.classList.remove('is-dragging');
				if (polaroid) polaroid.classList.remove('is-dragging');
			}

			item.addEventListener('pointerup', endDrag);
			item.addEventListener('pointercancel', endDrag);
			item.addEventListener('dragstart', function (event) { event.preventDefault(); });
		});
	}
	/* ---------- Hero photo stack: hover to shuffle ---------- */
	var stackPin = document.querySelector('.collage__stack');
	var deck = stackPin && stackPin.firstElementChild;
	var REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)');

	if (deck && deck.animate) {
		var SHUFFLE_MS = 900;
		var HOVER_INTERVAL_MS = 1700;
		var shuffling = false;
		var hovering = false;
		var timer = null;

		function shuffle() {
			if (shuffling) return;
			var top = deck.lastElementChild;
			if (!top || top === deck.firstElementChild) return;

			if (REDUCED_MOTION.matches) {
				deck.insertBefore(top, deck.firstElementChild);
				return;
			}

			shuffling = true;
			// Swing out to the right, drop under the deck halfway, then slide back into place.
			var animation = top.animate([
				{ transform: 'none', zIndex: 2, easing: 'cubic-bezier(0.3, 0, 0.2, 1)' },
				{ transform: 'translate(205px, -30px) rotate(15deg)', zIndex: 2, offset: 0.45 },
				{ transform: 'translate(205px, -30px) rotate(15deg)', zIndex: -1, offset: 0.46, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
				{ transform: 'none', zIndex: -1 }
			], { duration: SHUFFLE_MS });

			animation.onfinish = function () {
				deck.insertBefore(top, deck.firstElementChild);
				shuffling = false;
			};
		}

		function startHover() {
			if (hovering) return;
			hovering = true;
			shuffle();
			timer = window.setInterval(shuffle, HOVER_INTERVAL_MS);
		}

		function stopHover() {
			hovering = false;
			window.clearInterval(timer);
			timer = null;
		}

		stackPin.addEventListener('mouseenter', function () {
			if (FINE_POINTER.matches) startHover();
		});
		stackPin.addEventListener('mouseleave', stopHover);
		// Touch screens have no hover: tap the photos to flip to the next one.
		stackPin.addEventListener('click', function () {
			if (!FINE_POINTER.matches) shuffle();
		});
	}
})();
