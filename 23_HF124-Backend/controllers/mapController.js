const tPost = require("../models/uploadModel");
const { Op } = require("sequelize");

const mapGetlist = async (req, res) => {
  try {
    const date = new Date();
    date.setDate(date.getDate() - 60); // 특정 날짜보다 오래된 날짜는 출력하지 않는 기능 ex) 7로 설정시 일주일간의 데이터만 보여줌

    const posts = await tPost.tPost.findAndCountAll({
      where: {
        postDate: {
          [Op.gte]: date, // postDate가 date보다 크거나 같은 게시글만 조회
        },
      },
      order: [["postDate", "DESC"]],
      include: [{ model: tPost.tPostImage, as: "post_images" }],
    });
    const total_pages = posts.count;

    res.status(200).json({ posts, total_pages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "게시글 조회에 실패하였습니다" });
  }
};

const mapGetclist = async (req, res) => {
  try {
    const date = new Date();
    date.setDate(date.getDate() - 7); // 특정 날짜보다 오래된 날짜는 출력하지 않는 기능 ex) 7로 설정시 일주일간의 데이터만 보여줌

    const posts = await tPost.cPost.findAndCountAll({
      where: {
        postDate: {
          [Op.gte]: date, // postDate가 date보다 크거나 같은 게시글만 조회
        },
      },
      order: [["postDate", "DESC"]],
      include: [{ model: tPost.cPostImage, as: "post_images" }],
    });
    console.log(posts);
    const total_pages = posts.count;

    res.status(200).json({ posts, total_pages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "게시글 조회에 실패하였습니다" });
  }
};

module.exports = {
  mapGetlist,
  mapGetclist,
};
