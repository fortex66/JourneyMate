const tPost = require("../models/uploadModel");
const jwt = require("jsonwebtoken");

const getScrapList = async (req, res) => {
  try {
    // 페이지 번호, 페이지 별 게시물 수 query parameter로 전달 가능
    const { page = 1, itemscount = 10 } = req.query;
    const offset = (page - 1) * itemscount;
    const scrapedPosts = await tPost.tPost.findAll({
      include: [
        {
          model: tPost.scraps,
          where: { userID: req.decode.userID },
        },
        {
          model: tPost.tPostImage,
          as: "post_images",
        },
      ],
      order: [["tpostID", "DESC"]],
      limit: itemscount,
      offset: offset,
    });
    return res.status(200).json({ data: scrapedPosts });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "스크랩한 게시물을 가져오는데 실패했습니다." });
  }
};

const toggleScrap = async (req, res) => {
  const postID = req.body.tpostID;
  try {
    const user = req.decode;
    const existing = await tPost.scraps.findOne({
      where: {
        userID: user.userID,
        tpostID: postID,
      },
    });

    if (existing) {
      await tPost.scraps.destroy({
        where: {
          userID: user.userID,
          tpostID: postID,
        },
      });
      return res
        .status(200)
        .json({ message: "게시물 스크랩이 취소되었습니다." });
    } else {
      await tPost.scraps.create({
        userID: user.userID,
        tpostID: postID,
      });
      return res
        .status(201)
        .json({ message: "게시물이 성공적으로 스크랩되었습니다." });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "요청 처리에 실패하였습니다." });
  }
};

const checkScrapStatus = async (req, res) => {
  const postID = req.query.tpostID;
  const user = req.decode;
  try {
    const Scrap = await tPost.scraps.findOne({
      where: {
        userID: user.userID,
        tpostID: postID,
      },
    });

    res.json({ isScrap: !!Scrap });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while processing the request." });
  }
};

module.exports = { getScrapList, toggleScrap, checkScrapStatus };
