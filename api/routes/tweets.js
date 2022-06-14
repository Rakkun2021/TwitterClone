const router = require("express").Router();
const Tweet = require("../models/Tweets");
const User = require("../models/Users");

// Create Tweet

router.post("/", async (req, res) => {
  const newTweet = await new Tweet(req.body);
  try {
    const savedTweet = await newTweet.save();
    res.json(savedTweet);
  } catch (err) {
    res.json(err);
  }
});

// Delete Tweet

router.delete("/:id", async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id);
    if (tweet.userId === req.body.userId) {
      await tweet.deleteOne();
      res.json("Tweet Deleted");
    } else {
      res.json("you can only delete your tweets");
    }
  } catch (err) {
    res.json(err);
  }
});

// Like Tweet

router.put("/:id/like", async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id);
    if (!tweet.likes.includes(req.body.userId)) {
      await tweet.updateOne({ $push: { likes: req.body.userId } });
      res.json("Tweet Liked");
    } else {
      await tweet.updateOne({ $pull: { likes: req.body.userId } });
      res.json("tweet unliked");
    }
  } catch (err) {
    res.json(err);
  }
});

// Get Tweet

router.get("/:id", async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id);
    res.json(tweet);
  } catch (err) {
    res.json(err);
  }
});

// Retweet

router.put("/:id/retweet", async (req, res) => {
  try {
    const retweet = await Tweet.findById(req.body.userId);
    if (!retweet.retweets.includes(req.params.id)) {
      await retweet.updateOne({ $push: { retweets: req.params.id } });
      res.json("Retweeted");
    } else {
      await retweet.updateOne({ $pull: { retweets: req.params.id } });
      res.json("retweet removed");
    }
  } catch (err) {
    res.json(err);
  }
});

// Get Timeline Tweets/Retweets/Following

router.get("/timeline/:userId", async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId);
    const userTweets = await Tweet.find({ userId: currentUser._id });
    const Retweets = await Promise.all(
      currentUser.following.map((friendId) => {
        return Tweet.find({ userId: friendId });
      })
    );
    res.json(userTweets.concat(...Retweets));
  } catch (err) {
    res.json(err);
  }
});

// Get User's Tweets

router.get("/profile/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    const tweets = await Tweet.find({ userId: user._id });
    res.json(tweets);
  } catch (err) {
    res.json(err);
  }
});

module.exports = router;
