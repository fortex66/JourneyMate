const tPost = require('../models/uploadModel');
const tPostImage = require ('../models/uploadModel');
const cPost = require('../models/uploadModel');

const getlist = async (req, res) => {
  try {
    const { page = 1, per_page = 10 } = req.query;

    const posts = await tPost.tPost.findAndCountAll({
      offset: per_page * (page - 1),
      limit: per_page,
      order: [
        ['postDate', 'DESC']
      ],
      include: [{model: tPost.tPostImage, as: "post_images",},],
    });
    const total_pages = Math.ceil(posts.count / per_page);
 

    res.status(200).json({ posts, total_pages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "게시글 조회에 실패하였습니다" });
  }
};

const getpost = async (req, res) => {
  try {
    const post = await tPost.tPost.findOne({ where: { tpostID: req.params.tpostID }
    ,include: [{
        model: tPost.tPostImage, as:"post_images",
    }] });
    res.status(200).json({ post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

const getclist = async (req, res) => {
  try {
    const { page = 1, per_page = 10 } = req.query;

    const posts = await cPost.cPost.findAndCountAll({
      offset: per_page * (page - 1),
      limit: per_page,
      order: [
        ['postDate', 'DESC']
      ],
      include: [{model: cPost.cPostImage, as: "post_images",},],
    });
    const total_pages = Math.ceil(posts.count / per_page);
 

    res.status(200).json({ posts, total_pages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "동행인 게시글 조회에 실패하였습니다" });
  }
};

const getcpost = async (req, res) => {
  try {
    const post = await cPost.cPost.findOne({ where: { cpostID: req.params.cpostID }
    ,include: [{
        model: cPost.cPostImage, as:"post_images",
    }] });
    
    res.status(200).json({ post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};



module.exports = {
    getlist, getpost, getclist, getcpost
};
