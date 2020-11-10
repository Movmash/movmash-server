const genreConverter = (data) => {
  const genreList = {
    28: "Action",
    35: "Comedy",
    27: "Horror",
    10749: "Romance",
    99: "Documentary",
    12: "Adventure",
    16: "Animation",
    18: "Drama",
    80: "Crime",
    10751: "Family",
    14: "Fantasy",
    36: "History",
    10402: "Music",
    9648: "Mystery",
    878: "Sci-Fi",
    10770: "TV",
    53: "Thriller",
    10752: "War",
    37: "Western",
  };
  const currentGenre = [];
  for (let i = 0; i < data.length; i++) {
    currentGenre.push(genreList[data[i]]);
  }

  //   let movieGenres;
  //   for (let i = 0; i < currentGenre.length; i++) {
  //     if (currentGenre.length === 2) {
  //       if (i === 0) {
  //         movieGenres = `${currentGenre[i]} `;
  //       } else if (i === currentGenre.length - 1) {
  //         movieGenres = movieGenres + `| ${currentGenre[i]}`;
  //       }
  //     } else {
  //       if (i === 0) {
  //         movieGenres = `${currentGenre[i]} |`;
  //       } else if (i === currentGenre.length - 1) {
  //         movieGenres = movieGenres + ` ${currentGenre[i]}`;
  //       } else {
  //         movieGenres = movieGenres + ` ${currentGenre[i]} |`;
  //       }
  //     }
  //   }

  return currentGenre;
};

module.exports = { genreConverter };
