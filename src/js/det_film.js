const API_KEY = 'c14a5ecc94d5bace12748670823aa6c0';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id');

    if (!movieId) {
        window.location.href = 'index.html';
        return;
    }

    const movie = await fetchMovieDetails(movieId);
    const video = await fetchMovieTrailer(movieId);
    const credits = await fetchMovieCredits(movieId);

    updateMovieUI(movie, video, credits);
});

async function fetchMovieDetails(id) {
    const res = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=fr`);
    return await res.json();
}

async function fetchMovieTrailer(id) {
    const res = await fetch(`${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}&language=fr`);
    const data = await res.json();
    return data.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
}

// Reset trailer iframe when modal is closed
const trailerModalEl = document.getElementById('det_film-trailer-modal');
trailerModalEl.addEventListener('hidden.bs.modal', () => {
    const trailer = document.getElementById('det_film-trailer');
    trailer.src = '';
});

async function fetchMovieCredits(id) {
    const res = await fetch(`${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}&language=fr`);
    return await res.json();
}

function updateMovieUI(movie, trailer, credits) {
    document.getElementById('movie-image').src = IMAGE_BASE_URL + movie.poster_path;
    document.getElementById('det_film-title').textContent = movie.title;
    document.getElementById('genre').textContent = movie.genres.map(g => g.name).join(', ');
    document.getElementById('duration').textContent = movie.runtime + ' min';
    document.getElementById('release-date').textContent = movie.release_date;
    document.getElementById('rating').textContent = movie.vote_average.toFixed(1);
    document.getElementById('det_film-description').textContent = movie.overview;

    const director = credits.crew.find(p => p.job === 'Director');
    document.getElementById('director').textContent = director ? director.name : 'Inconnu';

    const topActors = credits.cast.slice(0, 3).map(actor => actor.name).join(', ');
    document.getElementById('actors').textContent = topActors;

    const playBtn = document.getElementById('det_film-play-btn');
    playBtn.addEventListener('click', () => {
        if (trailer) {
            document.getElementById('det_film-trailer').src = `https://www.youtube.com/embed/${trailer.key}?autoplay=1`;
            const modal = new bootstrap.Modal(document.getElementById('det_film-trailer-modal'));
            modal.show();
        } else {
            alert('Bande-annonce non disponible.');
        }
    });

    const actorCarousel = document.getElementById('det_film-actor-carousel');
    credits.cast.slice(0, 15).forEach(actor => {
        const actorDiv = document.createElement('div');
        actorDiv.className = 'det_film-actor-card';

        actorDiv.innerHTML = `
            <a href="acteur.html?id=${actor.id}"><img src="${actor.profile_path ? IMAGE_BASE_URL + actor.profile_path : 'https://www.mountainmotorvehicles.co.uk/wp-content/uploads/2024/05/No-image-available-2-300x300.jpg'}"
                 alt="${actor.name}" title="${actor.name}"></a>
            <p>${actor.name}</p>
        `;
        actorCarousel.appendChild(actorDiv);
    });
}
