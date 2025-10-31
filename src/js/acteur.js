const API_KEY = 'c14a5ecc94d5bace12748670823aa6c0';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM chargé et script exécuté !");

    // Récupération de l'ID de l'acteur depuis l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const actorId = urlParams.get('id');

    // Vérification de l'ID, sinon redirection
    if (!actorId) {
        console.warn("Aucun ID d'acteur trouvé. Redirection en cours...");
        window.location.href = "index.html"; // Redirige vers l'accueil
        return;
    }

    // Lancer la récupération des données
    fetchActorDetails(actorId);
    fetchActorMovies(actorId);
});

// Fonction pour récupérer les détails de l'acteur
async function fetchActorDetails(id) {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/person/${id}?api_key=${API_KEY}&language=fr`);
        const actor = await response.json();

        console.log("Détails de l'acteur:", actor);

        // Mise à jour du nom
        document.querySelector(".name_actor h2").textContent = actor.name || "Nom inconnu";

        // Récupération de la biographie (français ou anglais si indisponible)
        let bioText = actor.biography;
        if (!bioText) {
            console.log("Biographie non disponible en français, tentative en anglais...");
            const responseEn = await fetch(`https://api.themoviedb.org/3/person/${id}?api_key=${API_KEY}&language=en`);
            const actorEn = await responseEn.json();
            bioText = actorEn.biography || "Biographie non disponible.";
        }

        // Limiter la biographie à 3 phrases
        document.querySelector(".bio_actor p").textContent = bioText.split('. ').slice(0, 2).join('. ') + '.';

        // Mise à jour de l'image
        document.querySelector(".img_actor img").src = actor.profile_path ?
            IMAGE_BASE_URL + actor.profile_path :
            'https://www.mountainmotorvehicles.co.uk/wp-content/uploads/2024/05/No-image-available-2-300x300.jpg';

    } catch (error) {
        console.error("Erreur lors de la récupération de l'acteur :", error);
        document.querySelector(".bio_actor p").textContent = "Impossible de charger les informations de l'acteur.";
    }
}

// Fonction pour récupérer les films et séries de l'acteur
async function fetchActorMovies(id) {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/person/${id}/combined_credits?api_key=${API_KEY}&language=fr`);
        const data = await response.json();

        console.log("Films et séries de l'acteur:", data);

        const carouselInner = document.querySelector("#carouselExample .carousel-inner");
        if (!carouselInner) {
            console.error("Élément carrousel non trouvé");
            return;
        }

        carouselInner.innerHTML = ""; // Vider le carrousel

        const movies = data.cast || [];
        if (movies.length === 0) {
            carouselInner.innerHTML = '<div class="carousel-item active"><div class="row"><div class="col-12 text-center">Aucun film ou série trouvé</div></div></div>';
            return;
        }

        // Génération des diapositives du carrousel
        for (let i = 0; i < movies.length; i += 4) {
            const slide = document.createElement('div');
            slide.classList.add('carousel-item');
            if (i === 0) slide.classList.add('active'); // Activer la première diapositive

            const row = document.createElement('div');
            row.classList.add('row');

            for (let j = i; j < i + 4 && j < movies.length; j++) {
                const movie = movies[j];

                const col = document.createElement('div');
                col.classList.add('col-12', 'col-md-6', 'col-lg-3');

                // Lien cliquable qui envoie vers film.html avec l'ID
                const link = document.createElement('a');
                const page = movie.media_type === "movie" ? "det_film.html" : "det_serie.html";
                link.href = `${page}?id=${movie.id}`;
                link.classList.add('movie-link');

                // Image du film/série
                const img = document.createElement('img');
                img.src = movie.poster_path ? IMAGE_BASE_URL + movie.poster_path : 'https://www.mountainmotorvehicles.co.uk/wp-content/uploads/2024/05/No-image-available-2-300x300.jpg';
                img.classList.add('d-block', 'w-100');
                img.alt = movie.title || movie.name || "Affiche du film/série";
                img.title = movie.title || movie.name || "Film/Série";

                // Titre du film ou série
                const title = document.createElement('div');
                title.classList.add('movie-title');
                title.textContent = movie.title || movie.name || "Sans titre";
                title.style.textAlign = 'center';
                title.style.marginTop = '0.5rem';
                title.style.fontSize = '0.9rem';
                title.style.color = 'var(--color-text)';

                // Assembler les éléments
                link.appendChild(img);
                col.appendChild(link);
                col.appendChild(title); // Ajout du titre
                row.appendChild(col);
            }

            slide.appendChild(row);
            carouselInner.appendChild(slide);
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des films et séries :", error);
        document.querySelector("#carouselExample .carousel-inner").innerHTML = '<div class="carousel-item active"><div class="row"><div class="col-12 text-center">Impossible de charger les films et séries</div></div></div>';
    }
}
