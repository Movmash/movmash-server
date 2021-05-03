const axios = require("../axiosTest");
const {getUser} = require("./utilityFunctions/getloginUserData")
beforeAll(async () => {
  const loginUserData = await getUser();
  axios.defaults.headers.common["Authorization"] = loginUserData.token;
//   username = loginUserData.username;
});

describe("TEST OF POST", () => {
    test('POST REVIEW POST', async () => {
        const response = axios.post("/api/v1/home/post", {
          rating: 25,
          type: "review",
          movieId: 23,
          review: "This is Test review",
          genreId: [21,32,12],
          moviePoster: "TestImage.jpeg",
          releaseYear: "2012",
          movieTitle: "Test Title",
          postType: "home",
        });

        const {data,status} = response;
        // expect(data).toEqual(
        //     expect.objectContaining({
        //         _id: expect.any(String)
        //     })
        // )
        console.log(data)
        expect(status).toBe(201);
    })

    test("POST SUGGESTME POST", async () => {
        const response = axios.post("/api/v1/home/post", {
          rating: 21,
          type: "suggestMe",
          genreName: ["Action","Adventure"],
          language: "en",
          duration: "12m",
          postType: "home",
        });

        const {data,status} = response;
        // expect(data).toEqual(
        //     expect.objectContaining({
        //         _id: expect.any(String)
        //     })
        // )
        expect(status).toBe(201);
    });

    test("POST TICKET POST", async () => {
        const response = axios.post("/api/v1/home/post", {
          type: "ticket",
          description: "This is ticket description",
          movieId: 23,
          showTimeFrom: "2020-09-29T15:21:48.828+00:00",
          showTimeTo: "2020-09-29T15:21:48.828+00:00",
          genreId: [12,12,23],
          moviePoster: "TestImage.png",
          releaseYear: "2012",
          movieTitle: "Test title",
          overview: "This is test overview",
          postType: "home",
        });

        const {data,status} = response;
        // expect(data).toEqual(
        //     expect.objectContaining({
        //         _id: expect.any(String)
        //     })
        // )
        expect(status).toBe(201);
    });

    // test("LIKE POST", async () => {});

    // test("UNLIKE POST", async () => {});

    // test("DELETE POST", async () => {});

    // test("GET SUBSCRIBED POST", async () => {});

    // test("GET LOGIN USER POST", async () => {});

    // test("COMMENT POST", async () => {});

    // test("DELETE COMMENT", async () => {});

    // test("LIKE COMMENT", async () => {});

    // test("UNLIKE COMMENT", async () => {});

    // test("GET POST COMMENT", async () => {});

    // test("GET MASH USER POST", async () => {});

    // test("SEND BOOKING REQUEST", async () => {});

    // test("GET REQUESTED TICKET", async () => {});

    // test("CANCEL REQUESTED TCIKET", async () => {});

    // test("MARK TICKET CONFIRM", async () => {});
})