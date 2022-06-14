const mongoose = require("mongoose");

const TweetsSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      max: 280,
    },
    img: {
      type: String,
    },
    likes: {
      type: Array,
      default: [],
    },
    retweets: {
      type: Array,
      default: [],
    },
    reply: {
      type: String,
      max: 280,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tweets", TweetsSchema);
