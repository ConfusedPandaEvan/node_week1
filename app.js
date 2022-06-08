const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const TextPost = require("./modules/textpost.js");
const Comment = require("./modules/comment.js");

mongoose.connect("mongodb://localhost/textpost-demo", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

const app = express();
const router = express.Router();

//check connections
router.get("/", (req, res) => {
    
    res.send("Helloooo!");
  });

//get posts based on order
router.get("/textpost", async (req, res) => {
    const textpost = await TextPost.find().sort("createdTime").exec();
    //have textpost showing recent ones first
    textpost.reverse();

    res.send({ textpost });
});

//create post
router.post("/textpost", async (req, res) => {
  const { title, value, writer } = req.body;

  const textpost = new TextPost({ title, value, writer });
  
  textpost.createdTime = new Date();
  
  await textpost.save();

  res.send({ textpost });
});

//delete post
router.delete("/textpost/:postId", async (req, res) => {
  const { postId } = req.params;

  const textpost = await TextPost.findById(postId).exec();
  await textpost.delete();

  res.send({});
});

//change post
router.patch("/textpost/:postId", async (req, res) => {
  const { postId } = req.params;
  const { title, value, writer } = req.body;

  const textpost = await TextPost.findById(postId).exec();

  if (title) {
    textpost.title = title;
  } 
  if (value) {
    textpost.value = value;
  } 
  if (writer) {
    textpost.writer = writer;
  }
  await textpost.save();
  res.send({});
});

//get specific post with comments
router.get("/textpost/:postId", async (req, res) => {
  const { postId } = req.params;
  
  const textpost = await TextPost.findById(postId).exec();

  const comment = await Comment.find({ postId }).sort("createdTime").exec();
  //have comments showing recent ones first
  comment.reverse();

  res.send({ textpost, comment });
});

//create comment
router.post("/textpost/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const { value } = req.body;

    if (value == false) {
      return res.status(400).send("You cannot send empty comment!");
    };

    const comment = new Comment({ postId, value });

    comment.createdTime = new Date();

    await comment.save();

    res.send({ comment });
  } catch (err) {
    return res.status(400).send("You cannot send empty comment!");
  }
});

//delete comment
router.delete("/textpost/:postId/:commentId", async (req, res) =>{
  const { commentId } = req.params;
  
  const comment = await Comment.findById(commentId).exec();
  await comment.delete();

  res.send();

});

//change comment
router.patch("/textpost/:postId/:commentId", async (req, res) => {
  const { commentId } = req.params;
  const { value } = req.body;

  if (value == false) {    
    return res.status(400).send("You cannot send empty comment!");
  };

  const comment = await Comment.findById(commentId).exec();

  console.log(comment, value);

  comment.value = value;

  await comment.save();

  res.send({});
});

const requestMiddleware = (req, res, next) => {
  console.log("Request URL:", req.originalUrl, " - ", new Date());
  next();
};

app.use(requestMiddleware);

app.use("/api", bodyParser.json(), router);
app.use(express.urlencoded());

app.listen(80, () => {
  console.log("Server is On Babeee!");
});