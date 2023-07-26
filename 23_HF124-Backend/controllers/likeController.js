//likeController.js
const jwt = require('jsonwebtoken');
const LikeModel = require('../models/likeModel');
const tPost = require('../models/uploadModel').tPost;  // tPost 모델을 가져옵니다.

const { Sequelize, DataTypes, Model } = require('sequelize');

const sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USERNAME, process.env.MYSQL_PASSWORD, {
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  dialect: 'mysql',
});


exports.onLike = async (req, res) => {
  const postID = req.body.tpostID;
  try {
    const user = req.decode;
    let like = await LikeModel.findOne({
      where: {
        userID: user.userID,
        tpostID: postID
      }
    });

    const post = await tPost.findByPk(postID);  // 게시글을 조회합니다.
    if (!like) {
      like = await LikeModel.create({
        userID: user.userID,
        tpostID: postID
      });
      message = '좋아요';
    } else {
      await LikeModel.destroy({
        where: {
          userID: user.userID,
          tpostID: postID
        }
      });
      message = '좋아요 취소';
    }

    // postlikes 테이블에서 해당 게시글의 좋아요 수를 계산합니다.
    const [result] = await sequelize.query(
      `SELECT COUNT(*) as count 
       FROM postlikes 
       WHERE tpostID = :tpostID`,
      { 
        replacements: { tpostID: postID }, 
        type: sequelize.QueryTypes.SELECT 
      }
    );
    const likeCount = result.count;

    // 게시글의 좋아요 수를 업데이트합니다.
    post.likeCount = likeCount;
    await post.save();

    res.status(200).json({ message: message, like, totalLikes: likeCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '요청을 처리하는 동안 오류가 발생하였습니다.' });
  }
};


exports.checkLikeStatus = async (req, res) => {
  const postID = req.query.tpostID;
  const user = req.decode;
  try {
    const like = await LikeModel.findOne({
      where: {
        userID: user.userID,
        tpostID: postID,
      },
    });

    res.json({ isLiked: !!like });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while processing the request.' });
  }
};

exports.getLikeCount = async (req, res) => {
  const postID = req.query.tpostID;
  try {
    const post = await tPost.findByPk(postID);
    res.json({ likeCount: post.likeCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while processing the request.' });
  }
};


module.exports = exports;
