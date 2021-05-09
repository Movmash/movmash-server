const axios = require("../../axiosTest");
const shortid = require("shortid");
// let id;
exports.getUser = async () => {
    const response = await axios.post("/api/v1/home/login", {
      email: "test@test.com",
      password: "12345",
    });
    id = shortid.generate();
    const {data} = response;
    return {token: data.idToken, username: data.user.userName, userId: data.user._id, newUserName:id};
}

// exports.getNewUserName = () => id;