const router = require("express").Router();
const User = require("../models/Users");
const bcrypt = require("bcrypt");

// Register

router.post("/register", async (req, res) => {
  try {
    // generate secure password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // create new user
    const newUser = new User({
      username: req.body.username,
      userHandle: req.body.userHandle,
      email: req.body.email,
      password: hashedPassword,
      profilePicture: req.body.profilePicture,
      coverPicture: req.body.coverPicture,
      followers: req.body.followers,
      following: req.body.following,
      isAdmin: req.body.isAdmin,
      desc: req.body.desc,
      location: req.body.location,
      joined: req.body.joined,
    });

    // save new user respond
    const user = await newUser.save();
    res.json(user);
  } catch (err) {
    console.log(err);
  }
});

// Login

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    !user && res.json("User not found");

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    !validPassword && res.json("Wrong password");

    res.json(user);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
