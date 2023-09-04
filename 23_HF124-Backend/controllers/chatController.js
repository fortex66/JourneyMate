const users = require("../models/userModel");
const chat = require("../models/chatModel");
const post = require("../models/uploadModel");
const { Op, Sequelize, QueryTypes } = require("sequelize");
const { sequelize } = require("../config");

//채팅방 리스트 불러오기
const getChatRoom = async (req, res) => {
  try {
    const getlist = await chat.user_chat.findAll({
      attributes: ["chatID"],
      where: { userID: req.decode.userID },
      include: [
        {
          model: chat.GroupChat,
          attributes: ["cpostID", "userCount"],
          required: true,
          include: [
            {
              model: post.cPost,
              required: true,
              attributes: [
                "title",
                "startDate",
                "finishDate",
                "personnel",
                "location",
              ],
              as: "companion_posts",
            },
          ],
        },
      ],
      order: [[chat.GroupChat, "chattime", "DESC"]],
    });

    const participatedChatIds = getlist.map((item) => item.chatID);

    const userCounts = await chat.user_chat.findAll({
      attributes: [
        "chatID",
        [Sequelize.fn("COUNT", Sequelize.col("userID")), "userCount"],
      ],
      where: {
        chatID: {
          [Sequelize.Op.in]: participatedChatIds,
        },
      },
      group: ["chatID"],
    });
    userCounts.map((item)=>{
      console.log(`${item.dataValues.chatID}의 사용자수`+item.dataValues.userCount)
    })
    console.log(getlist);
    console.log(userCounts);
    const updatedItems = await Promise.all(
      getlist.map(async (item) => {
        const chatID = item.dataValues.chatID;
        const matchingUserCount = await userCounts.find(function (uc){
          return chatID === uc.dataValues.chatID
        });
        if (matchingUserCount) {
          item.dataValues.group_chatting.dataValues.userCount = matchingUserCount.dataValues.userCount;
        } else {
          item.dataValues.userCount = 0;
        }
        return item;
      })
    );
    
    res.status(200).json(updatedItems);
  } catch (err) {
    console.error(err);
  }
};
//채팅방 입장 api
const chatMessage = async (req, res) => {
  const chatID = req.params.chatID;
  const { page = 1, per_page = 30 } = req.query;

  const enter = await chat.user_chat.findOne({
    where: { userID: req.decode.userID, chatID: chatID },
  });
  console.log(enter);
  const chatMessage = await chat.Message.findAndCountAll({
    offset: per_page * (page - 1),
    limit: per_page,
    order: [["sendtime", "DESC"]],
    where: { chatID: chatID, sendtime: { [Op.gt]: enter.enterTime } },
  });

  const result = !chatMessage;
  console.log(result);
  res.status(200).json({ chatMessage, result: true, message: "성공" });
};

const enterChatRoom = async (req, res) => {
  const chatID = req.params.chatID;
  try {
    const chatRoomData = await chat.GroupChat.findOne({
      attributes: ["admin", "chattime", "chatID"],
      where: { chatID: chatID },
      include: [
        {
          model: chat.user_chat,
          attributes: ["userID"],
          include: [
            {
              model: users,
              attributes: ["profileImage"],
            },
          ],
        },
        {
          model: post.cPost,
          attributes: ["title", "personnel", "location"],
        },
      ],
    });
    res.status(200).json({ chatRoomData });
  } catch (err) {
    console.error(err);
    res.status(404).json({ result: false, message: "조회 실패" });
  }
};
//채팅방에 입장하기
const clickChatRoom = async (req, res) => {
  const cpostID = req.params.cpostID;

  try {
    const chatRoom = await chat.GroupChat.findOne({
      attributes: ["chatID"],
      where: { cpostID: cpostID },
    });
    // console.log(chatRoom.chatID);
    // console.log(chatRoom)
    const chatID = chatRoom.chatID;

    const [enter, created] = await chat.user_chat.findOrCreate({
      where: { userID: req.decode.userID, chatID: chatRoom.chatID },
      defaults: { userID: req.decode.userID, chatID: chatRoom.chatID },
    });
    console.log(enter.blackList);
    if (!created) {
      if (enter.blackList === 2) {
        return res.status(403).send("Access Denied");
      } else {
        return res
          .status(200)
          .json({ result: true, message: "이미 들어간 채팅방입니다." });
      }
    } else {
      return res
        .status(200)
        .json({ result: true, message: "채팅방에 입장하였습니다." });
    }
  } catch (err) {
    console.error(err);
  }
};
//강제퇴장 api
const forcedExit = async (req, res) => {
  try {
    const roomAdmin = await chat.GroupChat.findOne({
      attributes: ["admin"],
      where: { chatID: req.params.chatID },
    });

    console.log(req.body.userID);

    if (roomAdmin.admin != req.decode.userID) {
      res
        .status(500)
        .json({ result: false, message: "권한이 없는 접근 입니다." });
    } else {
      const quit = await chat.user_chat.update(
        {
          blackList: 0,
        },
        { where: { userID: req.body.userID, chatID: req.params.chatID } }
      );

      if (quit) {
        res
          .status(200)
          .json({ result: true, message: "퇴장이 성공적으로 이루어졌습니다." });
      } else {
        res
          .status(500)
          .json({ result: false, message: "서버에 문제가 생겼습니다." });
      }
    }
  } catch (err) {
    console.error(err);
  }
};
//채팅방 퇴장 기능
const getOut = async (req, res) => {
  console.log(req.params.chatID);
  try {
    const result = await chat.user_chat.destroy({
      where: { userID: req.decode.userID, chatID: req.params.chatID },
    });
    res
      .status(200)
      .json({ result: true, message: "채팅방에서 퇴장하였습니다" });
    // if (result) {

    // } else {
    //   console.error(err);
    // }
  } catch (err) {
    res
      .status(500)
      .json({ result: false, message: "서버에 문제가 생겼습니다." });
  }
};
async function getChatRoomByUserId(userID) {
  const roomArray = await chat.user_chat.findAll({
    where: { userID: userID, blackList: 1 },
  });
  console.log(roomArray);
  return roomArray;
}

module.exports = {
  getChatRoomByUserId,
  getChatRoom,
  enterChatRoom,
  forcedExit,
  getOut,
  clickChatRoom,
  chatMessage,
};