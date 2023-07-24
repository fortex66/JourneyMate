const jwt = require('jsonwebtoken');
const LikeModel = require('../models/likeModel');


exports.onLike = async (req, res) => {

  const postID = req.body.tpostID;
  try {
    const user=req.decode;
    let like = await LikeModel.findOne({
      where: {
        userID: user.userID,
        tpostID: postID
      }
    });
    if (!like) {
      like = await LikeModel.create({
        userID: user.userID,
        tpostID: postID
      });
      // 게시글의 총 좋아요수 계산
      const likeCount = await LikeModel.count({
        where: {
          tpostID: postID
        }
      });
      res.status(201).json({ message: '좋아요', like, totalLikes: likeCount });
    } else {
      await LikeModel.destroy({
        where: {
          userID: user.userID,
          tpostID: postID
        }
      });
      // 좋아요 취소 후 총 좋아요수 재계산
      const likeCount = await LikeModel.count({
        where: {
          tpostID: postID
        }
      });
      res.status(200).json({ message: '좋아요 취소', like, totalLikes: likeCount });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '요청을 처리하는 동안 오류가 발생하였습니다.' });
  }
};

exports.checkLikeStatus = async (req, res) => {
  const postID = req.query.tpostID;  // query 부분에서 postID를 가져옵니다.
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
    res.status(500).json({ error: '요청을 처리하는 동안 오류가 발생하였습니다.' });
  }
};

module.exports = exports;
