const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var _ = require('lodash');
const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://ps:Test123@cluster0.aqy0o.mongodb.net/<dbname>?retryWrites=true&w=majority/blogDB", {useNewUrlParser: true, useUnifiedTopology: true});

const postSchema = new mongoose.Schema({
  title : String,
  body : String
});

const Post = mongoose.model('Post', postSchema);

const homeStartingContent = "Hi! I'm Pooja Sharma. It's a simple Daily Journal Application.";
const aboutContent = "My name is Pooja Sharma.I was born and raised in Chandigarh. I have completed my graduation in 2019 from Chitkara University, Rajpura. Currently I work as a Software Developer in Temenos(Kony). I have worked in many banking projects, mainly on mobile apps. The technology we use is Javascript and Java. Currently i've started working on nodeJs, reactJs to enhance my skills. It is one of the projects I build as a practice."
const contactContent = "Let's get in touch. You can send me email on poojavillis@gmail.com";

const app = express();


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res) {
  Post.find({}, function(err, posts) {
    if(err) {
      console.log(err);
    } else {
      res.render("home", {homeStartingContent: homeStartingContent, posts: posts});
    }
  });
});

app.get("/about", function(req, res) {
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res) {
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res) {
  res.render("compose");
});

app.post("/compose", function(req, res) {
  var blogTitle = req.body.postTitle;
  var blogBody = req.body.postBody;
  var post = new Post({
    title : blogTitle,
    body : blogBody
  });
  post.save();
  res.redirect("/")
})

app.get("/post/:postid", function(req, res) {
  let page = req.params.postid;

  Post.findOne({_id:page}, function(err,post) {
    res.render("post", {
      title: post.title,
      body: post.body
    });
  });
})

let port = process.env.PORT;
if(port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started");
});
