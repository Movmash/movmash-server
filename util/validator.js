const isEmail = (email) => {
  const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(regEx)) return true;
  else return false;
};
//helper function to check the string is equal or not

const isEmpty = (string) => {
  // console.log(string);
  if (string.trim() === "") return true;
  else return false;
};

exports.validateSignupData = (data) => {
  let errors = {};

  //validation of email
  // console.log(data);
  if (isEmpty(data.email)) {
    errors.email = "Must not be empty";
  } else if (!isEmail(data.email)) {
    errors.email = "Must be a valid email address";
  }
  //validation of password
  // console.log(data);

  if (isEmpty(data.password)) errors.password = "Must not be empty";
  if (data.password !== data.confirmPassword)
    errors.confirmPassword = "Passwords must match";
  if (isEmpty(data.userName)) errors.userName = "Must not be empty";

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};

exports.validateLoginData = (data) => {
  let errors = {};

  if (isEmpty(data.email)) errors.email = "Must not be empty";
  if (isEmpty(data.password)) errors.password = "Must not be empty";

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};

exports.reduceUserDetail = (data) => {
  let userDetails = {};
  // console.log(data);

  //   if (!isEmpty(data.bio.trim())) userDetails.bio = data.bio;
  //   if (!isEmpty(data.website.trim())) {
  //     if (data.website.trim().substring(0, 4) !== "http") {
  //       userDetails.website = `http://${data.website.trim()}`;
  //     } else userDetails.website;
  //   }
  //   if (!isEmpty(data.location.trim())) userDetails.location = data.location;

  return userDetails;
};
