const axios = require("../../axiosTest");

module.exports = async () => {
  const response = await axios.post("/api/v1/home/post", {
    email: "mrankur801@gmail.com",
    password: "12345",
  });

  const { data } = response;

  return data.user._id;
};
