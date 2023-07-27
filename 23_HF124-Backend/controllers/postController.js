const tPost = require('../models/uploadModel');
const cPost = require('../models/uploadModel');
const Tag = require('../models/uploadModel');
const { Op } = require('sequelize');

const getlist = async (req, res) => {
  try {
    const { page = 1, per_page = 10, sort = 'latest' } = req.query;
	
    let order;
    switch (sort) {
      case 'dueDate':
        order = [['finishDate', 'DESC']];
        break;
      case 'latest': 
      default:
        order = [['postDate', 'DESC']];
    }
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


const getSearchlist = async (req, res) => {
  try {
    const { page = 1, per_page = 10, sort = 'latest', tags, location } = req.query;

    let order;
    switch (sort) {
      case 'dueDate':
        order = [['finishDate', 'DESC']];
        break;
      case 'latest': 
      default:
        order = [['postDate', 'DESC']];
    }

    // location 검색 조건
    const locationCondition = location ? { location: { [Op.like]: `%${location}%` } } : {};

    // 먼저 location을 기반으로 게시물 찾기
    let posts = await tPost.tPost.findAndCountAll({
      where: locationCondition,
      include: [
        {
          model: tPost.tPostImage, 
          as: "post_images",
        },
        {
          model: Tag.Tag,
          as: 'tags',
          through: {
            model: Tag.TTagging,
            attributes: [],
          },
          required: false
        },
      ],
      order: order,
      offset: per_page * (page - 1),
      limit: per_page,
    });

    // tag를 배열로 변환
    let tagList = tags ? tags.split(",") : null;

    // tag가 제공된 경우, tag를 기반으로 게시물을 필터링
    if (tagList) {
      posts.rows = posts.rows.filter(post =>
        post.tags.some(tag => tagList.includes(tag.content))
      );
    }

    const total_pages = Math.ceil(posts.count / per_page);
 
    res.status(200).json({ posts: posts.rows, total_pages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "게시글 조회에 실패하였습니다" });
  }
};



const getpost = async (req, res) => {
  try {
    const post = await tPost.tPost.findOne({
      where: { tpostID: req.params.tpostID },
      include: [
        {
          model: tPost.tPostImage,
          as:"post_images",
        },
        {
          model: Tag.Tag,
          as: "tags",  
        },
      ],
    });
    res.status(200).json({ post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

const getclist = async (req, res) => {
  try {
    const { page = 1, per_page = 10, sort = 'latest' } = req.query;

    let order;
    switch (sort) {
      case 'dueDate':
        order = [['finishDate', 'DESC']];
        break;
      case 'latest': 
      default:
        order = [['postDate', 'DESC']];
    }

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
    ,include: [
      {
        model: cPost.cPostImage, 
        as:"post_images",
       },
     {
      model: Tag.Tag,
      as: "tags",  
     },
    ] });

    res.status(200).json({ post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};



module.exports = {
    getlist, getpost, getclist, getcpost,getSearchlist
};
