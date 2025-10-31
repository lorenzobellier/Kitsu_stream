const users = {
    admin: "admin123",
    user: "userpass"
};

if (localStorage.getItem("isLoggedIn") === "true") {
    window.location.href = "/films.html";
}

document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    console.log(username, password);
    const errorMessage = document.getElementById("errorMessage");

    if (users.admin === username && users.user === password) {
        localStorage.setItem("isLoggedIn", "true");
    window.location.href = "/films.html";
} else {
    errorMessage.textContent = "Invalid username or password";
}
});