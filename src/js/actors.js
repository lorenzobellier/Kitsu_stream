const API_KEY = 'c14a5ecc94d5bace12748670823aa6c0';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const actorsPerPage = 10; // Nombre d'acteurs à afficher par page
let currentPage = 1; // Page actuelle pour l'API
let displayedCount = 0; // Nombre d'acteurs déjà affichés
let allActors = []; // Tableau pour stocker tous les acteurs récupérés
let filteredActors = []; // Tableau pour les acteurs filtrés
let isFiltering = false; // Mode de filtrage

document.addEventListener('DOMContentLoaded', function() {
    fetchActors(); // Récupérer les acteurs au chargement de la page

    // Ajouter un événement au bouton "Afficher plus"
    document.getElementById("loadMoreBtn").addEventListener("click", function() {
        if (isFiltering) {
            // En mode recherche, on charge plus d'acteurs depuis l'API avec le terme de recherche
            if (displayedCount >= filteredActors.length) {
                searchActors(document.getElementById('filterInput').value, true);
            } else {
                displayMoreFilteredActors();
            }
        } else {
            // En mode normal, on affiche les prochains acteurs ou charge une nouvelle page si nécessaire
            if (displayedCount >= allActors.length - actorsPerPage/2) {
                fetchNextPage();
            } else {
                displayMoreActors();
            }
        }
    });

    // Ajouter un événement à la barre de recherche
    document.getElementById('filterInput').addEventListener('input', function(e) {
        const searchTerm = e.target.value.trim();

        if (searchTerm === '') {
            // Si la recherche est vide, revenir à l'affichage normal
            isFiltering = false;
            // Réinitialiser l'affichage mais pas les acteurs chargés
            displayedCount = 0;
            displayActors();
        } else {
            // Sinon effectuer la recherche
            searchActors(searchTerm);
        }
    });
});

// Fonction pour récupérer les acteurs (page initiale ou suivante)
async function fetchActors() {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/person/popular?api_key=${API_KEY}&language=fr&page=${currentPage}`);
        const data = await response.json();

        // Ajouter les nouveaux acteurs à notre liste globale
        allActors = [...allActors, ...data.results];

        // Afficher les acteurs
        displayActors();
    } catch (error) {
        console.error("Erreur lors de la récupération des acteurs:", error);
    }
}

// Fonction pour charger la page suivante d'acteurs
function fetchNextPage() {
    currentPage++;
    fetchActors();
}

// Fonction pour afficher plus d'acteurs (mode normal)
function displayMoreActors() {
    const actorList = document.getElementById("actorList");
    const endIndex = displayedCount + actorsPerPage;
    const actorsToDisplay = allActors.slice(displayedCount, endIndex);

    actorsToDisplay.forEach(actor => {
        const actorCard = createActorCard(actor);
        actorList.appendChild(actorCard);
    });

    displayedCount = Math.min(endIndex, allActors.length);

    // Gérer le bouton "Afficher plus"
    document.getElementById("loadMoreBtn").style.display = 'block';
}

// Fonction pour rechercher des acteurs via l'API
async function searchActors(query, loadMore = false) {
    isFiltering = true;

    try {
        // Si ce n'est pas "loadMore", on réinitialise la recherche
        if (!loadMore) {
            filteredActors = [];
            currentPage = 1;
            displayedCount = 0;
        } else {
            // Sinon on passe à la page suivante
            currentPage++;
        }

        // Recherche d'acteurs via l'API TMDb
        const response = await fetch(`https://api.themoviedb.org/3/search/person?api_key=${API_KEY}&language=fr&query=${encodeURIComponent(query)}&page=${currentPage}`);
        const data = await response.json();

        // Ajouter les résultats à notre liste filtrée
        filteredActors = [...filteredActors, ...data.results];

        // Afficher les résultats
        if (loadMore) {
            displayMoreFilteredActors();
        } else {
            // Réinitialiser l'affichage pour une nouvelle recherche
            const actorList = document.getElementById("actorList");
            actorList.innerHTML = '';
            displayedCount = 0;
            displayMoreFilteredActors();
        }

        // Gérer le bouton "Afficher plus"
        const loadMoreBtn = document.getElementById("loadMoreBtn");
        if (data.page < data.total_pages || displayedCount < filteredActors.length) {
            loadMoreBtn.style.display = 'block';
        } else {
            loadMoreBtn.style.display = 'none';
        }
    } catch (error) {
        console.error("Erreur lors de la recherche d'acteurs:", error);
    }
}

// Fonction pour afficher plus d'acteurs filtrés
function displayMoreFilteredActors() {
    const actorList = document.getElementById("actorList");

    if (filteredActors.length === 0) {
        // Message si aucun résultat
        actorList.innerHTML = '<div class="col-12 text-center"><p>Aucun acteur trouvé</p></div>';
        return;
    }

    const endIndex = displayedCount + actorsPerPage;
    const actorsToDisplay = filteredActors.slice(displayedCount, endIndex);

    // Ajouter les acteurs filtrés
    actorsToDisplay.forEach(actor => {
        const actorCard = createActorCard(actor);
        actorList.appendChild(actorCard);
    });

    displayedCount = Math.min(endIndex, filteredActors.length);

    // Masquer le bouton si tous les acteurs sont affichés
    if (displayedCount >= filteredActors.length) {
        document.getElementById("loadMoreBtn").style.display = 'none';
    }
}

// Fonction pour afficher les acteurs (mode normal)
function displayActors() {
    const actorList = document.getElementById("actorList");

    // Vider la liste actuelle
    actorList.innerHTML = '';

    // Afficher les premiers acteurs
    const endIndex = displayedCount + actorsPerPage;
    const actorsToDisplay = allActors.slice(0, endIndex);

    // Ajouter les acteurs à la liste
    actorsToDisplay.forEach(actor => {
        const actorCard = createActorCard(actor);
        actorList.appendChild(actorCard);
    });

    displayedCount = endIndex;
}

// Fonction pour créer une carte d'acteur
function createActorCard(actor) {
    const actorCard = document.createElement('div');
    actorCard.classList.add('col-md-4', 'col-sm-6', 'mb-4'); // Bootstrap

    actorCard.innerHTML = `
        <div class="card actor-card">
            <img src="${actor.profile_path ? IMAGE_BASE_URL + actor.profile_path : 'https://www.mountainmotorvehicles.co.uk/wp-content/uploads/2024/05/No-image-available-2-300x300.jpg'}" class="card-img-top" alt="${actor.name}">
            <div class="card-body">
                <h5 class="card-title">${actor.name}</h5>
                <a href="acteur.html?id=${actor.id}" class="btn btn-primary">Voir le profil</a>
            </div>
        </div>
    `;

    return actorCard;
}