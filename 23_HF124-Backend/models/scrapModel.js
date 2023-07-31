//scrapModel.js
const { Sequelize, DataTypes } = require('sequelize');
//const userModel = require('./userModel');
//const upload = require('./uploadModel');
const sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USERNAME, process.env.MYSQL_PASSWORD, {
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  dialect: 'mysql',
});


const scraps = sequelize.define('scraps', {
    scrapsID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    userID: {
      type: DataTypes.STRING,
      allowNull: false,
      /*references: {
        model: 'users',
        key: 'userID',
        onDelete: 'CASCADE'  // CASCADE DELETE 적용
      }*/
    },
    tpostID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      /*references: {
        model: 'travel_posts',
        key: 'tpostID',
        onDelete: 'CASCADE'  // CASCADE DELETE 적용
      }*/
    }
  }, {
    // 다른 옵션들 기입
    timestamps: false,
    onUpdate: "CASCADE",
    onDelete: 'CASCADE',
    sequelize, 
    modelName: 'scraps'
  });
  
  /*
  scraps.belongsTo(userModel, { foreignKey: 'userID', onDelete: 'CASCADE' });
  userModel.hasMany(scraps, { foreignKey: 'userID' });
  scraps.belongsTo(upload.tPost, { foreignKey: 'tpostID', onDelete: 'CASCADE' });
  upload.tPost.hasMany(scraps, { foreignKey: 'tpostID' });
  */



  module.exports = { scraps };
  