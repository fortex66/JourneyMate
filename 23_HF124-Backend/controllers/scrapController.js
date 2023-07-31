const scrapModel = require("../models/scrapModel");
const tPost = require("../models/uploadModel");
const jwt = require("jsonwebtoken");

const getScrapList = async (req, res) => {
  try {
    // 페이지 번호, 페이지 별 게시물 수 query parameter로 전달 가능
    const user = req.decode;
    const { page = 1, itemscount = 10 } = req.query;
    const offset = (page - 1) * itemscount;

    const scrapedPosts = await tPost.tPost.findAll({
      include: [
        {
          model: User,
          as: "scrapedBy",
          where: { userID: user.userID },
        },
      ],
      order: [[Scrap, "scrapID", "DESC"]],
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
    const existing = await scrapModel.scraps.findOne({
      where: {
        userID: user.userID,
        tpostID: postID,
      },
    });

    if (existing) {
      await scrapModel.scraps.destroy({
        where: {
          userID: user.userID,
          tpostID: postID,
        },
      });
      return res
        .status(200)
        .json({ message: "게시물 스크랩이 취소되었습니다." });
    } else {
      await scrapModel.scraps.create({
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
    const Scrap = await scrapModel.scraps.findOne({
      where: {
        userID: user.userID,
        tpostID: postID,
      },
    });

    res.json({ isScrap: !!Scrap });
    console.log("체크스크랩백:");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while processing the request." });
  }
};

module.exports = { getScrapList, toggleScrap, checkScrapStatus };