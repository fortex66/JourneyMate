const tPost = require('../models/uploadModel');
const cPost = require('../models/uploadModel');
const Tag = require('../models/uploadModel');

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

    // tag를 배열로 변환
    let tagList = tags ? tags.split(",") : null;
	
    const posts = await tPost.tPost.findAndCountAll({
      offset: per_page * (page - 1),
      limit: per_page,
      order: order,
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
          where: tagList ? { content: tagList } : null,
        },
      ],
      where: location ? { location: location } : null, // 게시물을 location으로 필터링
    });

    // 게시물이 모든 태그를 가지고 있는지 확인하고, 그렇지 않은 경우 필터링
    const filteredPosts = tagList
      ? posts.rows.filter(post => tagList.every(tag => post.tags.map(t => t.content).includes(tag)))
      : posts.rows;

    const total_pages = Math.ceil(filteredPosts.length / per_page);
 
    res.status(200).json({ posts: filteredPosts, total_pages });
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
          as: "tags",  // 여기에는 설정한 관계의 이름이 들어가야 합니다.
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
    getlist, getpost, getclist, getcpost,getSearchlist
};
