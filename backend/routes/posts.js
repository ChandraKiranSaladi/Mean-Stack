const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const multer = require('multer');

const MIME_TYPE_MAP = {
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/jpeg': 'jpg'

};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("invalid mime type");
    if(isValid){
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null,name+'-'+Date.now()+'.' +ext);
  }
});


router.post('', multer({storage: storage}).single("image"),(req, res, next) => {
  const url = req.protocol + '://'+req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url+"/images/"+ req.file.filename
  });

  post.save()
    .then((result) => {
      console.log("post save result" + result);
      res.status(201).json({
        messsage: "post successful",
        post: { ...result, id: result._id}
      });
      next();
    });

});

router.get('', (req, res, next) => {
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

router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id)
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({
          message: 'Post not found'
        });
      }
    })
})

router.delete('/:id', (req, res, next) => {
  Post.delete({
      _id: req.params.id
    })
    .then(result => {
      console.log(result);
      res.status(200).json({
        message: "Post deleted"
      })
    })
})

router.put('/:id', (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  });
  console.log("title:" + req.body.title);
  console.log("content:" + req.body.content);

  console.log("param.id" + req.params.id);
  console.log("body.id" + req.body.id);
  Post.updateOne({
      _id: req.params.id
    }, post)
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: "Update Success"
      });
    })
    .catch((err) => {
      console.log("err in updateOne " + err);
    })
})
module.exports = router;
