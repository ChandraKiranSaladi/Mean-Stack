const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const mongoURI = 'mongodb://localhost:27017/Online-Auction';

const postRouter = require('./routes/posts');

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
  res.setHeader("Access-Control-Allow-Methods", "GET,PUT,POST,PATCH,DELETE,OPTIONS");
  next();
})

app.use('/api/posts',postRouter);
module.exports = app;
