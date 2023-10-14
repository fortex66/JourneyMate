const tPost = require("../models/uploadModel");
const cPost = require("../models/uploadModel");
const Tag = require("../models/uploadModel");
const userProfile = require("../models/signupModel");
const Users = require("../models/userModel");
const SearchHistories = require("../models/uploadModel");
const { Op } = require("sequelize");
const { sequelize } = require("../config");
const { Sequelize } = require("sequelize");

// const sequelize = new Sequelize(
//   process.env.MYSQL_DATABASE,
//   process.env.MYSQL_USERNAME,
//   process.env.MYSQL_PASSWORD,
//   {
//     host: process.env.MYSQL_HOST,
//     port: process.env.MYSQL_PORT,
//     dialect: "mysql",
//   }
// );

const getlist = async (req, res) => {
    //커뮤니티 게시글 받아오기
    try {
        const { page = 1, per_page = 10, sort = "latest" } = req.query;

        let order;
        switch (sort) {
            case "popular":
                order = [["likeCount", "DESC"]];
                break;
            case "comments":
                order = [["commentCount", "DESC"]];
                break;
            case "latest":
            default:
                order = [["postDate", "DESC"]];
        }
        const posts = await tPost.tPost.findAndCountAll({
            offset: per_page * (page - 1),
            limit: per_page,
            order: order,
            include: [
                {
                    model: tPost.tPostImage,
                    as: "post_images",
                },
                {
                    model: userProfile.User,
                    attributes: ["profileImage"],
                },
                {
                    model: tPost.tLocation,
                    as: "travel_post_location",
                    attributes: ["location", "x", "y"],
                },
            ],
        });
        const total_pages = Math.ceil(posts.count / per_page);
        res.status(200).json({ posts, total_pages });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "게시글 조회에 실패하였습니다" });
    }
};

// 주변 위치 조회 API
const getNearbylist = async (req, res) => {
    try {
        const {
            page = 1,
            per_page = 9,
            sort = "latest",
            x,
            y,
            radius,
        } = req.query; //경도 : x, 위도 : y, 반경 : radius(km), 정렬방식 : sort

        let order;
        switch (sort) {
            case "popular":
                order = [["likeCount", "DESC"]];
                break;
            case "latest":
            default:
                order = [["postDate", "DESC"]];
        }

        // Use the Haversine formula in the where clause to get posts within the specified radius
        const posts = await tPost.tPost.findAndCountAll({
            offset: per_page * (page - 1),
            limit: per_page,
            order: order,
            //하버사인 공식
            where: sequelize.literal(
                `(6371 * acos(cos(radians(${y})) * cos(radians(y)) * cos(radians(x) - radians(${x})) + sin(radians(${y})) * sin(radians(y)))) < ${radius}`
            ),
            include: [{ model: tPost.tPostImage, as: "post_images" }],
        });

        const total_pages = Math.ceil(posts.count / per_page);
        res.status(200).json({ posts, total_pages });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "게시글 조회에 실패하였습니다" });
    }
};

const getCNearbylist = async (req, res) => {
    try {
        const {
            page = 1,
            per_page = 9,
            sort = "latest",
            x,
            y,
            radius,
        } = req.query; //경도 : x, 위도 : y, 반경 : radius(km), 정렬방식 : sort

        let order;
        switch (sort) {
            case "popular":
                order = [["likeCount", "DESC"]];
                break;
            case "latest":
            default:
                order = [["postDate", "DESC"]];
        }

        // Use the Haversine formula in the where clause to get posts within the specified radius
        const posts = await cPost.cPost.findAndCountAll({
            offset: per_page * (page - 1),
            limit: per_page,
            order: order,
            //하버사인 공식
            where: sequelize.literal(
                `(6371 * acos(cos(radians(${y})) * cos(radians(y)) * cos(radians(x) - radians(${x})) + sin(radians(${y})) * sin(radians(y)))) < ${radius}`
            ),
            include: [{ model: cPost.cPostImage, as: "post_images" }],
        });

        const total_pages = Math.ceil(posts.count / per_page);
        res.status(200).json({ posts, total_pages });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "게시글 조회에 실패하였습니다" });
    }
};

const searchCount = async (req, res) => {
    try {
        const { location } = req.query;

        // Search History 테이블에 새로운 레코드 추가
        if (location !== "empty") {
            const newSearchHistory =
                await SearchHistories.SearchHistories.create({
                    location,
                    searchDate: new Date(),
                });
        }
        res.status(200).json(true); // 수정된 부분
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "테이블에 추가 실패" });
    }
};
const getTagSearchList = async (req, res) => {
    try {
        const { page = 1, per_page = 10, sort = "latest", tags } = req.query;

        let order;
        switch (sort) {
            case "popular":
                order = [["likeCount", "DESC"]];
                break;
            case "comments":
                order = [["commentCount", "DESC"]];
                break;
            case "latest":
            default:
                order = [["postDate", "DESC"]];
        }
        const tag = await Tag.Tag.findOne({ where: { content: tags } });
        if (!tag) {
            res.status(202).json({
                message: "해당 태그를 가지는 게시물이 없습니다.",
            });
        }

        const tagId = tag.dataValues.tagID;

        const taggings = await Tag.TTagging.findAll({
            where: { tagID: tagId },
        });

        const postIds = taggings.map((t) => t.tpostID);

        let posts = await tPost.tPost.findAndCountAll({
            where: { tpostID: postIds },
            include: [
                {
                    model: tPost.tPostImage,
                    as: "post_images",
                },
                {
                    model: userProfile.User,
                    attributes: ["profileImage"],
                },
                {
                    model: Tag.Tag,
                    as: "tags",
                    through: {
                        model: Tag.TTagging,
                        attributes: [],
                    },
                    required: false,
                },
            ],
            order: order,
            offset: per_page * (page - 1),
            limit: per_page,
        });
        const total_pages = Math.ceil(posts.count / per_page);

        res.status(200).json({ posts, total_pages }); // 수정된 부분
    } catch (err) {
        console.error(err);
        res.status(404).json({ message: "검색 실패!" });
    }
};
//검색을 받고 검색 조건에 해당하는 게시글을 반환하는 API => 원래 메서드 일부 오류가 있어서 고침
const getSearchlist = async (req, res) => {
    try {
        const {
            page = 1,
            per_page = 10,
            sort = "latest",
            tags,
            location,
            title,
        } = req.query;

        let order;
        switch (sort) {
            case "popular":
                order = [["likeCount", "DESC"]];
                break;
            case "comments":
                order = [["commentCount", "DESC"]];
                break;
            case "latest":
            default:
                order = [["postDate", "DESC"]];
        }
        // title 검색 조건
        const titleCondition = title
            ? { title: { [Op.like]: `%${title}%` } } // 수정된 부분
            : {};

        // location 검색 조건
        const locationCondition = location
            ? { location: { [Op.like]: `%${location}%` } }
            : {};

        let tagList = tags ? tags.split(",") : null;

        const tagCondition = tagList
            ? {
                  [Op.or]: tagList.map((tagContent) => ({
                      content: { [Op.like]: `%${tagContent}%` },
                  })),
              }
            : {};
        // 먼저 location을 기반으로 게시물 찾기
        let posts = await tPost.tPost.findAndCountAll({
            where: { ...locationCondition, ...titleCondition },
            include: [
                {
                    model: tPost.tPostImage,
                    as: "post_images",
                },
                {
                    model: userProfile.User,
                    attributes: ["profileImage"],
                },
                {
                    model: Tag.Tag,
                    as: "tags",
                    through: {
                        model: Tag.TTagging,
                        attributes: [],
                    },
                    required: tagList !== null,
                    where: tagCondition,
                },
            ],
            order: order,
            group: ["tpostID"],
            offset: per_page * (page - 1),
            limit: per_page,
        });

        // tag를 배열로 변환

        // tag가 제공된 경우, tag를 기반으로 게시물을 필터링
        // if (tagList) {
        //   posts.rows = posts.rows.filter((post) =>
        //     post.tags.some((tag) => tagList.includes(tag.content))
        //   );
        // }

        const total_pages = Math.ceil(posts.count.length / per_page);

        res.status(200).json({ posts, total_pages }); // 수정된 부분
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "게시글 조회에 실패하였습니다" });
    }
};

//24시간 동안 가장 많이 검색된 키워드 위치 Top10 출력
const getTopSearches = async (req, res) => {
    try {
        const oneDayAgo = new Date(Date.now() - 240 * 60 * 60 * 1000); // 24 hours ago
        const topSearches = await SearchHistories.SearchHistories.findAll({
            where: {
                searchDate: {
                    [Op.gt]: oneDayAgo,
                },
            },
            attributes: [
                "location",
                [Sequelize.fn("COUNT", Sequelize.col("location")), "count"],
            ],
            group: ["location"],
            order: [[Sequelize.fn("COUNT", Sequelize.col("location")), "DESC"]],
            limit: 10,
        });

        res.status(200).json(topSearches);
    } catch (err) {
        console.error(err);
    }
};

const getpost = async (req, res) => {
    try {
        const post = await tPost.tPost.findOne({
            where: { tpostID: req.params.tpostID },
            include: [
                {
                    model: tPost.tPostImage,
                    as: "post_images",
                },
                {
                    model: Tag.Tag,
                    as: "tags",
                },
                // {
                //   model: tPost.tLocation,
                //   attributes:["location","x","y"]
                // },
                {
                    model: Users,
                    attributes: ["profileImage"],
                },
            ],
        });
        res.status(200).json({ post });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};

const getclist = async (req, res) => {
    try {
        const { page = 1, per_page = 10, sort = "latest" } = req.query;
        const userID = req.decode.userID;

        let order;
        switch (sort) {
            case "dueDate":
                order = [["finishDate", "DESC"]];
                break;
            case "latest":
            default:
                order = [["postDate", "DESC"]];
        }

        const posts = await cPost.cPost.findAndCountAll({
            offset: per_page * (page - 1),
            limit: per_page,
            order: order,
            include: [
                { model: cPost.cPostImage, as: "post_images" },
                {
                    model: userProfile.User,
                    as: "users",
                    attributes: ["profileImage", "gender", "birth"],
                },
            ],
        });
        const total_pages = Math.ceil(posts.count / per_page);

        await posts.rows.map((post) => {
            const getYear = post.users.dataValues.birth.getFullYear();
            var date = new Date();
            var year = date.getFullYear();
            post.users.dataValues.birth = year - getYear;
        });
        res.status(200).json({ posts, total_pages });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "동행인 게시글 조회에 실패하였습니다",
        });
    }
};

const getcpost = async (req, res) => {
    try {
        const post = await cPost.cPost.findOne({
            where: { cpostID: req.params.cpostID },
            include: [
                {
                    model: cPost.cPostImage,
                    as: "post_images",
                },
                {
                    model: Tag.Tag,
                    as: "tags",
                },
                {
                    model: Users,
                    as: "users",
                    // where: {userID: req.decode.userID},
                    attributes: ["profileImage", "gender", "birth"],
                },
            ],
        });

        const getYear = post.dataValues.users.dataValues.birth.getFullYear();

        var date = new Date();
        var year = date.getFullYear();
        const age = year - getYear;
        res.status(200).json({ post, age });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};

const getCSearchlist = async (req, res) => {
    try {
        const {
            page = 1,
            per_page = 10,
            sort = "latest",
            tags,
            location,
            pgender,
            age,
            startDate,
            finishDate,
            title,
        } = req.query;

        let order;
        switch (sort) {
            case "dueDate":
                order = [["finishDate", "DESC"]];
                break;
            case "latest":
            default:
                order = [["postDate", "DESC"]];
        }

        // location 검색 조건
        const locationCondition = location
            ? { location: { [Op.like]: `%${location}%` } }
            : {};
        const titleCondition = title
            ? { title: { [Op.like]: `%${title}%` } }
            : {};
        const genderCondition = pgender
            ? { pgender: { [Op.eq]: pgender } }
            : {};
        const ageCondition = age ? { age: { [Op.like]: `%${age}%` } } : {};
        const startDateCondition = startDate
            ? { startDate: { [Op.gte]: startDate } }
            : {};
        const endDateCondition = finishDate
            ? { finishDate: { [Op.lte]: finishDate } }
            : {};

        // 먼저 location을 기반으로 게시물 찾기
        let posts = await cPost.cPost.findAndCountAll({
            where: {
                ...locationCondition,
                ...genderCondition,
                ...ageCondition,
                ...startDateCondition,
                ...endDateCondition,
                ...titleCondition,
            },
            include: [
                {
                    model: cPost.cPostImage,
                    as: "post_images",
                },
                {
                    model: Users,
                    as: "users",
                    // where: {userID: req.decode.userID},
                    attributes: ["profileImage", "gender", "birth"],
                },
                {
                    model: Tag.Tag,
                    as: "tags",
                    through: {
                        model: Tag.CTagging,
                        attributes: [],
                    },
                    required: false,
                },
            ],
            order: order,
            offset: per_page * (page - 1),
            limit: per_page,
        });

        // tag를 배열로 변환
        let tagList = tags ? tags.split(",") : null;

        // tag가 제공된 경우, tag를 기반으로 게시물을 필터링
        if (tagList) {
            posts.rows = posts.rows.filter((post) =>
                post.tags.some((tag) => tagList.includes(tag.content))
            );
        }
        const total_pages = Math.ceil(posts.count / per_page);
        await posts.rows.map((post) => {
            const getYear = post.users.dataValues.birth.getFullYear();
            var date = new Date();
            var year = date.getFullYear();
            post.users.dataValues.birth = year - getYear;
        });
        res.status(200).json({ posts, total_pages });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "게시글 조회에 실패하였습니다" });
    }
};

const getRecommendList = async (req, res) => {
    try {
        const userID = req.decode.userID;
        const { page = 1, per_page = 10 } = req.query;
        // const userTag=await
        const posts = await tPost.tPost.findAndCountAll({
            offset: per_page * (page - 1),
            limit: per_page,
            order: order,
            include: [
                {
                    model: tPost.tPostImage,
                    as: "post_images",
                },
                {
                    model: userProfile.User,
                    attributes: ["profileImage"],
                },
            ],
        });
        const total_pages = Math.ceil(posts.count / per_page);
        res.status(200).json({ posts, total_pages });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "게시글 조회에 실패하였습니다" });
    }
};
module.exports = {
    getlist,
    getpost,
    getclist,
    getcpost,
    getSearchlist,
    getCSearchlist,
    getNearbylist,
    getCNearbylist,
    getTopSearches,
    searchCount,
    getTagSearchList,
    getRecommendList,
};
