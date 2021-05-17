const axios = require("../axiosTest");
const { getUser } = require("./utilityFunctions/getloginUserData");
const notificationId = [];
beforeAll(async () => {
  const loginUserData = await getUser();
  axios.defaults.headers.common["Authorization"] = loginUserData.token;
});

describe("TEST OF NOTIFICATION", () => {

  test("GET ALL NOTIFICATION", async () => {
    const response = await axios.get("/api/v1/home/get-notification");
    const { data, status } = response;
    for(let i = 0; i < data.length; i++){
        notificationId.push(data[i]._id)
    }
    expect(Array.isArray(data)).toBeTruthy();
    expect(status).toBe(200);
  });

  test("CREATE LIVE SHOW", async () => {
    const response = await axios.put(
      "/api/v1/home/user/read-notification",
      notificationId
    );
    const { data, status } = response;
    expect(data).toEqual(
      expect.objectContaining({
        ok: expect.any(Number),
      })
    );
    expect(status).toBe(201);
  });
});
