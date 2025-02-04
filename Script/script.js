const API_KEY = '874fa709';
const BASE_URL = 'https://www.omdbapi.com/';

const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const showSearchButton = document.getElementById('show-search-button');
const searchBox = document.getElementById('search-box');
const resultsContainer = document.getElementById('results-container');
const movieDetailsContainer = document.getElementById('movie-details-container');

// Afficher l'input de recherche quand on clique sur "Rechercher"
showSearchButton.addEventListener('click', () => {
    searchBox.classList.add('visible');
    showSearchButton.style.display = 'none';
});

searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
        fetchMovies(query);
    } else {
        alert('Veuillez entrer un titre de film.');
    }
});

async function fetchMovies(query) {
    const response = await fetch(`${BASE_URL}?apikey=${API_KEY}&s=${query}`);
    const data = await response.json();

    resultsContainer.innerHTML = '';
    if (movieDetailsContainer) {
        movieDetailsContainer.style.display = 'none';
    }

    if (data.Response === 'True') {
        data.Search.forEach(movie => {
            const card = document.createElement('div');
            card.className = 'movie-card';
            card.innerHTML = `
                <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'placeholder.jpg'}" alt="${movie.Title}">
                <h3>${movie.Title}</h3>
                <button onclick="fetchMovieDetails('${movie.imdbID}')">Voir détails</button>
            `;
            resultsContainer.appendChild(card);
        });
    } else {
        resultsContainer.innerHTML = '<p>Aucun résultat trouvé.</p>';
    }
}

async function fetchMovieDetails(imdbID) {
    const response = await fetch(`${BASE_URL}?apikey=${API_KEY}&i=${imdbID}`);
    const movie = await response.json();

    if (movie.Response === 'True') {
        resultsContainer.innerHTML = '';
        movieDetailsContainer.style.display = 'block';
        movieDetailsContainer.innerHTML = `
            <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'placeholder.jpg'}" alt="${movie.Title}">
            <h2>${movie.Title}</h2>
            <p><strong>Année :</strong> ${movie.Year}</p>
            <p><strong>Genre :</strong> ${movie.Genre}</p>
            <p><strong>Réalisateur :</strong> ${movie.Director}</p>
            <p><strong>Résumé :</strong> ${movie.Plot}</p>
            <button onclick="fetchMovies('${searchInput.value}')">Retour</button>
        `;
    }
}
