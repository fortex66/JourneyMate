require("dotenv").config();
const { Sequelize, Model, DataTypes } = require("sequelize");
const User = require("./userModel");
const cPost = require("./uploadModel").cPost;
const { sequelize } = require("../config");

class GroupChat extends Model {}

GroupChat.init(
  {
    chatID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    chattime: DataTypes.DATE,
    lastchat: DataTypes.STRING(200),
    admin: DataTypes.STRING(15),
    cpostID: DataTypes.INTEGER,
    userCount: DataTypes.INTEGER
  },
  {
    sequelize,
    timestamps: false,
    modelName: "group_chattings",
  }
);

class Message extends Model {}

Message.init(
  {
    mid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    content: DataTypes.TEXT,
    read: DataTypes.BOOLEAN,
    sendtime: DataTypes.DATE,
    chatID: DataTypes.INTEGER,
    userID: DataTypes.STRING(45),
  },
  {
    sequelize,
    timestamps: false,
    modelName: "messages",
  }
);

class user_chat extends Model {}

user_chat.init(
  {
    userID: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    chatID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    blackList: {
      type: DataTypes.TINYINT
    },
    enterTime:{
      type: DataTypes.DATE
    }
  },
  {
    sequelize,
    onDelete: true,
    onUpdate: true,
    timestamps: false,
    modelName: "user_chat",
    tableName: "user_chat",
    // hooks: {
    //   afterCreate: async (instance, options) => {
    //     const GroupChatting = GroupChat; // group_chatting 모델 가져오기
        
    //     // 해당 chatID의 userCount를 증가시키기
    //     const chatRoom = await GroupChatting.findOne({ where: { chatID: instance.chatID } });
    //     if (chatRoom) {
    //       chatRoom.userCount += 1;
    //       await chatRoom.save();
    //     }
    //   },
    //     afterUpdate: async (instance, options) => {
    //       if (instance.changed('blackList') && instance.blackList === 1) { // blackList 값이 true(또는 1)인 경우 확인
    //         const GroupChatting = sequelize.models.group_chatting; // group_chatting 모델 가져오기
            
    //         // 해당 chatID의 userCount를 감소시키기
    //         const chatRoom = await GroupChatting.findOne({ where: { chatID: instance.chatID } });
    //         if (chatRoom && chatRoom.userCount > 0) {
    //           chatRoom.userCount -= 1;
    //           await chatRoom.save();
    //         }
    //       }
    //     }
    //   }
    }
);
GroupChat.hasOne(cPost, {
  foreignKey: "cpostID",
  sourceKey: "cpostID",
  as: "companion_posts",
});

User.hasMany(user_chat, { foreignKey: "userID" });
user_chat.belongsTo(User, { foreignKey: "userID" });

GroupChat.hasMany(user_chat, { foreignKey: "chatID" });
user_chat.belongsTo(GroupChat, { foreignKey: "chatID" });

GroupChat.belongsTo(cPost, { foreignKey: "cpostID" });
cPost.hasOne(GroupChat, { foreignKey: "cpostID" });

GroupChat.hasMany(Message, { foreignKey: "chatID" });
Message.belongsTo(GroupChat, { foreignKey: "chatID" });

Message.belongsTo(User, { foreignKey: "userID" });
User.hasMany(Message, { foreignKey: "userID" });

sequelize.sync();

module.exports = { Message, GroupChat, user_chat };