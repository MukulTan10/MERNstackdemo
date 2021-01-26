const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const UserModel = require("../../models/User");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

//@route GET api/users
// @desc Test Route
// @access Public(need token -Private  or not)
router.get("/", (req, res) => res.send("User Route"));

//@route GET api/users
// @desc Register User
// @access Public
router.post(
  "/register",
  [
    check("name", "Name is Required").not().isEmpty(), // check (to be checked,custom error), not() if exist , if nexist and not empty
    check("email", "Please include a Valid Email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      //See if user exist
      let user = await UserModel.findOne({ email });
      if (user) {
        return res
          .status(200)
          .json({ errors: [{ msg: "User Already Exist" }] });
      }
      // get users grvatar
      const avatar = gravatar.url(email, {
        s: "200", //size
        r: "pg", //ratings pg no naked
        d: "mm", //mystery man (or default pic)
      });
      //Encrypt password
      user = new UserModel({ name, email, avatar, password }); //just create instance not save it

      const salt = await bcrypt.genSalt(10); //rounds (more it is more secure and recommended in doc),
      user.password = await bcrypt.hash(password, salt);

      await user.save(); //return promise

      //Return json web token (in front end if user register we want them logged in right away)
      const payload = {
        user: {
          id: user.id, //mongoose abstarction so can use id
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) {
            throw err;
          }
          return res.status(200).json({ token });
        }
      ); //seconds , in production but for testiing adding more zeros
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server Error");
    }

    // res.send("User  Registered");
  }
);

module.exports = router;
