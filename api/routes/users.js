const router = require("express").Router();
const User = require("../models/Users");
const bcrypt = require("bcrypt");
const { findById } = require("../models/Users");

// Update User
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isadmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        return res.json(err);
      }
    }
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.json("Account updated");
    } catch (err) {
      return res.json(err);
    }
  } else {
    return res.json("You can update only your account");
  }
});

// Delete User

router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isadmin) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      return res.json("Account deleted");
    } catch (err) {
      res.json(err);
    }
  } else {
    return res.json("You only delete your account");
  }
});

// Get User

router.get("/", async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;
  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });
    const { password, updatedAt, ...other } = user._doc;
    res.json(other);
  } catch (err) {
    res.json(err);
  }
});

// Get Following

router.get("/following/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const friends = await Promise.all(
      user.following.map((friendId) => {
        return User.findById(friendId);
      })
    );
    res.json(friends);
  } catch (err) {
    res.json(err);
  }
});

// Get Followers

router.get("/followers/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const follower = await Promise.all(
      user.followers.map((followerId) => {
        return User.findById(followerId);
      })
    );
    res.json(follower);
  } catch (err) {
    res.json(err);
  }
});

// Follow User

router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { following: req.params.id } });
        res.json("user followed");
      } else {
        res.json("you already follow this user");
      }
    } catch (err) {
      res.json(err);
    }
  } else {
    res.json("You cannot follow yourself");
  }
});

// Unfollow User

router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { following: req.params.id } });
        res.json("user unfollowed");
      } else {
        res.json("you unfollowed this user");
      }
    } catch (err) {
      res.json(err);
    }
  } else {
    res.json("You cannot unfollow yourself");
  }
});

module.exports = router;
