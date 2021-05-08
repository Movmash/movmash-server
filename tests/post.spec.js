const axios = require("../axiosTest");
const {getUser} = require("./utilityFunctions/getloginUserData")
let username;
let reviewPostId;
let suggestMePostId;
let ticketPostId;
let commentId;
let requestedTicketId;
let userId;
beforeEach(async () => {
  const loginUserData = await getUser();
  axios.defaults.headers.common["Authorization"] = loginUserData.token;
  username = loginUserData.username;
  userId = loginUserData.userId;
});

describe("TEST OF POST", () => {
  test("POST REVIEW POST", async () => {
    const response = await axios.post("/api/v1/home/post", {
      rating: 25,
      type: "review",
      movieId: 23,
      review: "This is Test review",
      genreId: [21, 32, 12],
      moviePoster: "TestImage.jpeg",
      releaseYear: "2012",
      movieTitle: "Test Title",
      postType: "home",
    });
    const { data, status } = response;
    reviewPostId = data._id;
    expect(data).toEqual(
      expect.objectContaining({
        _id: expect.any(String),
      })
    );
    expect(status).toBe(201);
  });

  test("POST SUGGESTME POST", async () => {
    const response = await axios.post("/api/v1/home/post", {
      rating: 21,
      type: "suggestMe",
      genreName: ["Action", "Adventure"],
      language: "en",
      duration: "12m",
      postType: "home",
    });

    const { data, status } = response;
    suggestMePostId = data._id;
    expect(data).toEqual(
      expect.objectContaining({
        _id: expect.any(String),
      })
    );
    expect(status).toBe(201);
  });

  test("POST TICKET POST", async () => {
    const response = await axios.post("/api/v1/home/post", {
      type: "ticket",
      description: "This is ticket description",
      movieId: 23,
      showTimeFrom: "2020-09-29T15:21:48.828+00:00",
      showTimeTo: "2020-09-29T15:21:48.828+00:00",
      genreId: [12, 12, 23],
      moviePoster: "TestImage.png",
      releaseYear: "2012",
      movieTitle: "Test title",
      overview: "This is test overview",
      postType: "home",
    });

    const { data, status } = response;
    ticketPostId = data._id;
    expect(data).toEqual(
      expect.objectContaining({
        _id: expect.any(String),
      })
    );
    expect(status).toBe(201);
  });

  test("LIKE POST", async () => {
    const response = await axios.put("/api/v1/home/like-post", {
      postId: reviewPostId,
    });
    const { data, status } = response;
    expect(data).toEqual(
      expect.objectContaining({
        _id: expect.any(String),
      })
    );
    expect(status).toBe(201);
  });

  test("UNLIKE POST", async () => {
    const response = await axios.put("/api/v1/home/unlike-post", {
      postId: reviewPostId,
    });
    const { data, status } = response;
    expect(data).toEqual(
      expect.objectContaining({
        _id: expect.any(String),
      })
    );
    expect(status).toBe(201);
  });

  test("GET SUBSCRIBED POST", async () => {
    const response = await axios.get("/api/v1/home/getSubPost");
    const { data, status } = response;
    expect(Array.isArray(data)).toBeTruthy();
    expect(status).toBe(200);
  });

  test("GET LOGIN USER POST", async () => {
    const response = await axios.get("/api/v1/home/myPost");
    const { data, status } = response;
    expect(Array.isArray(data)).toBeTruthy();
    expect(status).toBe(200);
  });

  test("GET MASH USER POST", async () => {
    const response = await axios.get(`/api/v1/home/mash-user-post/${username}`);
    const { data, status } = response;
    expect(Array.isArray(data)).toBeTruthy();
    expect(status).toBe(200);
  });

  test("COMMENT REVIEW POST", async () => {
    const response = await axios.post("/api/v1/home/comment-post", {
      postId: reviewPostId,
      comment: "This is test comment",
      postType: "review",
    });
    const { data, status } = response;
    commentId = data.comments[0]._id;
    expect(data).toEqual(
      expect.objectContaining({
        _id: expect.any(String),
        comments: expect.any(Array),
      })
    );
    expect(status).toBe(201);
  });

  test("COMMENT SUGGESTME POST", async () => {
    const response = await axios.post("/api/v1/home/comment-post", {
      postId: suggestMePostId,
      comment: "This is test comment",
      postType: "suggestMe",
      moviePoster: "movieposter.png",
      releaseYear: "2012",
      genreId: [12, 32, 12],
      overview: "This is overview",
      movieTitle: "This is title",
      movieId: 24,
    });
    const { data, status } = response;
    expect(data).toEqual(
      expect.objectContaining({
        _id: expect.any(String),
        comments: expect.any(Array),
      })
    );
    expect(status).toBe(201);
  });

  test("LIKE COMMENT", async () => {
    const response = await axios.put("/api/v1/home/like-comment", {
      commentId: commentId,
    });
    const { data, status } = response;
    expect(data).toEqual(
      expect.objectContaining({
        _id: expect.any(String),
        likes: expect.any(Array),
        likeCount: expect.any(Number),
      })
    );
    expect(status).toBe(201);
  });

  test("UNLIKE COMMENT", async () => {
    const response = await axios.put("/api/v1/home/unlike-comment", {
      commentId: commentId,
    });
    const { data, status } = response;
    expect(data).toEqual(
      expect.objectContaining({
        _id: expect.any(String),
        likes: expect.any(Array),
        likeCount: expect.any(Number),
      })
    );
    expect(status).toBe(201);
  });

  test("GET POST COMMENT", async () => {
    const response = await axios.get("/api/v1/home/get-post-comment", {
      postId: reviewPostId,
    });
    const { data, status } = response;
    expect(Array.isArray(data)).toBeTruthy();
    expect(status).toBe(200);
  });

  test("DELETE COMMENT", async () => {
    const response = await axios.delete(
      `/api/v1/home/delete-comment/${commentId}`
    );
    const { data, status } = response;
    expect(data).toEqual(
      expect.objectContaining({
        doc: expect.any(Object),
        result: expect.any(Object),
      })
    );
    expect(status).toBe(201);
  });

  test("SEND BOOKING REQUEST", async () => {
    const response = await axios.post(
      "/api/v1/bookingTicket/send-booking-request",
      {
        postId: ticketPostId,
        postedBy: userId,
        showTimeFrom: "2020-09-29T15:21:48.828+00:00",
        showTimeTo: "2020-09-29T15:21:48.828+00:00",
      }
    );
    const { data, status } = response;
    requestedTicketId = data._id
    expect(data).toEqual(
      expect.objectContaining({
        bookingStatus: expect.any(String),
        _id: expect.any(String),
        postId: expect.any(Object),
        postedBy: expect.any(Object),
        requestedBy: expect.any(Object),
      })
    );
    expect(status).toBe(201);
  });

  test("GET REQUESTED TICKET", async () => {
    const response = await axios.get(
      "/api/v1/bookingTicket/get-requested-ticket"
    );
    const { data, status } = response;
    expect(Array.isArray(data)).toBeTruthy();
    expect(status).toBe(200);
  });

  test("MARK TICKET CONFIRM", async () => {
    const response = await axios.put(
      "/api/v1/bookingTicket/mark-ticket-confirm"
    ,{
      ticketId: requestedTicketId
    });
    const { data, status } = response;
    expect(data).toEqual(
      expect.objectContaining({
        _id: expect.any(String),
        bookingStatus: expect.any(String)
      })
    );
    expect(status).toBe(201);
  });

  test("CANCEL REQUESTED TCIKET", async () => {
    const response = await axios.delete(
      `/api/v1/bookingTicket/cancel-requested-ticket/${ticketPostId}`
    );
    const { data, status } = response;
    expect(data).toEqual(
      expect.objectContaining({
        deleted: expect.any(String),
      })
    );
    expect(status).toBe(201);
  });

  test("DELETE REVEIEW POST", async () => {
    const response = await axios.delete(
      `/api/v1/home/delete-post/${reviewPostId}`
    );
    const {data, status} = response;
    expect(data).toEqual(
      expect.objectContaining({
        _id: expect.any(String),
      })
    );
    expect(status).toBe(201);
  });

  test("DELETE SUGGESTME POST", async () => {
    const response = await axios.delete(
      `/api/v1/home/delete-post/${suggestMePostId}`
    );
    const { data, status } = response;
    expect(data).toEqual(
      expect.objectContaining({
        _id: expect.any(String),
      })
    );
    expect(status).toBe(201);
  });

  test("DELETE TICKET POST", async () => {
    const response = await axios.delete(
      `/api/v1/home/delete-post/${ticketPostId}`
    );
    const { data, status } = response;
    expect(data).toEqual(
      expect.objectContaining({
        _id: expect.any(String),
      })
    );
    expect(status).toBe(201);
  });
})