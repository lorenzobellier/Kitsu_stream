const API_KEY = 'c14a5ecc94d5bace12748670823aa6c0';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const seriesId = urlParams.get('id');

    if (!seriesId) {
        window.location.href = 'index.html';
        return;
    }

    const series = await fetchSeriesDetails(seriesId);
    const video = await fetchSeriesTrailer(seriesId);
    const credits = await fetchSeriesCredits(seriesId);
    const seasons = await fetchSeriesSeasons(seriesId);

    updateSeriesUI(series, video, credits, seasons);
});

async function fetchSeriesDetails(id) {
    const res = await fetch(`${BASE_URL}/tv/${id}?api_key=${API_KEY}&language=fr`);
    return await res.json();
}

async function fetchSeriesTrailer(id) {
    const res = await fetch(`${BASE_URL}/tv/${id}/videos?api_key=${API_KEY}&language=fr`);
    const data = await res.json();
    return data.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
}

const trailerModalEl = document.getElementById('det_serie-trailer-modal');
trailerModalEl.addEventListener('hidden.bs.modal', () => {
    const trailer = document.getElementById('det_serie-trailer');
    trailer.src = '';
});

async function fetchSeriesCredits(id) {
    const res = await fetch(`${BASE_URL}/tv/${id}/credits?api_key=${API_KEY}&language=fr`);
    return await res.json();
}

async function fetchSeriesSeasons(id) {
    try {
        const res = await fetch(`${BASE_URL}/tv/${id}?api_key=${API_KEY}&language=en-US`);
        const data = await res.json();

        if (!data || !data.seasons || !Array.isArray(data.seasons)) {
            throw new Error('Aucune saison trouvée');
        }

        console.log('Saisons reçues :', data.seasons);
        return data.seasons;
    } catch (error) {
        console.error('Erreur lors de la récupération des saisons :', error);
        return [];
    }
}

function updateSeriesUI(series, trailer, credits, seasons) {
    document.getElementById('serie-image').src = IMAGE_BASE_URL + series.poster_path;
    document.getElementById('det_serie-title').textContent = series.name;
    document.getElementById('genre').textContent = series.genres.map(g => g.name).join(', ');
    document.getElementById('episode-count').textContent = series.number_of_episodes;
    document.getElementById('release-date').textContent = series.first_air_date;
    document.getElementById('rating').textContent = series.vote_average.toFixed(1);
    document.getElementById('det_serie-description').textContent = series.overview;

    const creator = series.created_by.map(creator => creator.name).join(', ');
    document.getElementById('creator').textContent = creator || 'Inconnu';

    const topActors = credits.cast.slice(0, 3).map(actor => actor.name).join(', ');
    document.getElementById('actors').textContent = topActors;

    const playBtn = document.getElementById('det_serie-play-btn');
    playBtn.addEventListener('click', () => {
        if (trailer) {
            document.getElementById('det_serie-trailer').src = `https://www.youtube.com/embed/${trailer.key}?autoplay=1`;
            const modal = new bootstrap.Modal(document.getElementById('det_serie-trailer-modal'));
            modal.show();
        } else {
            alert('Bande-annonce non disponible.');
        }
    });

    const actorCarousel = document.getElementById('det_serie-actor-carousel');
    credits.cast.slice(0, 15).forEach(actor => {
        const actorDiv = document.createElement('div');
        actorDiv.className = 'det_serie-actor-card';
        actorDiv.innerHTML = `
            <a href="acteur.html?id=${actor.id}"><img src="${actor.profile_path ? IMAGE_BASE_URL + actor.profile_path : 'https://www.mountainmotorvehicles.co.uk/wp-content/uploads/2024/05/No-image-available-2-300x300.jpg'}" alt="${actor.name}" title="${actor.name}"></a>
            <p>${actor.name}</p>
        `;
        actorCarousel.appendChild(actorDiv);
    });

    const seasonsList = document.getElementById('seasons-list');
    if (seasons.length > 0) {
        seasons.forEach(season => {
            const seasonDiv = document.createElement('div');
            seasonDiv.className = 'det_serie-season';
            seasonDiv.innerHTML = `
                <h5 class="det_serie-season-title">${season.name} (${season.air_date ? season.air_date.split('-')[0] : 'Date inconnue'})</h5>
            `;
            seasonDiv.addEventListener('click', () => showEpisodes(season));
            seasonsList.appendChild(seasonDiv);
        });
    } else {
        const noSeasonsDiv = document.createElement('div');
        noSeasonsDiv.className = 'no-seasons';
        noSeasonsDiv.textContent = 'Aucune saison disponible.';
        seasonsList.appendChild(noSeasonsDiv);
    }
}

function showEpisodes(season) {
    const overlay = document.getElementById('det_serie-season-overlay');
    const overlayHeader = document.getElementById('det_serie-overlay-header');
    const episodeList = document.getElementById('det_serie-episode-list');

    overlayHeader.textContent = `${season.name}`;

    // Vérifier si 'season.episodes' existe et est un tableau
    if (season.episodes && Array.isArray(season.episodes)) {
        episodeList.innerHTML = season.episodes.map(episode => `
            <li>${episode.name} - ${episode.air_date}</li>
        `).join('');
    } else {
        episodeList.innerHTML = '<li>Aucun épisode disponible</li>';
    }

    overlay.classList.add('active');

    const closeOverlay = document.getElementById('det_serie-close-overlay');
    closeOverlay.addEventListener('click', () => {
        overlay.classList.remove('active');
    });
}

