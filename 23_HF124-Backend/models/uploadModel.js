//uploadModel.js
const { Sequelize, DataTypes, Model } = require("sequelize");
const users = require("./signupModel");
const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_USERNAME,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    dialect: "mysql",
  }
);

const tPost = sequelize.define(
  "travel_posts",
  {
    // Assuming postId and userId are the foreign keys from post and user table.
    tpostID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    userID: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    postDate: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    x: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    y: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    address_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    likeCount: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    commentCount: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    // 다른 옵션들 기입
    timestamps: false,
    sequelize,
    modelName: "travel_posts",
  }
);

const scraps = sequelize.define(
  "scraps",
  {
    scrapsID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    userID: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tpostID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "travel_posts",
        key: "tpostID",
        onDelete: "CASCADE", // CASCADE DELETE 적용
      },
    },
  },
  {
    // 다른 옵션들 기입
    timestamps: false,
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
    sequelize,
    modelName: "scraps",
  }
);

scraps.belongsTo(tPost, { foreignKey: "tpostID", onDelete: "CASCADE" });
tPost.hasMany(scraps, { foreignKey: "tpostID" });

const tPostImage = sequelize.define(
  "post_images",
  {
    // Assuming postId and userId are the foreign keys from post and user table.
    imageURL: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imageID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    tpostID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "travel_posts",
        key: "tpostID",
      },
    },
  },
  {
    // 다른 옵션들 기입
    timestamps: false,
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
    sequelize,
    modelName: "post_images",
  }
);

const tPostContents = sequelize.define(
  "post_contents",
  {
    // Assuming postId and userId are the foreign keys from post and user table.
    cid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    imageID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "post_images",
        key: "imageID",
      },
    },
  },
  {
    // 다른 옵션들 기입
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
    sequelize,
    modelName: "post_contents",
  }
);

tPostImage.belongsTo(tPost, { foreignKey: "tpostID" });
tPost.hasMany(tPostImage, { foreignKey: "tpostID" });

tPostContents.belongsTo(tPostImage, { foreignKey: "imageID" });
tPostImage.hasMany(tPostContents, { foreignKey: "imageID" });

// 동행인 관련 데이터 설정
const cPost = sequelize.define(
  "companion_posts",
  {
    // Assuming postId and userId are the foreign keys from post and user table.
    cpostID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    userID: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    postDate: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    startDate: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    finishDate: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pgender: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    personnel: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    age: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    commentCount: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    x: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    y: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
  },
  {
    // 다른 옵션들 기입
    timestamps: false,
    sequelize,
    modelName: "companion_posts",
  }
);

const cPostImage = sequelize.define(
  "post_images",
  {
    // Assuming postId and userId are the foreign keys from post and user table.
    imageURL: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imageID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    cpostID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "companion_posts",
        key: "cpostID",
        onDelete: "CASCADE", // CASCADE DELETE 적용
      },
    },
  },
  {
    // 다른 옵션들 기입
    timestamps: false,
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
    sequelize,
    modelName: "post_images",
  }
);
// tags 테이블에 대한 모델
class Tag extends Model {}

Tag.init(
  {
    tagID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Tag",
    tableName: "tags",
    timestamps: false,
  }
);

// ttagging 테이블에 대한 모델
class TTagging extends Model {}

TTagging.init(
  {
    tagID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    tpostID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "travel_posts",
        key: "tpostID",
      },
    },
  },
  {
    sequelize,
    modelName: "TTagging",
    tableName: "ttaggings",
    timestamps: false,
  }
);

// ctaggings 테이블에 대한 모델
class CTagging extends Model {}

CTagging.init(
  {
    tagID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    cpostID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "companion posts",
        key: "cpostID",
      },
    },
  },
  {
    sequelize,
    modelName: "CTagging",
    tableName: "ctaggings",
    timestamps: false,
  }
);

class SearchHistories extends Model {}

SearchHistories.init(
  {
    searchId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    location: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    searchDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "search_histories",
    timestamps: false,
  }
);

// 모델들 간의 관계 설정
Tag.hasMany(TTagging, { foreignKey: "tagID" });
TTagging.belongsTo(Tag, { foreignKey: "tagID" });

tPost.belongsToMany(Tag, {
  through: TTagging,
  foreignKey: "tpostID",
  otherKey: "tagID",
  as: "tags",
});

// Tag와 tPost 사이의 관계 설정
Tag.belongsToMany(tPost, {
  through: TTagging,
  foreignKey: "tagID",
  otherKey: "tpostID",
  as: "tPosts",
});

// cPost와 Tag 사이의 관계 설정
cPost.belongsToMany(Tag, {
  through: CTagging,
  foreignKey: "cpostID",
  otherKey: "tagID",
  as: "tags",
});

// Tag와 cPost 사이의 관계 설정
Tag.belongsToMany(cPost, {
  through: CTagging,
  foreignKey: "tagID",
  otherKey: "cpostID",
  as: "cPosts",
});

cPost.belongsTo(users.User, {
  foreignKey: "userID",
  as: "users",
  onDelete: "CASCADE",
});
users.User.hasMany(cPost, { foreignKey: "userID", as: "users" });

Tag.hasMany(CTagging, { foreignKey: "tagID" });
CTagging.belongsTo(Tag, { foreignKey: "tagID" });

cPostImage.belongsTo(cPost, { foreignKey: "cpostID", onDelete: "CASCADE" });
cPost.hasMany(cPostImage, { foreignKey: "cpostID" });

users.User.hasMany(tPost, { foreignKey: "userID" });
tPost.belongsTo(users.User, { foreignKey: "userID" });

module.exports = {
  tPost,
  tPostImage,
  cPost,
  cPostImage,
  Tag,
  TTagging,
  CTagging,
  SearchHistories,
  scraps,
};
