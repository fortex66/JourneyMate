const tPost = require('../models/uploadModel');
const cPost = require('../models/uploadModel');
const Tag = require('../models/uploadModel');
const { Op } = require('sequelize');
const { Sequelize} = require('sequelize');

const sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USERNAME, process.env.MYSQL_PASSWORD, {
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  dialect: 'mysql',
});

const getlist = async (req, res) => { //커뮤니티 게시글 받아오기
  try {
    const { page = 1, per_page = 10, sort = 'latest' } = req.query;
	
    let order;
    switch (sort) {
      case 'popular':
        order = [['likeCount', 'DESC']];
        break;
      case 'comments': 
        order = [['commentCount', 'DESC']];
        break;
      case 'latest':
      default:
        order = [['postDate', 'DESC']];
    }
    const posts = await tPost.tPost.findAndCountAll({
      offset: per_page * (page - 1),
      limit: per_page,
      order: order,
      include: [{model: tPost.tPostImage, as: "post_images",},],
    });
    const total_pages = Math.ceil(posts.count / per_page);
    res.status(200).json({ posts, total_pages });
    console.log(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "게시글 조회에 실패하였습니다" });
  }
};

// 주변 위치 조회 API
const getNearbylist = async (req, res) => {
  try {
    const { page = 1, per_page = 10, sort = 'latest', x, y, radius } = req.query;

    let order;
    switch (sort) {
      case 'popular':
        order = [['likeCount', 'DESC']];
        break;
      case 'latest':
      default:
        order = [['postDate', 'DESC']];
    }

    // Use the Haversine formula in the where clause to get posts within the specified radius
    const posts = await tPost.tPost.findAndCountAll({
      offset: per_page * (page - 1),
      limit: per_page,
      order: order,
      where: sequelize.literal(`(6371 * acos(cos(radians(${y})) * cos(radians(y)) * cos(radians(x) - radians(${y})) + sin(radians(${x})) * sin(radians(y)))) < ${radius}`),
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
    console.log(req.query);

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
 
    res.status(200).json({ posts, total_pages });  // 수정된 부분
    console.log(posts);
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
      order: order,
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

const getCSearchlist = async (req, res) => {
  try {
    const { page = 1, per_page = 10, sort = 'latest', tags, location, pgender, age, startDate, finishDate } = req.query;
    console.log(req.query);
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
    const genderCondition = pgender ? { pgender: { [Op.eq]: pgender } } : {};
    const ageCondition = age ? { age: { [Op.like]: `%${age}%` } } : {};
    const startDateCondition = startDate ? { startDate: { [Op.gte]: startDate } } : {};
    const endDateCondition = finishDate ? { finishDate: { [Op.lte]: finishDate } } : {};

    // 먼저 location을 기반으로 게시물 찾기
    let posts = await cPost.cPost.findAndCountAll({
      where: { ...locationCondition, ...genderCondition, ...ageCondition, ...startDateCondition, ...endDateCondition },
      include: [
        {
          model: cPost.cPostImage, 
          as: "post_images",
        },
        {
          model: Tag.Tag,
          as: 'tags',
          through: {
            model: Tag.CTagging,
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
 
    res.status(200).json({ posts, total_pages });
    console.log(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "게시글 조회에 실패하였습니다" });
  }
};






module.exports = {
    getlist, getpost, getclist, getcpost,getSearchlist,getCSearchlist,getNearbylist
};
