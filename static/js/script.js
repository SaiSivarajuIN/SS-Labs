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
        toggle.addEventListener('click', function() {
            this.parentElement.classList.toggle('open');
            this.nextElementSibling.style.display = this.parentElement.classList.contains('open') ? 'block' : 'none';
        });
    });
});