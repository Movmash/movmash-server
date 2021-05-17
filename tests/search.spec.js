const axios = require("../axiosTest");
const { getUser } = require("./utilityFunctions/getloginUserData");

beforeAll(async () => {
  const loginUserData = await getUser();
  axios.defaults.headers.common["Authorization"] = loginUserData.token;
});

describe("TEST OF SEARCH", () => {
  test("SEARCH USER", async () => {
    const response = await axios.get("/api/v1/search-user?search=test");
    const { data, status } = response;
    expect(Array.isArray(data)).toBeTruthy();
    expect(status).toBe(200);
  });

  test("SEARCH TICKET", async () => {
    const response = await axios.get("/api/v1/search-ticket?search=test");
    const { data, status } = response;
    expect(Array.isArray(data)).toBeTruthy();
    expect(status).toBe(200);
  });  

  test("SEARCH LIST", async () => {
    const response = await axios.get("/api/v1/search-list?search=test");
    const { data, status } = response;
    expect(Array.isArray(data)).toBeTruthy();
    expect(status).toBe(200);
  });
});
