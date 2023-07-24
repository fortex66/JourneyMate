//uploadModel.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USERNAME, process.env.MYSQL_PASSWORD, {
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  dialect: 'mysql',
});


const tPost = sequelize.define('travel_posts', {
  // Assuming postId and userId are the foreign keys from post and user table.
  tpostID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  userID: {
    type: DataTypes.STRING,
    allowNull: false
  },
  postDate:{
    type: DataTypes.TIME,
    allowNull: true
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true
  },
  x: {
    type: DataTypes.DOUBLE,
    allowNull: true
  },
  y: {
    type: DataTypes.DOUBLE,
    allowNull: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  // 다른 옵션들 기입
  timestamps: false,
  sequelize, 
  modelName: 'travel_posts'
});

const tPostImage = sequelize.define('post_images', {
  // Assuming postId and userId are the foreign keys from post and user table.
  imageURL: {
    type: DataTypes.STRING,
    allowNull: false
  },
  imageID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  content:{
    type: DataTypes.TEXT,
    allowNull: false
  },
  tpostID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'travel_posts',
      key: 'tpostID'
    }
  }
}, {
  // 다른 옵션들 기입
  timestamps: false,
  onUpdate: "CASCADE",
  onDelete: 'CASCADE',
  sequelize, 
  modelName: 'post_images'
});

const tPostContents = sequelize.define('post_contents', {
  // Assuming postId and userId are the foreign keys from post and user table.
  cid: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  content:{
    type: DataTypes.TEXT,
    allowNull: false
  },
  imageID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'post_images',
      key: 'imageID'
    }
  }
}, {
  // 다른 옵션들 기입
  onUpdate: "CASCADE",
  onDelete: 'CASCADE',
  sequelize, 
  modelName: 'post_contents'
});

tPostImage.belongsTo(tPost, { foreignKey: 'tpostID' });
tPost.hasMany(tPostImage, { foreignKey: 'tpostID' });

tPostContents.belongsTo(tPostImage, { foreignKey: 'imageID' });
tPostImage.hasMany(tPostContents, { foreignKey: 'imageID' });




// 동행인 관련 데이터 설정
const cPost = sequelize.define('companion posts', {
  // Assuming postId and userId are the foreign keys from post and user table.
  cpostID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  userID: {
    type: DataTypes.STRING,
    allowNull: false
  },
  postDate:{
    type: DataTypes.TIME,
    allowNull: true
  },
  startDate:{
    type: DataTypes.TIME,
    allowNull: true
  },
  finishDate:{
    type: DataTypes.TIME,
    allowNull: true
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true
  },
  content: {
    type: DataTypes.STRING,
    allowNull: true
  },
  pgender: {
    type: DataTypes.STRING,
    allowNull: true
  },
  personnel: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  age: {
    type: DataTypes.STRING,
    allowNull: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  // 다른 옵션들 기입
  timestamps: false,
  sequelize, 
  modelName: 'companion posts'
});

const cPostImage = sequelize.define('post_images', {
  // Assuming postId and userId are the foreign keys from post and user table.
  imageURL: {
    type: DataTypes.STRING,
    allowNull: false
  },
  imageID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  cpostID: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'companion posts',
      key: 'cpostID',
      onDelete: 'CASCADE'  // CASCADE DELETE 적용
    }
  }
}, {
  // 다른 옵션들 기입
  timestamps: false,
  onUpdate: "CASCADE",
  onDelete: 'CASCADE',
  sequelize, 
  modelName: 'post_images'
});


cPostImage.belongsTo(cPost, { foreignKey: 'cpostID',onDelete: 'CASCADE' });
cPost.hasMany(cPostImage, { foreignKey: 'cpostID' });

module.exports = {tPost, tPostImage, cPost, cPostImage };
