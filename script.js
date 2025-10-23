document.addEventListener('DOMContentLoaded', () => {
    // 1. Set Current Year in Footer
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // 2. Optional: Smooth scrolling for navigation links
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Check if the link is a section link
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});
