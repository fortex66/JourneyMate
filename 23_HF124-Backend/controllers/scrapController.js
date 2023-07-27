const scrapModel = require('../models/scrapModel');
const postModel = require('../models/uploadModel');

const getScrapList = async (req, res) => {
  try {
    // 페이지 번호, 페이지 별 게시물 수 query parameter로 전달 가능
    const { userID } = req.params; 
    const { page = 1, itemscount = 10 } = req.query;
    const offset = (page - 1) * itemscount;

    const scrapedPosts = await postModel.findAll({
      include: [{
        model: User,
        as: 'scrapedBy',
        where: { userID: userID },
      }],
      order: [
        [Scrap, 'scrapID', 'DESC'], 
      ],
      limit: itemscount,
      offset: offset,
    });
    return res.status(200).json({ data: scrapedPosts });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: '스크랩한 게시물을 가져오는데 실패했습니다.' });
  }
};


const toggleScrap = async (req, res) => {
    const { userID, tpostID } = req.body;
    try {
      const existing = await scrapModel.findOne({
        where: {
          userID,
          tpostID,
        },
      });
      if (existing) {
        await scrapModel.destroy({
          where: {
            userID,
            tpostID,
          },
        });
        return res.status(200).json({ message: '게시물 스크랩이 취소되었습니다.' });

      } else {
        await scrapModel.create({
          userID,
          tpostID,
        });
        return res.status(201).json({ message: '게시물이 성공적으로 스크랩되었습니다.' });
      }

    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: '요청 처리에 실패하였습니다.' });
    }
  };

module.exports = { getScrapList, toggleScrap }