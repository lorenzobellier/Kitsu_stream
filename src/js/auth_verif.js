// Vérifier si l'utilisateur est connecté
if (!localStorage.getItem("isLoggedIn")) {
    window.location.href = "/login.html"; // Rediriger vers la page de connexion
}

// Fonction de déconnexion
const logoutBtn2 = document.getElementById("logoutBtn2");
if (logoutBtn2) {
    logoutBtn2.addEventListener("click", function() {
        localStorage.removeItem("isLoggedIn"); // Supprimer l'élément du localStorage
        window.location.href = "/index.html"; // Redirection vers la page d'accueil
    });
}
