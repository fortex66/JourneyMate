const tComment = require('../models/commentModel');

//커뮤니티 댓글 작성
async function addComment(req, res) {
  const { tcommentId, userId, contents, tpostID } = req.body;
  try {
    const comment = await tComment.create({ tcommentId, userId, contents, tpostID });
    res.status(200).json(comment);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: '댓글을 작성하는 동안 오류가 발생하였습니다.' });
  }
}
//커뮤니티 댓글 삭제
async function deleteComment(req, res) {
  const { tcommentId } = req.body; //사용자 ID를 인증 받지 않은 코드입니다. 추후에 수정하겠습니다.

  try {
    const comment = await tComment.destroy({ where: { tcommentId: tcommentId } });
    res.status(200).json({ message: '댓글이 정상적으로 삭제되었습니다.' });
  } catch (error) {
    res.status(500).json({ message: '댓글을 삭제하는 동안 오류가 발생하였습니다.' });
  }
}


//동행인 댓글 작성
async function companionAddComment(req, res) {
  const { ccommentId, userId, contents, cpostID } = req.body;
  try {
    const comment = await cComment.create({ ccommentId, userId, contents, cpostID });
    res.status(200).json(comment);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: '동행인 댓글을 작성하는 동안 오류가 발생하였습니다.' });
  }
}
//커뮤니티 댓글 삭제
async function companionDeleteComment(req, res) {
  const { ccommentId } = req.body; //사용자 ID를 인증 받지 않은 코드입니다. 추후에 수정하겠습니다.

  try {
    const comment = await cComment.destroy({ where: { ccommentId: ccommentId } });
    res.status(200).json({ message: '동행인 댓글이 정상적으로 삭제되었습니다.' });
  } catch (error) {
    res.status(500).json({ message: '동행인 댓글을 삭제하는 동안 오류가 발생하였습니다.' });
  }
}

module.exports = { addComment, deleteComment,companionAddComment,companionDeleteComment };
