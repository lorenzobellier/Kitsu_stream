document.addEventListener('DOMContentLoaded', function() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const logo = document.getElementById('logo'); // Assure-toi que ton logo a cet ID

    // Lire un cookie spécifique
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        return parts.length === 2 ? parts.pop().split(';').shift() : null;
    }

    // Définir un cookie (valide pendant 365 jours)
    function setCookie(name, value, days = 365) {
        const expires = new Date(Date.now() + days * 864e5).toUTCString();
        document.cookie = `${name}=${value}; expires=${expires}; path=/`;
    }

    // Appliquer le thème depuis le cookie ou par défaut
    const currentTheme = getCookie('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeVisuals(currentTheme);

    // Gestion du clic sur le bouton
    themeToggleBtn.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        setCookie('theme', newTheme);
        updateThemeVisuals(newTheme);
    });

    // Met à jour les icônes et le logo selon le thème
    function updateThemeVisuals(theme) {
        const darkIcon = themeToggleBtn.querySelector('.dark-icon');
        const lightIcon = themeToggleBtn.querySelector('.light-icon');

        if (theme === 'dark') {
            darkIcon.style.display = 'none';
            lightIcon.style.display = 'inline-block';
            logo.src = 'logo_kitsu_stream-sombre.png'; // <-- adapte le nom selon ton image
        } else {
            darkIcon.style.display = 'inline-block';
            lightIcon.style.display = 'none';
            logo.src = '../logo_kitsu_stream-clair.png'; // <-- adapte le nom selon ton image
        }
    }
});

