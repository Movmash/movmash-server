const axios = require("../../axiosTest");

module.exports = async () => {
 const responseOne = await axios.post("/api/v1/home/login", {
   email: "test@gmail.com",
   password: "12345",
 });

 const { data, status } = responseOne;
 if (status === 200) {
   return data.idToken;
 } else {
   const responseTwo = await axios.post("/api/v1/home/signup", {
     email: "test@gmail.com",
     password: "12345",
     confirmPassword: "12345",
   });

   return responseTwo.data.idToken;
 }
};
