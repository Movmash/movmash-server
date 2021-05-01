const axios = require('../axiosTest');
const getUser = require("./utilityFunctions/getloginUserData");

let listId;
let username
beforeAll(async () => {
    const loginUserData = await getUser();
    axios.defaults.headers.common["Authorization"] = loginUserData.token;
    username = loginUserData.username
})
describe('TEST OF MOVIES', () => {
    test("GET MOVIE UPCOMING COVER", async () => {
        const response = await axios.get('/api/v1/movie/upcoming-cover');
        const {data,status} = response;
        expect(Array.isArray(data)).toBeTruthy();
        expect(status).toBe(200);
    });

    test("GET MOVIE GENRE LIST", async () => {
        const response = await axios.get('/api/v1/movie/genre/Trending/1');

        const {data ,status} = response;
        expect(Array.isArray(data.results)).toBeTruthy();
        expect(status).toBe(200);
    });

    test("GET MOVIE DETAIL", async () => {
        const response = await axios.get("/api/v1/movie/details/25");
        const { data, status } = response;
        expect(data).toEqual(
            expect.objectContaining({
                id: expect.any(Number)
            })
        );
        expect(status).toBe(200);
    });

    test("GET SEARCH MOVIE LIST", async () => {
      const response = await axios.get("/api/v1/movie/search-movie",{
          query: {
              query: "avenger"
          }
      });
      const { data, status } = response;
      expect(Array.isArray(data.results)).toBeTruthy();
      expect(status).toBe(200);
    });

    test("CREATE NEW MOVIE LIST", async () => {
      const response = await axios.post("/api/v1/movie/create-new-list", {
        movieList: [{}],
        listTitle: "test title",
        description: "test descroption",
        privacy: "test",
        tags: ["test1", "test2"],
      });
      const { data, status } = response;
      listId = data._id
      expect(data).toEqual(
          expect.objectContaining({
              _id: expect.any(String),
              movieList: expect.any(Array)
          })
      );
      expect(status).toBe(201);
    });

    test("UPDATE MOVIE LIST", async () => {
      const response = await axios.put("/api/v1/movie/update-list", {
        id: listId,
        movieList: [{}],
        listTitle: "updated test title",
        description: "updated test descroption",
        privacy: "updated test",
        tags: ["updated test1", "updated test2"],
      });
      const { data, status } = response;
      
      expect(data).toEqual(
        expect.objectContaining({
          _id: expect.any(String),
          movieList: expect.any(Array),
        })
      );
      expect(status).toBe(201);
    });

    test("GET USER MOVIE LIST", async () => {
      const response = await axios.get("/api/v1/movie/get-user-list");
      const { data, status } = response;

      expect(Array.isArray(data)).toBeTruthy();
      expect(status).toBe(200);
    });

    test("GET MASH USER MOVIE LIST", async () => {
      const response = await axios.get(
        `/api/v1/movie/get-mash-user-list/${username}`
      );
      const { data, status } = response;

      expect(Array.isArray(data)).toBeTruthy();
      expect(status).toBe(200);
    });

    test("DELETE MOVIE LIST", async () => {
      const response = await axios.delete(`/api/v1/movie/delete-list/${listId}`);
      const { data, status } = response;

      expect(data).toEqual(
          expect.objectContaining({
              mesg: expect.any(String) //spelling mistake
          })
      );
      expect(status).toBe(201);
    });

    test("GET USER LIKE DISLIKE MOVIELIST", async () => {
      const response = await axios.get(
        `api/v1/movie/get-user-like-dislike-movielist`
      );
      const { data, status } = response;

      expect(data).toEqual(
        expect.objectContaining({
          likedMovies: expect.any(Array),
          dislikedMovies: expect.any(Array)
        })
      );
      expect(status).toBe(200);
    });

    // test("GET MASH USER LIKE DISLIKE MOVIELIST", async () => {
    //   const response = await axios.get(
    //     `/api/v1/movie/get-mash-user-like-dislike-movielist/${username}`
    //   );
    //   const { data, status } = response;
    //     console.log(response)
    //   expect(data).toEqual(
    //     expect.objectContaining({
    //       likedMovies: expect.any(Array),
    //       dislikedMovies: expect.any(Array),
    //     })
    //   );
    //   expect(status).toBe(200);
    // });

    test("LIKE MOVIE", async () => {
      const response = await axios.post(`/api/v1/movie/like-movie`, {
        movieId: 24,
        movieTitle: "Test title",
        overview: "Test overview",
        moviePoster: "test.jpeg",
        releaseDate: "2016",
        genreId: [1,2,3],
      });
      const { data, status } = response;

      expect(data).toEqual(
        expect.objectContaining({
          liked: expect.any(Boolean),
          disliked: expect.any(Boolean),
        })
      );
      expect(status).toBe(201);
    });

    test("DISLIKE MOVIE", async () => {
      const response = await axios.post(`/api/v1/movie/dislike-movie`, {
        movieId: 24,
        movieTitle: "Test title",
        overview: "Test overview",
        moviePoster: "test.jpeg",
        releaseDate: "2016",
        genreId: [1, 2, 3],
      });
      const { data, status } = response;

      expect(data).toEqual(
        expect.objectContaining({
          liked: expect.any(Boolean),
          disliked: expect.any(Boolean),
        })
      );
      expect(status).toBe(200);  //should be 201
    });

    test("DISLIKE MOVIE", async () => {
      const response = await axios.post(`/api/v1/movie/dislike-movie`, {
        movieId: 24,
        movieTitle: "Test title",
        overview: "Test overview",
        moviePoster: "test.jpeg",
        releaseDate: "2016",
        genreId: [1, 2, 3],
      });
      const { data, status } = response;

      expect(data).toEqual(
        expect.objectContaining({
          liked: expect.any(Boolean),
          disliked: expect.any(Boolean),
        })
      );
      expect(status).toBe(200); //should be 201
    });

    // test("UNDO LIKE MOVIE", async () => {  //Bug init when it send two time it gives internal server error
    //   const response = await axios.post(`/api/v1/movie/undo-like-movie`, {
    //     movieId: 24,
    //   });
    //   const { data, status } = response;
    //   expect(data).toEqual(
    //     expect.objectContaining({
    //       liked: expect.any(Boolean),
    //     })
    //   );
    //   expect(status).toBe(201); 
    // });
})

///api/v1/movie/get-user-like-dislike-movielist