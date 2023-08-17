const Post = require("../models/uploadModel");
const user = require("../models/signupModel");
const path = require("path");
const getCommunityList = async (req, res) => {
  try {
    const { page = 1, per_page = 10 } = req.query;
    console.log(req.decode);
    const posts = await Post.tPost.findAndCountAll({
      where: {
        userID: req.decode.userID,
      },
      order: [["postDate", "DESC"]],
      include: [{ model: Post.tPostImage, as: "post_images" }],
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
        userID: req.decode.userID,
      },
      //   offset: per_page * (page - 1),
      //   limit: per_page,
      order: [["postDate", "DESC"]],
      include: [{ model: Post.cPostImage, as: "post_images" }],
    });
    const total_post = posts.count;

    res.status(200).json({ posts, total_post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "동행인 게시글 조회에 실패하였습니다" });
  }
};
const getProfile = async (req, res) => {
  try {
    const profile = await user.User.findAll({
      where: {
        userID: req.decode.userID,
      },
    });
    console.log(profile);
    const userTag = await user.UserTagging.findAll({
      where: {
        userID: req.decode.userID,
      },
    });
    console.log(userTag);
    res.status(200).json({ profile, userTag });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "유저 정보 조회에 실패했습니다." });
  }
};

const getUserProfile = async (req, res) => {
  const userID = req.params.userId;

  try {
    const profile = await user.User.findOne({
      attributes: ["userID", "profileImage"],
      where: {
        userID: userID,
      },
    });
    console.log(profile);
    res.status(200).json({ profile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "유저 정보 조회에 실패했습니다." });
  }
};

const getUserCommunityList = async (req, res) => {
  const userID = req.params.userId;
  try {
    //const { page = 1, per_page = 10 } = req.query;
    const posts = await Post.tPost.findAndCountAll({
      where: {
        userID: userID,
      },
      order: [["postDate", "DESC"]],
      include: [{ model: Post.tPostImage, as: "post_images" }],
    });
    const total_post = posts.count;

    res.status(200).json({ posts, total_post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "커뮤니티 게시글 조회에 실패하였습니다" });
  }
};

const getUserCompanionList = async (req, res) => {
  const userID = req.params.userId;
  try {
    // const { page = 1, per_page = 10 } = req.query;
    // console.log(req.decode);
    const posts = await Post.cPost.findAndCountAll({
      where: {
        userID: userID,
      },
      //   offset: per_page * (page - 1),
      //   limit: per_page,
      order: [["postDate", "DESC"]],
      include: [{ model: Post.cPostImage, as: "post_images" }],
    });
    const total_post = posts.count;

    res.status(200).json({ posts, total_post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "동행인 게시글 조회에 실패하였습니다" });
  }
};
const updatePassword = async (req, res) => {
  try {
    await user.User.update(
      {
        password: req.body.password,
      },
      { where: { userID: req.decode.userID } }
    );

    res
      .status(200)
      .json({ result: true, message: "비밀번호 변경에 성공하였습니다" });
  } catch (err) {
    res
      .status(500)
      .json({ resutl: false, message: "비밀번호 변경에 실패하였습니다." });
  }
};

const updateUser = async (req, res) => {
  console.log("도착완료");
  try {
    const userProfile = await user.User.findOne({
      where: { userID: req.decode.userID },
    });
    //const userTaggingProfile=await user.UserTagging.findAndCountAll({where: {userID: req.decode.userID}});
    const tags = req.body.tags;

    await userProfile.update({
      user: req.body.user,
      region: req.body.address,
      email: req.body.email,
    });
    console.log(req.body.address);
    await user.UserTagging.destroy({ where: { userID: req.decode.userID } });
    for (const tagName of tags) {
      const userTag = await user.UserTagging.create({
        userID: req.decode.userID,
        tagName: tagName,
      });
      console.log(userTag);
    }
    res.status(200).json({ message: "update success" });
  } catch (err) {
    console.error(err);
  }
};

const logout = async (req, res) => {
  return res.clearCookie("token").end();
};

const setProfileImage = async (req, res) => {
  if (!req.files) {
    return res.status(400).send({ message: "No files uploaded" });
  }

  try {
    const userID = req.decode.userID;

    // 이미지를 저장합니다.
    const imageSavePromises = req.files.map((file, index) => {
      const imageUrl = path.join(file.destination, file.filename);
      return user.User.update(
        {
          profileImage: imageUrl,
        },
        { where: { userID: userID } }
      );
    });

    await Promise.all(imageSavePromises);

    res.status(200).send({ message: "Profile Image save" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error saving posts" });
  }
};

module.exports = {
  getCommunityList,
  getCompanionList,
  updatePassword,
  getProfile,
  updateUser,
  logout,
  setProfileImage,
  getUserProfile,
  getUserCommunityList,
  getUserCompanionList,
};
