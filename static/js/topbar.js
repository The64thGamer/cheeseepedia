
    document.addEventListener('DOMContentLoaded', function () {
        // Hide all sections
        const sections = document.querySelectorAll('.article-section');
        sections.forEach(section => section.style.display = 'none');

        // Show the default section (Article)
        const defaultSection = document.getElementById('section-article');
        defaultSection.style.display = 'inline-block';

        // Add event listeners to buttons
        const buttons = document.querySelectorAll('.article-button');
        buttons.forEach(button => {
            button.addEventListener('click', function () {
                // Hide all sections
                sections.forEach(section => section.style.display = 'none');

                // Show the clicked section
                const targetSection = document.getElementById(this.dataset.target);
                if (targetSection) {
                    targetSection.style.display = 'inline-block';
                }
            });
        });
    });
    