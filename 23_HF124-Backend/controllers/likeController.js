//likeController.js
const LikeModel = require('../models/likeModel');

exports.onLike = async (req, res) => {
  const { userId, postId } = req.body;
  try {
    let like = await LikeModel.findOne({
      where: {
        userId: userId,
        tpostId: postId
      }
    });
    if (!like) {
      like = await LikeModel.create({
        userId: userId,
        tpostId: postId
      });
      // 게시글의 총 좋아요수 계산
      const likeCount = await LikeModel.count({
        where: {
          tpostId: postId
        }
      });
      res.status(201).json({ message: '좋아요', like, totalLikes: likeCount });
    } else {
      await LikeModel.destroy({
        where: {
          userId: userId,
          tpostId: postId
        }
      });
      // 좋아요 취소 후 총 좋아요수 재계산
      const likeCount = await LikeModel.count({
        where: {
          tpostId: postId
        }
      });
      res.status(200).json({ message: '좋아요 취소', like, totalLikes: likeCount });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '요청을 처리하는 동안 오류가 발생하였습니다.' });
  }
};

module.exports = exports;