const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const Post = require('./models/post');
const mongoose = require('mongoose');
const mongoURI = 'mongodb://localhost:27017/Online-Auction';
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());


mongoose.connect(mongoURI, {
    useNewUrlParser: true
  })
  .then(() => {
    console.log("Connected to database at 27017");
  })
  .catch(() => {
    console.log("Connection failed");
  });


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
  next();
})

app.post('/api/posts', (req, res, next) => {

  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });

  post.save()
    .then((result) => {
      console.log("post save result" + result);
      res.status(201).json({
        messsage: "post successful",
        // postId: result._id
      });
      next();
    });

});

app.get('/api/posts', (req, res, next) => {
  Post.find()
    .then((document) => {
      res.status(200).json({
        "messsage": "message send successful",
        "posts": document
      });
    })
    .catch(() => {
      console.log("get error");
    });

});
module.exports = app;
