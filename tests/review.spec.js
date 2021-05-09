const axios = require("../axiosTest");
const { getUser } = require("./utilityFunctions/getloginUserData");

beforeAll(async () => {
  const loginUserData = await getUser();
  axios.defaults.headers.common["Authorization"] = loginUserData.token;
});

describe("TEST OF REVIEW", () => {
  test("POST USER REVIEW", async () => {
    const response = await axios.post("/api/v1/movie/post-user-review", {
      movieId: 23,
      rate: 5,
      description: "This is test review description",
    });
    const { data, status } = response;
    expect(data).toEqual(
      expect.objectContaining({
        _id: expect.any(String),
      })
    );
    expect(status).toBe(201);
  });

  test("GET MOVIE RATED STATUS", async () => {
    const response = await axios.get(
      "/api/v1/movie/movie-rated-status/23"
    );
    const { data, status } = response;
    expect(data).toEqual(
      expect.objectContaining({
        isRated: expect.any(Boolean),
      })
    );
    expect(status).toBe(200);
  });
});
