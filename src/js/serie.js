// ** Déclaration des constantes pour l'API et options de requêtes ** //
const API_URL = 'https://api.themoviedb.org/3/tv/';
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

let filmsDisplayed = 20;
let allFilms = [];
let currentPage = 1;
let currentCategory = 'popular';

// ** Fonction pour récupérer les films depuis l'API ** //
async function fetchFilms(category = 'popular', page = 1) {
    try {
        const response = await fetch(`${API_URL}${category}?language=en-US&page=${page}`, options);
        const data = await response.json();

        allFilms = [...allFilms, ...data.results];  // Concaténer les résultats
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
            favIcon.src = "/public/contour-en-forme-de-coeur-blanc.png";
            favIcon.className = "favicon";
            favIcon.setAttribute("data-title", film.name);
            favIcon.setAttribute("data-poster-path", film.poster_path);

            const img = document.createElement("img");
            img.src = `${IMAGE_BASE_URL}${film.poster_path}`;
            img.alt = film.name;
            img.className ="img_serie";

            const link = document.createElement("a");
            link.href = `/det_serie.html?id=${film.id}`;
            link.target = "_blank";
            link.appendChild(img);

            favIcon.addEventListener('click', () => {
                let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
                let filmData = { title: film.name, poster_path: film.poster_path };

                let existingFilm = wishlist.find(f => f.title === film.name);

                if (!existingFilm) {
                    wishlist.push(filmData);
                    favIcon.src = "/public/coeur.png";
                } else {
                    wishlist = wishlist.filter(f => f.title !== film.name);
                    favIcon.src = "/public/contour-en-forme-de-coeur-blanc.png";
                }

                localStorage.setItem("wishlist", JSON.stringify(wishlist));
            });

            movieItem.appendChild(link);
            movieItem.appendChild(favIcon);
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

// ** Fonction pour gérer le bouton "Voir plus" ** //
document.getElementById("toggleButton").addEventListener("click", () => {
    filmsDisplayed += 20;  // Augmenter le nombre de films affichés
    currentPage++;  // Passer à la page suivante
    fetchFilms(currentCategory, currentPage);
});

// ** Gestion du changement de catégorie des séries ** //
document.querySelectorAll(".categories span").forEach(span => {
    span.addEventListener("click", () => {
        document.querySelector(".categories .active")?.classList.remove("active");
        span.classList.add("active");

        const category = span.textContent.trim().toLowerCase();
        const categoryMapping = {
            "popular": "popular",
            "top rated": "top_rated",
            "indoors": "on_the_air",
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

// ** Gestion de la barre de recherche des films ** //
const searchInput = document.getElementById("searchInput");

async function searchMovies(query) {
    if (!query.trim()) return;

    try {
        const response = await fetch(`https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(query)}&language=en-FR&page=1`, options);
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
