const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const Post = require('./models/post');

const app = express();

mongoose.connect("mongodb+srv://khan:TTM8Yc58HN0Ejz33@cluster0.iflcl.mongodb.net/node-angular?retryWrites=true&w=majority")
  .then(() => {
    console.log("working");
  })
  .catch(() => {
    console.log("Connection Failed!");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false} ));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  next();
});
// app.use((req, res, next) => {
//   console.log("First Middleware");
//   next();
// });

app.post('/api/posts', (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  }); // req.body;
  // console.log(post);
  post.save().then(createdPosts => {
    res.status(201).json({
      message: "Post added successfully",
      postId: createdPosts._id
    });
  });
});

app.get('/api/posts', (req, res, next) => {
  // const posts = [
  //   {id:'temp0', title: "first", content: "one"},
  //   {id:'temp1', title: "second", content: "two"}
  // ];
  Post.find().then(documents => {
    res.status(200).json({
      message: "Posts fetched successfully!",
      posts: documents
    });
  });
});

app.get('/api/posts/:id', (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if(post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({message: "Post Not Found!"});
    }
  });
});

app.put("/api/posts/:id", (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  });
  Post.updateOne({_id: req.params.id}, post).then(result => {
    console.log(result);
    res.status(200).json({message: "Update Successful!"});
  });
});

app.delete('/api/posts/:id', (req, res, next) => {
  Post.deleteOne( {_id: req.params.id} ).then(result => {
    console.log(result);
    res.status(200).json( {message: "Post Deleted!"} );
  });
});

module.exports = app;
