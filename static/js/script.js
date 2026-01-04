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