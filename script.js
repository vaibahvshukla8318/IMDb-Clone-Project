// DOM elements
const movieSearchBox = document.querySelector('#movie-search-box'); // Input box
const searchList = document.querySelector('#search-list'); // Autocomplete box
const resultGrid = document.querySelector('#result-grid'); // Result container
let favMovies = JSON.parse(localStorage.getItem('favMovies')) || []; // Retrieve favorite movies from local storage

// Set default data to local storage
if (!localStorage.getItem('favMovies')) {
  localStorage.setItem('favMovies', JSON.stringify(favMovies));
}

// Load movies from API
async function loadMovies(searchTerm) {
  const URL = `https://www.omdbapi.com/?s=${searchTerm}&page=1&apikey=699e79e2`; // Base URL
  const res = await fetch(URL); // Fetch data from server
  const data = await res.json(); // Arrange data in readable format (JSON)
  console.log(data);

  // Check if everything is okay
  if (data.Response === 'True') {
    displayMovieList(data.Search); // Display the autocomplete box
  }
}

// Find movies as you type any character
const findMovies = () => {
  let searchTerm = movieSearchBox.value.trim(); // Get typed value and remove whitespace

  // Perform operation only if any character is present in the search box
  if (searchTerm.length > 0) {
    searchList.classList.remove('hide-search-list'); // Show the autocomplete box
    loadMovies(searchTerm); // Load movies from API
  } else {
    searchList.classList.add('hide-search-list'); // Hide the autocomplete box if no character is present in the search box
  }
};

// Show the matched movies in the autocomplete box
const displayMovieList = (movies) => {
  searchList.innerHTML = ''; // Clear the list of movies

  // Get all matching movies related to typed characters
  for (let idx = 0; idx < movies.length; idx++) {
    let movieListItem = document.createElement('div'); // Create a Div
    movieListItem.dataset.id = movies[idx].imdbID; // Set ID to each movie result
    movieListItem.classList.add('search-list-item'); // Add CSS

    // Set poster image address
    let moviePoster =
      movies[idx].Poster !== 'N/A' ? movies[idx].Poster : 'no-image.jpg';

    // Add a matched result to the list
    movieListItem.innerHTML = `
      <div class="search-item-thumbnail">
          <img src="${moviePoster}" alt="movie">
      </div>
      <div class="search-item-info">
          <h3>${movies[idx].Title}</h3>
          <p>${movies[idx].Year}</p>
      </div>
    `;

    searchList.appendChild(movieListItem); // Add a matched movie to the autocomplete list
  }

  loadMovieDetails(); // Load movie details
};


// Load movie details
function loadMovieDetails() {
  const searchListMovies = searchList.querySelectorAll('.search-list-item');
  searchListMovies.forEach((movie) => {
    movie.addEventListener('click', async () => {
      searchList.classList.add('hide-search-list');
      movieSearchBox.value = '';
      const result = await fetch(
        `https://www.omdbapi.com/?i=${movie.dataset.id}&apikey=699e79e2`
      );
      const movieDetails = await result.json();
      displayMovieDetails(movieDetails);
    });
  });
}


// Display movie details
const displayMovieDetails = (details) => {
  // Add movie to Page
  resultGrid.innerHTML = `
    <div class="movie-poster">
        <img src="${
          details.Poster !== 'N/A' ? details.Poster : 'no-image.jpg'
        }" alt="movie-poster">
    </div>
    <div class="movie-info">
        <h3 class="movie-title">${details.Title}</h3>
        <ul class="movie-misc-info">
            <li class="year">Year: ${details.Year}</li>
            <li class="rated">Ratings: ${details.Rated}</li>
            <li class="released">Released: ${details.Released}</li>
        </ul>
        <p class="genre"><b>Genre:</b> ${details.Genre}</p>
        <p class="writer"><b>Writer:</b> ${details.Writer}</p>
        <p class="actors"><b>Actors:</b> ${details.Actors}</p>
        <p class="plot"><b>Plot:</b> ${details.Plot}</p>
        <p class="language"><b>Language:</b> ${details.Language}</p>
        <p class="awards"><b>Awards: <i class="fa-solid fa-award"></i></b> ${
          details.Awards
        }</p>
    </div>
  `;

  // Create "Add to Favorites" button
  const addToFavBtn = document.createElement('button');
  addToFavBtn.id = 'addToFav';
  addToFavBtn.dataset.movieId = details.imdbID;
  addToFavBtn.textContent = getAddToFavButtonText(details.imdbID);

  // Add event listener to the button
  addToFavBtn.addEventListener('click', () => {
    const movieId = addToFavBtn.dataset.movieId;

    // Check if the movie is already added to the list
    if (favMovies.includes(movieId)) {
      addToFavBtn.textContent = 'Already Added to Favorites';
    } else {
      favMovies.push(movieId); // Add movie to favorite list
      localStorage.setItem('favMovies', JSON.stringify(favMovies)); // Set data to local storage
      addToFavBtn.textContent = 'Added to Favorites';
    }
  });

  resultGrid.appendChild(addToFavBtn); // Add the button to the result container
};

// Get the appropriate button text based on whether the movie is already in favorites
function getAddToFavButtonText(movieId) {
  return favMovies.includes(movieId)
    ? 'Already Added to Favorites'
    : 'Add to Favorites';
}

window.addEventListener('click', (e) => {
  if (e.target.className !== 'form-control') {
    searchList.classList.add('hide-search-list'); // Hide autocomplete box if user clicks anywhere other than autocomplete box
  }
});





movieSearchBox.addEventListener('keyup', findMovies);
movieSearchBox.addEventListener('click', findMovies);

let movieID = localStorage.getItem('movieID'); // Get movie ID from local storage

// Load only clicked movie detail
async function getData(movieID) {
  const result = await fetch(
    `https://www.omdbapi.com/?i=${movieID}&apikey=699e79e2`
  ); // Base URL
  const movieDetails = await result.json(); // Movie Details from server
  displayMovieDetails(movieDetails); // Display the movie
}

// On Load - Run this command only if it has any data to show.
if (movieID) {
  getData(movieID);
}
