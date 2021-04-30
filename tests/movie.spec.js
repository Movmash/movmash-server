const axios = require('../axiosTest');

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

    
})