const express = require('express');

const app = express();

app.use((req,res,next) => {
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader("Access-Control-Allow-Headers","Origin,X-Requested-With,Content-Type,Accept");
  res.setHeader("Access-Control-Set-Methdods","GET,POST,PATCH,DELETE,OPTIONS");
  next();
})
app.use('/api/posts', (req, res, error) => {
  const posts = [{
    "id" : "231rqfwf",
    "title" : "first server side post",
    "content": "first content"
    },
    {
    "id" : "wefw234",
    "title" : "second server side post",
    "content": "second  content"
    },
  ]
  res.status(200).json({
    "messsage": "message send successful",
    "posts" : posts
  });
});
module.exports = app;
