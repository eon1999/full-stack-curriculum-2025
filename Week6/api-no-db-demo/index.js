// install
const express = require('express')
const app = express();

require('dotenv').config();

app.use(express.json());

const tweets = [
  { id: 1, user: "Ryan", tweet: "ChatGPT" },
  { id: 2, user: "Mohammad", tweet: "Hello World!" },
];

app.get("/api/tweet/:user", (req, res) => {
    let target = tweets.find((t) => t.user == req.params.user);
    if (!target) {
        res.status(404).send("User not found");
    } else {
        res.send(target);
    }

})

const validateInput = (req, res, next) => {
    const { user, tweet } = req.body;
    if (!tweet || tweet.length > 280) {
        return res.status(400).send("Invalid tweet");
    }
}

app.post("/api/tweets", (req,res) => {
    let tweet = {
        id: tweets.length + 1,
        user: req.body.user,
        tweet: req.body.tweet
    }

    tweets.push(tweet);
    res.send(tweet);
});

app.delete("/api/tweets", (req, res) => {
  let tweetIndex = tweets.findIndex((t) => t.id == req.body.id);
  if (tweetIndex === -1) {
    res.status(404).send("Tweet not found");
  } else {
    let deletedTweet = tweets.splice(tweetIndex, 1);
    res.send(deletedTweet[0]);
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}...`));
