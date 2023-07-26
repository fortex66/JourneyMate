const Post = require('../models/uploadModel');
const user=require('../models/userModel');

const getCommunityList = async (req, res) => {
  try {
    const { page = 1, per_page = 10 } = req.query;
    // console.log(req.decode);
    const posts = await Post.tPost.findAndCountAll({
      where: {
        userID: req.decode.userID
      },
    //   offset: per_page * (page - 1),
    //   limit: per_page,
      order: [
        ['postDate', 'DESC']
      ],
      include: [{model: Post.tPostImage, as: "post_images",},],
    });
    const total_post = posts.count;
 

    res.status(200).json({ posts, total_post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "커뮤니티 게시글 조회에 실패하였습니다" });
  }
};
const getCompanionList = async (req, res) => {
    try {
      const { page = 1, per_page = 10 } = req.query;
      // console.log(req.decode);
      const posts = await Post.cPost.findAndCountAll({
        where: {
          userID: req.decode.userID
        },
      //   offset: per_page * (page - 1),
      //   limit: per_page,
        order: [
          ['postDate', 'DESC']
        ],
        include: [{model: Post.cPostImage, as: "post_images",},],
      });
      const total_post = posts.count;
   
  
      res.status(200).json({ posts, total_post });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "동행인 게시글 조회에 실패하였습니다" });
    }
  };
// const getProfile = async (req, res)=>{
//     try{
        
//     }
// };

module.exports = {
    getCommunityList, getCompanionList
};