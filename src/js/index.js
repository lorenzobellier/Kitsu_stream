// Vérifier si l'utilisateur est connecté
if (localStorage.getItem("isLoggedIn") !== "true") {
    window.location.href = "/index.html";
}

document.getElementById("logoutBtn").addEventListener("click", function () {
    localStorage.removeItem("isLoggedIn");
    window.location.href = "/login.html";
});