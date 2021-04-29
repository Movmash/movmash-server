const axios = require("../../axiosTest");

module.exports = async () => {
    const response = await axios.post("/api/v1/home/login", {
      email: "test@test.com",
      password: "12345",
    });

    const {data} = response;

    return data.idToken;
}