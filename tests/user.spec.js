const axios = require("../axiosTest");
const shortid = require("shortid");
let testUserId;
let userId
let username

describe("TEST OF USER", () => {
    test("SIGNUP NEW USER", async () => {
        username = shortid.generate();
        let email = `${username}@test.com`;
        const response = await axios.post("/api/v1/home/signup", {
          email: email,
          password: "12345",
          confirmPassword: "12345",
        });
        const {data,status} = response;
        userId = data.user._id;
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
      testUserId = data.user._id;
      axios.defaults.headers.common["Authorization"] = data.idToken;
      expect(data).toEqual(
        expect.objectContaining({
          idToken: expect.any(String),
        })
      );
      expect(status).toBe(200);
    });
    test("GET USER DETAIL",async () => {
        const response = await axios.get(`/api/v1/home/user/${testUserId}`);
        const {data,status} = response;
        expect(data).toEqual(
          expect.objectContaining({
            user: expect.any(Object),
          })
        );
        expect(status).toBe(200);
    })
    test("GET MASH USER DETAIL", async () => {
      const response = await axios.get(
        `/api/v1/home/mash-user-details/${username}`
      );
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
      const response = await axios.get(`/api/v1/home/get-user`);
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
      const response = await axios.get(`/api/v1/home/get-followings`);
      const { data, status } = response;
      expect(Array.isArray(data)).toBeTruthy();
      expect(status).toBe(200);
    });
    test("GET FOLLOWERS", async () => {
      const response = await axios.get(`/api/v1/home/get-followers`);
      const { data, status } = response;
      expect(Array.isArray(data)).toBeTruthy();
      expect(status).toBe(200);
    });
    test("FOLLOW USER",async () => {
      const response = await axios.put(
        `/api/v1/home/user/follow`,
        {
          followId: userId,
        }
      );
      const { data, status } = response;
      expect(data).toEqual(
        expect.objectContaining({
          _id: expect.any(String),
          email: expect.any(String),
        })
      );
      expect(status).toBe(201);
    });
    test("UNFOLLOW USER", async () => {
      const response = await axios.put(
        `/api/v1/home/user/unfollow`,
        { unfollowId: userId }
      );
      const { data, status } = response;
      expect(data).toEqual(
        expect.objectContaining({
          _id: expect.any(String),
          email: expect.any(String),
        })
      );
      expect(status).toBe(201);
    });
    test("UPDATE USER INFO", async () => {
      const newUserName = shortid.generate();
      const response = await axios.put(`/api/v1/home/update-user-details`, {
        userName: newUserName,
        genre: "This is test genre",
        bio: "This is test Bio",
        fullName: "This is test Fullname",
      });
      const { data, status } = response;
      expect(data).toEqual(
        expect.objectContaining({
          _id: expect.any(String),
          email: expect.any(String),
        })
      );
      expect(status).toBe(201);
    });
})