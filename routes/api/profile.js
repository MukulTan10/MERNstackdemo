const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const profileModel = require("../../models/Profile");
const userModel = require("../../models/User");
const { check, validationResult } = require("express-validator");
const got = require("got");
const config = require("config");

//@route GET api/profile/me
// @desc get current user profile
// @access Private
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await profileModel
      .findOne({
        user: req.user.id,
      })
      .populate("user", ["name", "avatar"]); //populate from,fields
    if (!profile) {
      return res.status(400).json({ msg: "There is no profile for this user" });
    }
    res.json(profile);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

//@route POST api/profile/createOrEdit
// @desc create or update user profile
// @access Private
router.post(
  "/createOrEdit",
  [
    auth,
    check("status", "Status is required").not().isEmpty(),
    check("skills", "Skills is Required").not().isEmpty(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin,
      } = req.body;

      //Build Profile Object
      const profileFields = {};
      profileFields.user = req.user.id;
      if (company) profileFields.company = company;
      if (website) profileFields.website = website;
      if (location) profileFields.location = location;
      if (bio) profileFields.bio = bio;
      if (status) profileFields.status = status;
      if (githubusername) profileFields.githubusername = githubusername;
      if (skills) {
        profileFields.skills = skills.split(",").map((skill) => skill.trim());
      }

      //Build Social objectId
      profileFields.social = {}; //if not gives error can't find and not made
      if (facebook) profileFields.social.facebook = facebook;
      if (twitter) profileFields.social.twitter = twitter;
      if (instagram) profileFields.social.instagram = instagram;
      if (linkedin) profileFields.social.linkedin = linkedin;
      if (youtube) profileFields.social.youtube = youtube;

      //make profile
      let profile = await profileModel.findOne({
        user: req.user.id,
      });
      if (profile) {
        //update
        profile = await profileModel.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true } //to return document after changes applied
        );

        return res.json(profile);
      }

      //Create
      profile = new profileModel(profileFields);
      await profile.save();
      return res.json(profile);
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server Error");
    }
  }
);

//@route Get api/profile
// @desc Get all profiles
// @access Public

router.get("/", async (req, res) => {
  try {
    const profiles = await profileModel
      .find()
      .populate("user", ["name", "avatar"]);
    res.json(profiles);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

//@route Get api/profile/user/:user_id
// @desc Get profile by user_id
// @access Public
router.get("/user/:user_id", async (req, res) => {
  try {
    const profiles = await profileModel
      .findOne({ user: req.params.user_id })
      .populate("user", ["name", "avatar"]);
    if (!profiles) return res.status(400).json({ msg: "Profile not found" });
    res.json(profiles);
  } catch (err) {
    // console.log(err);//check for error object interesting
    if (err.kind == "ObjectId")
      //Star MArked
      return res.status(400).json({ msg: "Profile not found" });
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

//@route Get api/profile/delete
// @desc Delete profile,user & posts
// @access Private
router.delete("/delete", auth, async (req, res) => {
  try {
    //@todo remove usr posts

    //Remove Profile
    await profileModel.findOneAndRemove({ user: req.user.id });

    //Remove User
    await userModel.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: "User Deleted" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("server error");
  }
});

//@route PUT api/profile/experience
// @desc Add profile exprience
// @access Private
router.put(
  "/experience",
  [
    auth,
    [
      check("title", "Title is requires").not().isEmpty(),
      check("company", "Company is required").not().isEmpty(),
      check("from", "From Date is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        title,
        company,
        location,
        from,
        to,
        current,
        description,
      } = req.body;

      const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description,
      };

      const getProfile = await profileModel.findOne({ user: req.user.id });

      getProfile.experience.unshift(newExp); //unshift instead of push cause unshift will make more recents to come at first,push at start
      await getProfile.save();
      res.json(getProfile);
    } catch (err) {
      console.log(err.message);
      res.status(500).send("server error");
    }
  }
);

//@route Delete api/profile/experience/:exp_id
// @desc rEmove profile exprience
// @access Private
router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    const getProfile = await profileModel.findOne({ user: req.user.id });

    //Get Remove Index
    const removeIndex = getProfile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id); //index for matching
    getProfile.experience.splice(removeIndex, 1);
    await getProfile.save();

    res.json(getProfile);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("server error");
  }
});

//@route PUT api/profile/education
// @desc Add profile education
// @access Private
router.put(
  "/education",
  [
    auth,
    [
      check("school", "School is Required").not().isEmpty(),
      check("degree", "Degree is required").not().isEmpty(),
      check("fieldofstudy", "Field of study is required").not().isEmpty(),
      check("from", "From Date is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description,
      } = req.body;

      const newEdu = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description,
      };

      const getProfile = await profileModel.findOne({ user: req.user.id });

      getProfile.education.unshift(newEdu); //unshift instead of push cause unshift will make more recents to come at first,push at start
      await getProfile.save();
      res.json(getProfile);
    } catch (err) {
      console.log(err.message);
      res.status(500).send("server error");
    }
  }
);

//@route Delete api/profile/experience/:edu_id
// @desc rEmove profile education
// @access Private
router.delete("/education/:edu_id", auth, async (req, res) => {
  try {
    const getProfile = await profileModel.findOne({ user: req.user.id });

    //Get Remove Index
    const removeIndex = getProfile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id); //index for matching
    getProfile.education.splice(removeIndex, 1);
    await getProfile.save();

    res.json(getProfile);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("server error");
  }
});

//@route Get api/profile/github/:username
// @desc get users repos from github
// @access public
router.get("/github/:username", async (req, res) => {
  try {
    const uri = `https://api.github.com/users/${
      req.params.username
    }/repos?per_page=5&sort=created:asc&client_id=${config.get(
      "githubClientId"
    )}&client_secret=${config.get("githubSecret")}`;
    const options = {
      headers: { "user-agent": "node.js" },
      method: "GET",
      responseType: "json",
    };

    const response = await got(uri, options);
    if (!response)
      return res.status(404).json({ msg: "no Github username found" });
    res.status(200).json(JSON.parse(JSON.stringify(response.body)));
  } catch (err) {
    console.log(err.message);
    res.status(500).send("server error");
  }
});

module.exports = router;
