const tUpload = require('../models/uploadModel');
const cUpload = require('../models/uploadModel');
const jwt = require("jsonwebtoken");
const path=require('path');

async function uploadpost(req, res) {
  if (!req.files) {
    return res.status(400).send({message: "No files uploaded"}); // 저장 폴더가 없을 시 에러
}

try {
    const user=req.decode; // 유저 토큰의 정보 저장
    const jsonData = JSON.parse(req.body.jsonData);
    // 요청 데이터로 받은 게시물 정보를 travel_post 테이블에 저장
    const posting=await tUpload.tPost.create({
      userID: user.userID,
      postDate: new Date(),
      location: jsonData.location,
      title: jsonData.title
    });
    const tpostID = posting.getDataValue('tpostID'); // 위에서 저장한 게시물의 tpostID를 받아옴
    console.log(tpostID);
    // 게시물 이미지를 저장
    const imageSavePromises = req.files.map((file, index) => {
      const imageUrl = path.join(file.destination, file.filename);
      return tUpload.tPostImage.create({
        imageURL: imageUrl,
        tpostID: tpostID,
        content: req.body.contents[index]
      });
    });
  
    await Promise.all(imageSavePromises);
    res.status(200).send({ message: "Posts saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error saving posts" });
  }

}
// JWT 토큰으로 검증을 완료한 사용자의 게시물을 삭제하는 메서드
async function deletepost(req, res) {
  let param=req.params.tpostid;

    try {
      const result=await tUpload.tPost.destroy({ where: { tpostID: param/*, userID:req.body.userID */} }); // postID 파라메터와 같은 게시물 삭제
      console.log(result);
      res.status(200).json({ message: '게시물이 정상적으로 삭제되었습니다.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '게시물 삭제 오류!' });
    }
  }

// 사용자 검증 통과후 게시물 수정하는 메서드
async function updatePost(req, res) {
    try { 
      const user=req.decode.userID;
      const { tpostID } = req.params;
      const existedPost = await tUpload.tPost.findOne({ where: {tpostID: tpostID} }); // DB에서 postId가 같은 데이터 찾기
      console.log(existedPost.userID);

      if (user !== existedPost.userID) {
        // 로그인 정보와 게시글 작성자가 같은지 확인
        res.json({
          result: false,
          message: "사용자가 작성한 게시글이 아닙니다.",
        });
      } 
      else {
        // 게시물 내용은 그냥 업데이트
        await tUpload.tPost.update({
          title: req.body.title,
          location: req.body.location
        },{
          where: {tpostID: tpostID}
        });
        await tUpload.tPostImage.destroy({ where: { tpostID: tpostID/*, userID:req.body.userID */} }); // 기존 게시물의 사진을 삭제

        //게시물 사진 다시 저장
        for (const [index, file] of req.files.entries()) {
          const imageUrl = path.join(file.destination, file.filename);
          await tUpload.tPostImage.create(
            {
              imageURL: imageUrl,
              content: req.body.contents[index],
              tpostID: tpostID
            }
            
          );
          console.log(index);
        }
        
       
        res.status(200).json({ result: true, message: "게시글 수정 완료" });
      }
    
    } catch (err) {
      console.log(err);
      res.status(400).json({ result: false });
    }
 
}

//동행인 관련 게시글 기능
async function companionUploadpost(req, res) {
  if (!req.files) {
    return res.status(400).send({message: "No files uploaded"}); // 저장 폴더가 없을 시 에러
}

try {
    const user=req.decode; // 유저 토큰의 정보 저장
    // 요청 데이터로 받은 게시물 정보를 travel_post 테이블에 저장
    await cUpload.cPost.create({
      cpostID: req.body.cpostID,  
      userID: user.userID,
      postDate: new Date(),
      startDate : req.body.startDate,
      finishDate : req.body.finishDate,
      location: req.body.location,
      age : req.body.age,
      pgender : req.body.pgender,
      content : req.body.content,
      personnel : req.body.personnel,
      title: req.body.title
    });
    // 게시물 이미지를 저장
    req.files.forEach(async (file, index) => {
      const imageUrl = path.join(file.destination, file.filename);
      await cUpload.cPostImage.create({
        imageURL: imageUrl,
        cpostID: req.body.cpostID
      });
      
      }
    )
    
    res.status(200).send({ message: "cPosts saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error saving cposts" });
  }

}
// JWT 토큰으로 검증을 완료한 사용자의 게시물을 삭제하는 메서드
async function companionDeletepost(req, res) {
  let param=req.params.cpostid;

    try {
      const result=await cUpload.cPost.destroy({ where: { cpostID: param/*, userID:req.body.userID */} }); // postID 파라메터와 같은 게시물 삭제
      console.log(result);
      res.status(200).json({ message: '동행인 게시물이 정상적으로 삭제되었습니다.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '동행인 게시물 삭제 오류!' });
    }
  }

// 사용자 검증 통과후 게시물 수정하는 메서드
async function companionUpdatePost(req, res) {
    try { 
      const user=req.decode.userID;
      const { cpostID } = req.params;
      const existedPost = await cUpload.cPost.findOne({ where: {cpostID: cpostID} }); // DB에서 postId가 같은 데이터 찾기
      console.log(existedPost.userID);

      if (user !== existedPost.userID) {
        // 로그인 정보와 게시글 작성자가 같은지 확인
        res.json({
          result: false,
          message: "사용자가 작성한 게시글이 아닙니다.",
        });
      } 
      else {
        // 게시물 내용은 그냥 업데이트
        await cUpload.cPost.update({
          title: req.body.title,
          location: req.body.location
        },{
          where: {cpostID: cpostID}
        });
        await cUpload.cPostImage.destroy({ where: { cpostID: cpostID/*, userID:req.body.userID */} }); // 기존 게시물의 사진을 삭제

        //게시물 사진 다시 저장
        for (const [index, file] of req.files.entries()) {
          const imageUrl = path.join(file.destination, file.filename);
          await cUpload.cPostImage.create(
            {
              imageURL: imageUrl,
              cpostID: cpostID
            }
            
          );
          console.log(index);
        }
        
       
        res.status(200).json({ result: true, message: "동행인 게시글 수정 완료" });
      }
    
    } catch (err) {
      console.log(err);
      res.status(400).json({ result: false });
    }
 
}


module.exports = { uploadpost, deletepost, updatePost,companionUploadpost,companionDeletepost,companionUpdatePost };