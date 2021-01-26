const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const UserModel = require("../../models/User");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcryptjs");

//@route GET api/auth
// @desc get auth user
// @access Public(need token -Private  or not)
router.get("/", auth, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).select("-password"); //req.user comes from middleware
    res.json(user);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

//@route GET api/auth
// @desc Login User/Authenticate  User and get Token
// @access Public
router.post(
  "/login",
  [
    check("email", "Please include a Valid Email").isEmail(),
    check("password", "Password is Required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      //See if user exist
      let user = await UserModel.findOne({ email });
      if (!user) {
        return res
          .status(200)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      //Match Encrypt password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(200)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

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
  }
);

module.exports = router;
