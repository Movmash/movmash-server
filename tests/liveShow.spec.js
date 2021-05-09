const axios = require("../axiosTest");
const { getUser } = require("./utilityFunctions/getloginUserData");
const { v4: uuidv4 } = require("uuid");
let roomCode;
beforeAll(async () => {
  const loginUserData = await getUser();
  axios.defaults.headers.common["Authorization"] = loginUserData.token;
});

describe("TEST OF LIVE SHOW", () => {
  test("CREATE LIVE SHOW", async () => {
    const response = await axios.post("/api/v1/live/create-live-show", {
      description: "This is test room description",
      roomCode: uuidv4(),
      posterUrl:
        "https://cdn.pastemagazine.com/www/articles/2016/01/21/ProphetEW_Main.jpg",
      privacy: "public",
      roomTitle: "This is title",
      genre: "Action",
      memberNumber: 0,
      videoUrl: "https://www.youtube.com/watch?v=vuQR6Mj64jQ",
    });
    const { data, status } = response;
    roomCode = data.roomCode;
    expect(data).toEqual(
      expect.objectContaining({
        _id: expect.any(String),
        roomCode: expect.any(String),
      })
    );
    expect(status).toBe(201);
  });

  test("GET ALL LIVE SHOW", async () => {
    const response = await axios.get("/api/v1/live/get-all-live-show");
    const { data, status } = response;
    expect(Array.isArray(data)).toBeTruthy();
    expect(status).toBe(200);
  });

  test("GET FOLLOWING LIVE SHOW DETAIL", async () => {
      const response = await axios.get(
      "/api/v1/live/get-followings-live-show"
      );
      const { data, status } = response;
      expect(Array.isArray(data)).toBeTruthy();
      expect(status).toBe(200);
  });

  test("GET GENRE LIVE SHOW DETAIL", async () => {
      const response = await axios.get(
        "/api/v1/live/get-genre-live-show/Action"
      );
      const { data, status } = response;
      expect(Array.isArray(data)).toBeTruthy();
      expect(status).toBe(200);
  });

  test("GET LIVE SHOW DETAIL", async () => {
    const response = await axios.get(
      `/api/v1/live/get-live-show-details/${roomCode}`
    );
    const { data, status } = response;
    expect(data).toEqual(
      expect.objectContaining({
        _id: expect.any(String),
        roomCode: expect.any(String),
      })
    );
    expect(status).toBe(200);
  });
});
