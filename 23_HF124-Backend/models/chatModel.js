const { Model, DataTypes } = require('sequelize');
const sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USERNAME, process.env.MYSQL_PASSWORD, {
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  dialect: 'mysql',
});


class GroupChat extends Model {}

GroupChat.init({
  chatID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  chattime: DataTypes.DATE,
  lastchat: DataTypes.STRING(200),
  admin: DataTypes.STRING(15),
  cpostID: DataTypes.INTEGER,
  userID: DataTypes.STRING(15),
}, {
  sequelize,
  modelName: 'group_chattings',
});

class Message extends Model {}

Message.init({
  mid: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  content: DataTypes.TEXT,
  read: DataTypes.BOOLEAN,
  sendtime: DataTypes.DATE,
  chatID: DataTypes.INTEGER,
  userID: DataTypes.STRING(45),
}, {
  sequelize,
  modelName: 'messages',
});

GroupChat.hasMany(Message, { foreignKey: 'chatID' });
Message.belongsTo(GroupChat, { foreignKey: 'chatID' });

Message.belongsTo(User, { foreignKey: 'userID' });
User.hasMany(Message, { foreignKey: 'userID' });

sequelize.sync();
