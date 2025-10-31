// ** Déclaration des constantes pour l'API et options de requêtes ** //
const API_URL = 'https://api.themoviedb.org/3/movie/';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const API_KEY = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzNzYzYzAwNzAxMDUwYTlmYTRhZWU4NmY4OGZlMGYxNyIsIm5iZiI6MTc0MzQyNzAwMC45NjMsInN1YiI6IjY3ZWE5NWI4NGY3NDFjNzViYmM2ZDliZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.bINPTj-jn3pAVq1kDz9jRioqbQ-c3kqHZFHcThp4qww';

const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: API_KEY
    }
};

const columns = [
    document.getElementById("col1"),
    document.getElementById("col2"),
    document.getElementById("col3")
];

let filmsDisplayed = 20; // Nombre de films affichés initialement
let filmsPerPage = 20; // Nombre de films récupérés à chaque clic sur "Voir plus"
let allFilms = [];
let currentPage = 1; // Page actuelle
let currentCategory = 'popular';

// ** Fonction pour récupérer les films depuis l'API ** //
async function fetchFilms(category = 'popular', page = 1) {
    try {
        const response = await fetch(`${API_URL}${category}?language=en-US&page=${page}`, options);
        const data = await response.json();

        allFilms = [...allFilms, ...data.results];
        displayLimitedFilms();
        updateButtonVisibility();
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des films :", error);
    }
}

// ** Fonction pour afficher les films récupérés ** //
function displayLimitedFilms() {
    columns.forEach(col => col.innerHTML = "");
    let index = 0;

    allFilms.slice(0, filmsDisplayed).forEach(film => {
        if (film.poster_path) {
            const movieItem = document.createElement("div");
            movieItem.className = "movie-item";

            const favIcon = document.createElement("img");
            favIcon.src = "/public/contour-en-forme-de-coeur-blanc.png"; // Cœur blanc par défaut
            favIcon.className = "favicon";
            favIcon.setAttribute("data-title", film.title); // Ajoute le titre pour lier à la wishlist

            const img = document.createElement("img");
            img.src = `${IMAGE_BASE_URL}${film.poster_path}`;
            img.alt = film.title;
            img.className = "img_film";

            // Créer un lien vers la page de détails du film
            const movieLink = document.createElement("a");
            movieLink.href = `det_film.html?id=${film.id}`;  // Lien vers la page de détails avec l'ID du film
            movieLink.appendChild(img);  // Ajouter l'image du film à ce lien

            favIcon.addEventListener('click', () => {
                let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
                let filmData = { title: film.title, poster_path: film.poster_path }; // Sauvegarde l'image aussi

                let existingFilm = wishlist.find(f => f.title === film.title);

                if (!existingFilm) {
                    wishlist.push(filmData);
                    favIcon.src = "/public/coeur.png"; // Change l'image du cœur en rouge
                } else {
                    wishlist = wishlist.filter(f => f.title !== film.title);
                    favIcon.src = "/public/contour-en-forme-de-coeur-blanc.png"; // Change l'image du cœur en blanc
                }

                localStorage.setItem("wishlist", JSON.stringify(wishlist));

            });

            movieItem.appendChild(movieLink); // Ajouter le lien autour de l'image
            movieItem.appendChild(favIcon);  // Ajouter l'icône du cœur
            columns[index % 3].appendChild(movieItem);
            index++;
        }
    });
}

// ** Fonction pour afficher ou cacher le bouton "Voir plus" ** //
function updateButtonVisibility() {
    const toggleButton = document.getElementById("toggleButton");
    if (toggleButton) {
        toggleButton.style.display = (filmsDisplayed >= allFilms.length) ? "none" : "block";
    }
}

document.getElementById("toggleButton")?.addEventListener("click", async () => {
    filmsDisplayed += filmsPerPage;

    if (filmsDisplayed > allFilms.length) {
        currentPage += 1;
        await fetchFilms(currentCategory, currentPage);
    } else {
        displayLimitedFilms();
        updateButtonVisibility();
    }
});

// ** Gestion du changement de catégorie des films ** //
document.querySelectorAll(".categories span").forEach(span => {
    span.addEventListener("click", () => {
        document.querySelector(".categories .active")?.classList.remove("active");
        span.classList.add("active");

        const category = span.textContent.trim().toLowerCase();
        const categoryMapping = {
            "popular": "popular",
            "top rated": "top_rated",
            "indoors": "now_playing",
            "upcoming": "upcoming"
        };

        if (category in categoryMapping) {
            currentCategory = categoryMapping[category];
            allFilms = [];
            filmsDisplayed = 20;
            currentPage = 1;
            fetchFilms(currentCategory, currentPage);
        }
    });
});

// ** Chargement initial des films ** //
fetchFilms();

// ** Gestion de la barre de recherche de films ** //
const searchInput = document.getElementById("searchInput");

async function searchMovies(query) {
    if (!query.trim()) return;

    try {
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&language=en-FR&page=1`, options);
        const data = await response.json();

        allFilms = data.results;
        filmsDisplayed = allFilms.length;
        displayLimitedFilms();
        updateButtonVisibility();
    } catch (error) {
        console.error("❌ Erreur lors de la recherche :", error);
    }
}

searchInput.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        searchMovies(searchInput.value);
    }
});

// ** Mettre à jour les cœurs au chargement de la page en fonction de la wishlist ** //
document.addEventListener("DOMContentLoaded", function () {
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const hearts = document.querySelectorAll(".favicon");

    hearts.forEach(heart => {
        let title = heart.getAttribute("data-title");
        if (wishlist.some(item => item.title === title)) {
            heart.src = "/public/coeur.png"; // Cœur rouge si dans la wishlist
        }
    });
});
