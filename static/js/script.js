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