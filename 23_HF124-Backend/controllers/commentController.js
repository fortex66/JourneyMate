//commentController.js
const tComment = require("../models/commentModel");
const cComment = require("../models/ccommentModel");
const userProfile = require("../models/signupModel");
const { Sequelize } = require("sequelize");
const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_USERNAME,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    dialect: "mysql",
  }
);

// 커뮤니티 댓글 가져오기
async function getComments(req, res) {
  const tpostId = req.params.tpostID; // URL에서 게시글 ID 가져옴
  try {
    const comments = await tComment.tComment.findAll({
      where: { tpostID: tpostId },
      include:[{
        model: userProfile.User,
        attributes: ["profileImage"],
      }]
    });
    await updateCommentCounts(tpostId);
    console.log(comments)

    res.status(200).json(comments);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "댓글을 가져오는 동안 오류가 발생하였습니다." });
  }
}

//커뮤니티 댓글 작성
async function addComment(req, res) {
  const tpostId = req.params.tpostID; // URL에서 가져옴
  try {
    const comment = await tComment.tComment.create({
      tcommentId: req.body.tcommentId,
      userID: req.decode.userID,
      contents: req.body.contents,
      tpostID: tpostId,
      commentDate: new Date(),
    });

    await updateCommentCounts(tpostId);
    const commentID=comment.getDataValue("tcommentId");
    const comments=await tComment.tComment.findOne({
      where:{tcommentId: commentID},
      include:[
        {
          model: userProfile.User,
          attributes:["profileImage"]
        }
      ]
    })

    res.status(200).json(comments);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "댓글을 작성하는 동안 오류가 발생하였습니다." });
  }
}

//커뮤니티 댓글 삭제
// commentController.js
async function deleteComment(req, res) {
  const tcommentId = req.body.tcommentId;
  const tpostId = req.params.tpostID; // 이 줄을 추가
  // const userID = req.body.userID; // 요청 본문에서 userID를 가져오는 대신 인증 미들웨어에서 설정한 값을 사용합니다.

  try {
    // 댓글을 찾아서 가져옵니다.
    const comment = await tComment.tComment.findOne({
      where: { tcommentId: tcommentId },
    });

    // 댓글이 없거나 사용자 ID가 일치하지 않는 경우 오류를 반환합니다.
    if (!comment || comment.userID !== req.decode.userID) {
      // req.decode.userID를 사용해 요청을 보낸 사용자와 댓글 작성자를 비교합니다.
      return res.status(403).json({
        message: "You do not have permission to delete this comment.",
      });
    }

    // 댓글을 삭제합니다.
    await tComment.tComment.destroy({ where: { tcommentId: tcommentId } });
    await updateCommentCounts(tpostId);
    res.status(200).json({ message: "댓글이 정상적으로 삭제되었습니다." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "댓글을 삭제하는 동안 오류가 발생하였습니다." });
  }
}
//동행인 댓글 삭제
async function companionDeleteComment(req, res) {
  const ccommentID = req.body.ccommentID;

  try {
    // 댓글을 찾아서 가져옵니다.
    const comment = await cComment.cComment.findOne({
      where: { ccommentID: ccommentID },
    });

    // 댓글이 없거나 사용자 ID가 일치하지 않는 경우 오류를 반환합니다.
    if (!comment || comment.userID !== req.decode.userID) {
      // req.decode.userID를 사용해 요청을 보낸 사용자와 댓글 작성자를 비교합니다.
      return res.status(403).json({
        message: "You do not have permission to delete this comment.",
      });
    }

    // 댓글을 삭제합니다.
    await cComment.cComment.destroy({ where: { ccommentID: ccommentID } });

    res.status(200).json({ message: "댓글이 정상적으로 삭제되었습니다." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "댓글을 삭제하는 동안 오류가 발생하였습니다." });
  }
}
// 동행인 댓글 가져오기
async function companionGetComments(req, res) {
  const cpostID = req.params.cpostID; // URL에서 게시글 ID 가져옴
  try {
    const comments = await cComment.cComment.findAll({
      where: { cpostID: cpostID },
      include:[{
        model: userProfile.User,
        attributes: ["profileImage"],
      }]
    });
    res.status(200).json(comments);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "댓글을 가져오는 동안 오류가 발생하였습니다." });
  }
}

//동행인 댓글 작성
async function companionAddComment(req, res) {
  const cpostId = req.params.cpostID; // URL에서 가져옴
  try {
    const comment = await cComment.cComment.create({
      ccommentID: req.body.ccommentID,
      userID: req.decode.userID,
      contents: req.body.contents,
      cpostID: cpostId,
      commentDate: new Date(),
    });
    const commentId=await comment.getDataValue("ccommentID");

    const comments = await cComment.cComment.findOne({
      where:{ccommentID: commentId},
      include:[
        {
          model: userProfile.User,
          attributes:["profileImage"]
        }
      ]
    })
    res.status(200).json(comments);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "댓글을 작성하는 동안 오류가 발생하였습니다." });
  }
}

async function updateCommentCounts(tpostID) {
  let result = 0;
  try {
    // tcomments 테이블에서 게시글의 댓글 수를 계산합니다.
    const commentCount = await sequelize.query(
      `SELECT COUNT(*) as count 
      FROM tcomments 
      WHERE tpostID = :tpostID`,
      {
        replacements: { tpostID: tpostID },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    // 게시글의 댓글 수를 travel_posts 테이블에 업데이트합니다.
    await sequelize.query(
      `UPDATE travel_posts SET commentCount = :count WHERE tpostID = :tpostID`,
      {
        replacements: { count: commentCount[0].count, tpostID },
        type: sequelize.QueryTypes.UPDATE,
      }
    );

    result = commentCount[0].count;
  } catch (error) {
    console.error(error);
  }

  return result;
}

async function updateCCommentCounts(cpostID) {
  let result = 0;
  try {
    // tcomments 테이블에서 게시글의 댓글 수를 계산합니다.
    const commentCount = await sequelize.query(
      `SELECT COUNT(*) as count 
      FROM ccomments 
      WHERE cpostID = :cpostID`,
      {
        replacements: { cpostID: cpostID },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    // 게시글의 댓글 수를 companion posts 테이블에 업데이트합니다.
    await sequelize.query(
      `UPDATE \`companion posts\` SET commentCount = :count WHERE cpostID = :cpostID`,
      {
        replacements: { count: commentCount[0].count, cpostID },
        type: sequelize.QueryTypes.UPDATE,
      }
    );

    result = commentCount[0].count;
  } catch (error) {
    console.error(error);
  }

  return result;
}

module.exports = {
  updateCCommentCounts,
  addComment,
  deleteComment,
  getComments,
  companionAddComment,
  companionDeleteComment,
  companionGetComments,
  updateCommentCounts,
};