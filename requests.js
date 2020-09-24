require("dotenv").config();
const APIKEY = process.env.API_KEY;

const moviePageData = {
  fetchTrending: `/trending/movie/week?api_key=${APIKEY}&language=en-US`,
  fetchNetfilxOriginals: `/discover/tv?api_key=${APIKEY}&with_networks=213`,
  fetchTopRated: `/movie/top_rated?api_key=${APIKEY}&language=en-US`,
  fetchActionMovies: `/discover/movie?api_key=${APIKEY}&with_genres=28`,
  fetchComedyMovies: `/discover/movie?api_key=${APIKEY}&with_genres=35`,
  fetchHorrorMovies: `/discover/movie?api_key=${APIKEY}&with_genres=27`,
  fetchRomanceMovies: `/discover/movie?api_key=${APIKEY}&with_genres=10749`,
  fetchDocumentaries: `/discover/movie?api_key=${APIKEY}&with_genres=99`,
  fetchUpcomingMovies: `/movie/upcoming?api_key=${APIKEY}&language=en-US`,
  fetchAdventureMovies: `/discover/movie?api_key=${APIKEY}&with_genres=12`,
  fetchAnimationMovies: `/discover/movie?api_key=${APIKEY}&with_genres=16`,
  fetchDramaMovies: `/discover/movie?api_key=${APIKEY}&with_genres=18`,
  fetchCrimeMovies: `/discover/movie?api_key=${APIKEY}&with_genres=80`,
  fetchFamilyMovies: `/discover/movie?api_key=${APIKEY}&with_genres=10751`,
  fetchFantasyMovies: `/discover/movie?api_key=${APIKEY}&with_genres=14`,
  fetchHistoryMovies: `/discover/movie?api_key=${APIKEY}&with_genres=36`,
  fetchMusicMovies: `/discover/movie?api_key=${APIKEY}&with_genres=10402`,
  fetchMystryMovies: `/discover/movie?api_key=${APIKEY}&with_genres=9648`,
  fetchSciFiMovies: `/discover/movie?api_key=${APIKEY}&with_genres=878`,
  fetchTVMovies: `/discover/movie?api_key=${APIKEY}&with_genres=10770`,
  fetchThrillerMovies: `/discover/movie?api_key=${APIKEY}&with_genres=53`,
  fetchWarMovies: `/discover/movie?api_key=${APIKEY}&with_genres=10752`,
  fetchWesternMovies: `/discover/movie?api_key=${APIKEY}&with_genres=37`,
  //....................... search movie
  searchMovies: `/search/movie?api_key=${APIKEY}&language=en-US`,
  searchSeries: `/search/tv?api_key=${APIKEY}&language=en-US`,
};

module.exports = moviePageData;
