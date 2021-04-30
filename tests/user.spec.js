const axios = require("../axiosTest");
const shortid = require("shortid");
const getToken = require("./utilityFunctions/getToken");
let token;
let userId;
beforeAll(async () => {
    token = await getToken();
})
describe("TEST OF USER", () => {
    test("SIGNUP NEW USER", async () => {
        let id = shortid.generate();
        let email = `${id}@test.com`;
        const response = await axios.post("/api/v1/home/signup", {
          email: email,
          password: "12345",
          confirmPassword: "12345",
        });
        const {data,status} = response;
        expect(data).toEqual(expect.objectContaining({
            idToken: expect.any(String),
        }));
        expect(status).toBe(201);
    })
    test("LOGIN USER", async () => {
      const response = await axios.post("/api/v1/home/login", {
        email: "test@test.com",
        password: "12345",
      });
      const { data, status } = response;
      userId = data.user._id;
      expect(data).toEqual(
        expect.objectContaining({
          idToken: expect.any(String),
        })
      );
      expect(status).toBe(200);
    });
    test("GET USER DETAIL",async () => {
        const response = await axios.get(`/api/v1/home/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "text/plain",
          },
        });
        const {data,status} = response;
        expect(data).toEqual(
          expect.objectContaining({
            user: expect.any(Object),
          })
        );
        expect(status).toBe(200);
    })
    test("GET MASH USER DETAIL", async () => {
      const response = await axios.get(`/api/v1/home/mash-user-details/test`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "text/plain",
        },
      });
      const { data, status } = response;
      expect(data).toEqual(
        expect.objectContaining({
          _id: expect.any(String),
          email: expect.any(String),
          
        })
      );
      expect(status).toBe(200);
    });
    test("GET LOGIN USER DETAIL", async () => {
      const response = await axios.get(`/api/v1/home/get-user`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "text/plain",
        },
      });
      const { data, status } = response;
      expect(data).toEqual(
        expect.objectContaining({
          _id: expect.any(String),
          email: expect.any(String),
        })
      );
      expect(status).toBe(200);
    });
    test("GET FOLLOWINGS", async () => {
      const response = await axios.get(`/api/v1/home/get-followings`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "text/plain",
        },
      });
      const { data, status } = response;
      expect(Array.isArray(data)).toBeTruthy();
      expect(status).toBe(200);
    });
    test("GET FOLLOWERS", async () => {
      const response = await axios.get(`/api/v1/home/get-followers`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "text/plain",
        },
      });
      const { data, status } = response;
      expect(Array.isArray(data)).toBeTruthy();
      expect(status).toBe(200);
    });
})