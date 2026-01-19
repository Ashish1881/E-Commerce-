const validator = require("validator");
const bcrypt = require("bcrypt");

const validateRegisterData = (req) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name is Required");
  } else if (!validator.isEmail(email)) {
    throw new Error("Please Enter valide Email Address");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please Enter Strong Password");
  }
};

module.exports = {
  validateRegisterData,
};
