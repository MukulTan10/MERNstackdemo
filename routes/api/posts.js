const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const userModel = require("../../models/User");
const postModel = require("../../models/Posts");
const profileModel = require("../../models/Profile");

//@route POST api/posts
// @desc Create a Post
// @access Private(need token -Private  or not)
router.post(
  "/",
  [auth, [check("text", "Text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await userModel.findById(req.user.id).select("-password");

      const newPost = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };

      post = new postModel(newPost);
      await post.save();
      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

//@route Get api/posts all posts
// @desc Get all posts
//@access Private
router.get("/", auth, async (req, res) => {
  try {
    const posts = await postModel.find().sort({ date: -1 });
    if (posts.length <= 0)
      return res.status(200).json({ msg: "no post found" });
    return res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route  api/posts  posts by id
// @desc Get  posts by id
//@access Private
router.get("/:id", auth, async (req, res) => {
  try {
    const posts = await postModel.findById(req.params.id);
    if (!posts) return res.status(404).json({ msg: "no post found" });

    return res.json(posts);
  } catch (err) {
    if (err.kind === "ObjectId")
      return res.status(404).json({ msg: "no post found" });

    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route api/posts  delete posts by id
// @desc Delete  posts by id
//@access Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const posts = await postModel.findById(req.params.id);

    if (!posts) return res.status(404).json({ msg: "no post found" });
    //check user cause user can delete its post
    if (posts.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User Not Authorized" });
    }

    await posts.remove();

    return res.json({ msg: "Post Deleted" });
  } catch (err) {
    if (err.kind === "ObjectId")
      return res.status(404).json({ msg: "no post found" });

    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route PUT api/posts update likes
// @desc Put  Like a Post
//@access Private
router.put("/like/:id", auth, async (req, res) => {
  try {
    const post = await postModel.findById(req.params.id);

    if (!post) return res.status(404).json({ msg: "no post found" });

    //Check if post is already been liked
    if (
      post.like.filter((like) => like.user.toString() == req.user.id).length > 0
    )
      return res.status(400).json({ msg: "Post already Liked" });

    post.like.unshift({ user: req.user.id });
    await post.save();

    return res.json(post.like); //cause increasing value in front-end

    return res.json({ msg: "Post Deleted" });
  } catch (err) {
    if (err.kind === "ObjectId")
      return res.status(404).json({ msg: "no post found" });

    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route PUT api/posts reverse like
// @desc Put  UnLike a Post
//@access Private
router.put("/unlike/:id", auth, async (req, res) => {
  try {
    const post = await postModel.findById(req.params.id);

    if (!post) return res.status(404).json({ msg: "no post found" });

    //Check if post is  even liked
    if (
      post.like.filter((like) => like.user.toString() == req.user.id).length ==
      0
    )
      return res.status(400).json({ msg: "Can't unlike a post without like" });

    //remove Index
    const removeIndex = post.like
      .map((like) => like.user.toString())
      .indexOf(req.user.id);

    post.like.splice(removeIndex, 1);
    await post.save();

    return res.json(post.like); //cause increasing value in front-end

    // return res.json({ msg: "Post Deleted" });
  } catch (err) {
    if (err.kind === "ObjectId")
      return res.status(404).json({ msg: "no post found" });

    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route PUT api/posts/comment/:post_id Add Comment
// @desc Put  Add Comment to a Post
//@access Private
router.put(
  "/comment/:post_id",
  [auth, [check("text", "Text is required").not().isEmpty()]],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const user = await userModel.findById(req.user.id);
      const post = await postModel.findById(req.params.post_id);

      if (!post) return res.status(404).json({ msg: "no post found" });

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };

      //Add Comment
      post.comments.unshift(newComment);
      post.save();

      return res.json(post.comments);
    } catch (err) {
      if (err.kind === "ObjectId")
        return res.status(404).json({ msg: "no post found" });

      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

//@route PUT api/posts/comment/:post_id/:comment_id Delete Comment
// @desc Put  Add Comment to a Post
//@access Private
router.delete("/comment/:post_id/:comment_id", auth, async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);
    const post = await postModel.findById(req.params.post_id);

    if (!post) return res.status(404).json({ msg: "no post found" });

    //Pull out comment
    const comment = post.comments.find(
      (comment) => comment.id.toString() == req.params.comment_id
    );

    //Make sre comment Exist
    if (!comment) return res.status(404).json({ msg: "Comment Not Found" });

    //Check User who is deleteing comments
    if (comment.user.toString() !== req.user.id)
      return res.status(404).json({ msg: "User not authorized" });

    //Get Index to Remove
    const removeIndex = post.comments
      .map((comment) => comment.user.toString())
      .indexOf(req.user.id);

    post.comments.splice(removeIndex, 1);
    await post.save();

    return res.json(post.comments);
  } catch (err) {
    if (err.kind === "ObjectId")
      return res.status(404).json({ msg: "no post found" });

    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
