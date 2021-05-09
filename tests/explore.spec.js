const axios = require("../axiosTest");
const { getUser } = require("./utilityFunctions/getloginUserData");

beforeAll(async () => {
  const loginUserData = await getUser();
  axios.defaults.headers.common["Authorization"] = loginUserData.token;
});

describe("TEST OF EXPLORE", () => {
//   test("GET USER RECOMMENDATION", async () => {
//     const response = await axios.get("/api/v1/explore/get-user-recommendation");
//     const { data, status } = response;
//     // expect(Array.isArray(data)).toBeTruthy();
//     console.log(data)
//     expect(status).toBe(200);
//   });

  test("GET EXPLORE POST", async () => {
    const response = await axios.get("/api/v1/explore/get-explore-post");
    const { data, status } = response;
    expect(Array.isArray(data)).toBeTruthy();
    expect(status).toBe(200);
  });
});
