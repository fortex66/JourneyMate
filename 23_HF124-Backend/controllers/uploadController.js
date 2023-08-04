const tUpload = require('../models/uploadModel');
const cUpload = require('../models/uploadModel');
const path=require('path');
const comment = require('../models/commentModel');
const ccomment = require('../models/ccommentModel');
const LikeModel = require('../models/likeModel');
const axios = require('axios'); // HTTP 통신을 위한 라이브러리
const { Tag, TTagging, CTagging } = require('../models/uploadModel');
const { Sequelize, DataTypes, Model } = require('sequelize');

const sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USERNAME, process.env.MYSQL_PASSWORD, {
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  dialect: 'mysql',
});

async function uploadpost(req, res) {
  if (!req.files) {
    return res.status(400).send({message: "No files uploaded"});
  }

  try {
    const user=req.decode;
    const jsonData = JSON.parse(req.body.jsonData);
    const tags = jsonData.tags;
    // const tags=req.body.tags;
    let savedTags = [];
    // 게시물을 생성하고 생성된 게시물의 정보를 가져옵니다.
    const posting = await tUpload.tPost.create({
      userID: user.userID,
      postDate: new Date(),
      location: jsonData.location,
      title: jsonData.title,
      x : jsonData.x,
      y : jsonData.y,
      address_name: jsonData.address_name
    });

    // 생성된 게시물의 ID를 가져옵니다.
    const tpostID = posting.getDataValue('tpostID');

    // 이미지를 저장합니다.
    const imageSavePromises = req.files.map((file, index) => {
      const imageUrl = path.join(file.destination, file.filename);
      return tUpload.tPostImage.create({
        imageURL: imageUrl,
        tpostID: tpostID,
        content: req.body.contents[index]
      });
    });
  
    await Promise.all(imageSavePromises);
    
    // 태그 저장 로직 추가
    for (const tagName of tags) {
      const [tag, created] = await Tag.findOrCreate({
        where: { content: tagName },
        defaults: { content: tagName }
      });

      const tagging = await TTagging.create({
        tpostID: tpostID,
        tagID: tag.tagID,
      });

      savedTags.push(tag);
    }

    res.status(200).send({ message: "Posts saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error saving posts" });
  }
}

// JWT 토큰으로 검증을 완료한 사용자의 게시물을 삭제하는 메서드
async function deletepost(req, res) {
  let param=req.params.tpostid;
    const result=await tUpload.tPost.findOne({ where: { tpostID: param} }); // postID 파라메터와 같은 게시물 찾기
      try {
        await tUpload.tPost.destroy({ where: { tpostID: param} }); // postID 파라메터와 같은 게시물 찾기
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
      const tags = JSON.parse(req.body.tags);
      const user=req.decode.userID;
      const { tpostID } = req.params;
      const existedPost = await tUpload.tPost.findOne({ where: {tpostID: tpostID} }); // DB에서 postId가 같은 데이터 찾기

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
        console.log(tags);
        // await tUpload.tPostImage.destroy({ where: { tpostID: tpostID/*, userID:req.body.userID */} }); // 기존 게시물의 사진을 삭제 
        
        const currentArray = await tUpload.TTagging.findAll({ where: { tpostID: tpostID } });
        console.log(currentArray);
        const toDelete = currentArray.filter(x => !tags.includes(x));
        const toAdd = tags.filter(x => !currentArray.includes(x));
        console.log(toDelete);
        console.log(toAdd);

        
        await TTagging.destroy({ where: { tpostID: tpostID } }); // id는 실제로 사용되는 키로 대체해야합니다.
        
        for (const tagName of toAdd) {
          
          const [tag, created] = await Tag.findOrCreate({
            where: { content: tagName },
            defaults: { content: tagName }
          });
    
          const tagging = await TTagging.create({
            tpostID: tpostID,
            tagID: tag.tagID
          });
    
          // savedTags.push(tag);
        }
        const imageIDArray=await tUpload.tPostImage.findAll({
          attributes:['imageId'],
          where: { tpostID: tpostID }
        });

        // console.log(imageIDArray[0].dataValues.imageId);

        const updatePromises = req.body.contents.map((content, index) => {
          console.log(imageIDArray[index].dataValues.imageId);
          return tUpload.tPostImage.update(
            { content: content },
            { where: { tpostID: tpostID,imageId: imageIDArray[index].dataValues.imageId } }
          );
          
        });
        res.status(200).json({ result: true, message: "게시글 수정 완료" });
      };
      
      }catch (err) {
      console.log(err);
      res.status(400).json({ result: false });
    }
  }
async function deleteImage(req,res) {
  const number=req.query.number;
  const tpostID= req.query.tpostID;
  console.log(tpostID);
  try{
    const imageArray=await tUpload.tPostImage.findAll({
      attributes: ['imageId'],
      where: {tpostID: tpostID}
    })
    console.log(number);
    console.log(imageArray);
    const temp=imageArray[number];
    console.log('----------');
    console.log(imageArray[number]); 

    const deleteImageID=temp.dataValues.imageId;
    
    const image=await tUpload.tPostImage.destroy({
    where: { imageID: deleteImageID }
    });
    if(image==1){
      res.status(200).json({result: true, message: '사진 삭제 완료'});
    }else{
      res.status(404).json({result: false, message: '사진 삭제 중 오류 발생'});
    }
   
  }catch(err){
    console.error(err);
    res.status(500).json({result: false, message: '이미지 삭제 실패'});
  }
  
}

async function updateImage(req,res){
  const jsonData = JSON.parse(req.body.jsonData);
  const number=jsonData.number;
  const tpostID=jsonData.tpostID;

  try{
    const imageArray=await tUpload.tPostImage.findAll({
    attributes:['imageUrl'],
    where: { tpostID: tpostID }
  });
    const existedURL=imageArray[number].dataValues.imageUrl;
    const imageSavePromises = req.files.map(async (file, index) => {
      const Url = path.join(file.destination, file.filename);
      const posting = await tUpload.tPostImage.update({
        imageURL: Url},{
        where:{tpostID: tpostID, imageUrl: existedURL}
      });

      if(imageSavePromises){
        res.status(200).json({result: true, message:'업데이트 성공'});
      }else{
        res.status(404).json({result: false, message: '업데이트 중 문제 발생'});
      }
    });
  }catch(err){
    console.error(err);
    res.status(500).json({result: false, message: '이미지 삭제 실패'});
  }
}

async function newImage(req,res){
  const jsonData = JSON.parse(req.body.jsonData);
  try{
    const imageSavePromises = req.files.map(async (file, index) => {
    const imageUrl = path.join(file.destination, file.filename);
    const posting = await tUpload.tPostImage.create({
      imageURL: imageUrl,
      tpostID: jsonData.tpostID
    });
    const imageID = posting.getDataValue('imageID');
    console.log(posting);
    console.log(imageID);
    if(posting){
      res.status(200).json({imageID: imageID, message: '이미지 업로드 성공'});
    }else{
      res.status(404).json({imageID: null, message: '이미지 업로드에 문제가 발생했습니다.'});
    }
    
    
  });
  }catch(err){
    console.error(err);
    res.status(500).json({imageID: null,message:'이미지 업로드 실패'});
  }
  
  
}
//동행인 관련 게시글 기능
async function companionUploadpost(req, res) {
  if (!req.files) {
    return res.status(400).send({message: "No files uploaded"});
  }

  try {
    const user=req.decode;
    const jsonData = JSON.parse(req.body.jsonData);
    const tags = jsonData.tags;
    let savedTags = [];
    // 게시물을 생성하고 생성된 게시물의 정보를 가져옵니다.
    const posting = await cUpload.cPost.create({
      userID: user.userID,
      postDate: new Date(),
      startDate: jsonData.startDate,
      finishDate: jsonData.finishDate,
      location: jsonData.location,
      age: jsonData.age,
      pgender: jsonData.pgender,
      content: jsonData.content,
      personnel: jsonData.personnel,
      title: jsonData.title,
    });

    // 생성된 게시물의 ID를 가져옵니다.
    const cpostID = posting.getDataValue('cpostID');

    // 이미지를 저장합니다.
    const imageSavePromises = req.files.map(async (file) => {
      const imageUrl = path.join(file.destination, file.filename);
      await cUpload.cPostImage.create({
        imageURL: imageUrl,
        cpostID: cpostID
      });
    });

    await Promise.all(imageSavePromises);
    
     // 태그 저장 로직 추가
     for (const tagName of tags) {
      const [tag, created] = await Tag.findOrCreate({
        where: { content: tagName },
        defaults: { content: tagName }
      });

      const ctagging = await CTagging.create({
        cpostID: cpostID,
        tagID: tag.tagID,
      });

      savedTags.push(tag);
    }

    res.status(200).send({ message: "cPosts saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error saving cposts" });
  }
}

// JWT 토큰으로 검증을 완료한 사용자의 게시물을 삭제하는 메서드
async function companionDeletepost(req, res) {
  let param=req.params.cpostID;
  const result=await cUpload.cPost.findOne({ where: { cpostID: param} }); // postID 파라메터와 같은 게시물 찾기
  if(result.userID!==req.decode.userID){
    res.json({
      result: false,
      message: "삭제 권한이 없거나 존재하지 않는 게시물입니다."
    });
  } else{
    try {
      await CTagging.destroy({where:{cpostID: param}});
      await ccomment.cComment.destroy({where:{cpostID:param}});
      await cUpload.cPostImage.destroy({where:{cpostID: param}});
      await cUpload.cPost.destroy({ where: { cpostID: param} }); // postID 파라메터와 같은 게시물 찾기
      console.log(result);
      res.status(200).json({ message: '동행인 게시물이 정상적으로 삭제되었습니다.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '동행인 게시물 삭제 오류!' });
    }
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
          location: req.body.location,
          startDate: req.body.startDate,
          finishDate: req.body.finishDate,
          pgender: req.body.pgender,
          age: req.body.age,
          personnel: req.body.personnel,
          content: req.body.content,
        },{
          where: {cpostID: cpostID}
        });

        if(!req.files){
          return
        }else{
          for (const [index, file] of req.files.entries()) {
            const imageUrl = path.join(file.destination, file.filename);
            await cUpload.cPostImage.update(
              {
                imageURL: imageUrl
              },{
                where: {cpostID: cpostID}
              }
            );
          }
        }
        res.status(200).json({ result: true, message: "동행인 게시글 수정 완료" });
      }
    
    } catch (err) {
      console.log(err);
      res.status(400).json({ result: false });
    }
 
}

async function searchKeyword(req, res)  {
  try {
    const query = req.query.query;

    const headers = {
      Authorization: `KakaoAK ${process.env.KAKAO_API_KEY}`,
    };

    const response = await axios.get(
      `https://dapi.kakao.com/v2/local/search/keyword.json`,
      { params: { query }, headers }
    );

    // 각 장소의 이름, 위도, 경도, 주소를 포함한 객체를 반환
    res.json(response.data.documents.map((document) => ({
      place_name: document.place_name,
      x: document.x,
      y: document.y,
      address_name: document.address_name,
    })));
  } catch (error) {
    console.error(error);
    res.status(500).send('주소 검색에서 문제가 발생했습니다.');
  }
};


module.exports = { uploadpost,deletepost,companionUploadpost,companionDeletepost,companionUpdatePost,searchKeyword,deleteImage,updateImage,updatePost,newImage };
