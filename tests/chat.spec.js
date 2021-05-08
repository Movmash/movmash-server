const axios = require("../axiosTest");
const { getUser } = require("./utilityFunctions/getloginUserData");
let roomId;
beforeAll(async () => {
  const loginUserData = await getUser();
  axios.defaults.headers.common["Authorization"] = loginUserData.token;
});

describe("TEST OF CHATS", () => {
  test("GET USER ROOM", async () => {
    const response = await axios.get("/api/v1/home/get-user-rooms");
    const {data, status} = response;
    roomId = data[0]._id;
    expect(Array.isArray(data)).toBeTruthy();
    expect(status).toBe(200);
  });

  test("MARK CHAT ROOM READ", async () => {
    const response = await axios.put("/api/v1/home/mark-chatRoom-read", {
      roomId,
    });
    const { data, status } = response;
    expect(data).toEqual(
        expect.objectContaining({
            msg: expect.any(String),
        })
    );
    expect(status).toBe(201);
  });

  test("GET UNREAD ROOMS", async () => {
    const response = await axios.get("/api/v1/home/get-unread-rooms");
    const { data, status } = response;
    expect(Array.isArray(data)).toBeTruthy();
    expect(status).toBe(200);
  });

  test("GET ROOM MESSAGES", async () => {
    const response = await axios.get(`/api/v1/home/get-rooms-messages/${roomId}`);
    const { data, status } = response;
    expect(Array.isArray(data)).toBeTruthy();
    expect(status).toBe(200);
  });
});
