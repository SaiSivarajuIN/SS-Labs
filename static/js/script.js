document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.getElementById('menu-toggle');
    const roadmap = document.getElementById('roadmap');
    const roadmapLinks = roadmap.querySelectorAll('a:not(.dropdown-toggle)');
    const dropdownToggles = roadmap.querySelectorAll('.dropdown-toggle');

    menuToggle.addEventListener('click', function () {
        roadmap.classList.toggle('open');
    });

    // Close sidebar when a link is clicked
    roadmapLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) { // Only close on mobile
                roadmap.classList.remove('open');
            }
        });
    });

    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            this.parentElement.classList.toggle('open');
            this.nextElementSibling.style.display = this.parentElement.classList.contains('open') ? 'block' : 'none';
        });
    });

    // Cookie handling utilities
    window.setCookie = function(name, value, days) {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    };

    window.getCookie = function(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    };

    window.eraseCookie = function(name) {
        document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    };
});

document.addEventListener('DOMContentLoaded', function() {
    const desktopToggle = document.getElementById('desktop-toggle');
    const body = document.body;
    
    if (desktopToggle) {
        desktopToggle.addEventListener('click', function() {
            body.classList.toggle('collapsed');
        });
    }
});

// --- Added: stable hash scrolling to avoid jumping to bottom on refresh ---
(function() {
    // prevent browser automatic scroll restore (helps with refresh/back)
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }

    function findAndScrollToHash(maxRetries = 20, interval = 100) {
        const hash = (location.hash || '').replace(/^#/, '');
        if (!hash) return;
        let attempts = 0;

        const timer = setInterval(() => {
            attempts++;
            const el = document.getElementById(hash) || document.querySelector(`[name="${hash}"]`);
            if (el) {
                clearInterval(timer);
                // Use instant scroll then smooth to ensure stable positioning
                el.scrollIntoView({ block: 'start', behavior: 'auto' });
                // optional small smooth nudge
                try { window.scrollBy({ top: -8, behavior: 'smooth' }); } catch(e){}
            } else if (attempts >= maxRetries) {
                clearInterval(timer);
            }
        }, interval);
    }

    // On initial load: force top, then attempt to scroll to hash after content/scripts run
    window.addEventListener('load', function() {
        // ensure start at top to avoid leftover positions
        window.scrollTo(0, 0);
        // give other scripts time to render injected sections, then try to scroll
        setTimeout(() => findAndScrollToHash(30, 100), 80);
    });

    // Also handle hash changes while on the page
    window.addEventListener('hashchange', function() {
        setTimeout(() => findAndScrollToHash(30, 100), 20);
    });
})();

// Enhanced cleanup on page close: clear cookies, local/session storage, Cache Storage, and IndexedDB.
(function() {
	// Helper: clear all cookies (tries both plain and domain-scoped)
	function clearCookies() {
		const cookies = document.cookie.split(';');
		for (let i = 0; i < cookies.length; i++) {
			let cookie = cookies[i];
			while (cookie.charAt(0) === ' ') cookie = cookie.substring(1);
			const eqPos = cookie.indexOf('=');
			const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
			// expire for path and attempt domain-scoped expiry
			try {
				document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
				document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=' + location.hostname;
			} catch (e) {
				// ignore
			}
		}
	}

	// Helper: clear localStorage and sessionStorage
	function clearStorages() {
		try { localStorage.clear(); } catch (e) {}
		try { sessionStorage.clear(); } catch (e) {}
	}

	// Helper: clear Cache Storage (Cache API)
	function clearCacheStorage() {
		if (!('caches' in window)) return;
		try {
			caches.keys().then(keys => {
				return Promise.all(keys.map(k => caches.delete(k)));
			}).catch(() => {});
		} catch (e) {
			// ignore
		}
	}

	// Helper: attempt to enumerate and delete IndexedDB databases (best-effort)
	function clearIndexedDB() {
		if (!('indexedDB' in window)) return;
		// modern browsers: indexedDB.databases()
		if (indexedDB.databases) {
			try {
				indexedDB.databases().then(dbs => {
					if (!Array.isArray(dbs)) return;
					dbs.forEach(db => {
						try { if (db && db.name) indexedDB.deleteDatabase(db.name); } catch (e) {}
					});
				}).catch(() => {});
			} catch (e) {
				// ignore
			}
		} else {
			// Fallback: no reliable enumeration available; nothing to do
		}
	}

	// Run all cleanup operations (best-effort; async ops may not finish on unload)
	function runCleanup() {
		clearCookies();
		clearStorages();
		clearCacheStorage();
		clearIndexedDB();
	}

	// Use pagehide (more reliable on some platforms) and beforeunload as a fallback
	window.addEventListener('pagehide', function() {
		runCleanup();
	});

	window.addEventListener('beforeunload', function() {
		runCleanup();
	});

	// Optional: also try when the document becomes hidden
	document.addEventListener('visibilitychange', function() {
		if (document.visibilityState === 'hidden') {
			runCleanup();
		}
	});
})();