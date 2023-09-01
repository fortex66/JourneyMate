const express = require("express");
const { upload } = require("../config");
const uploadController = require("../controllers/uploadController");
const commentController = require("../controllers/commentController");
const authMiddleware = require("../middleware/authMiddleware");
const postController = require("../controllers/postController");
const mapController = require("../controllers/mapController");
const scrapController = require("../controllers/scrapController.js");
const router = express.Router();

router.put(
  "/communitydetail",
  upload.array("photos[]", 1),
  authMiddleware,
  uploadController.updateImage
);
router.delete("/communitydetail", authMiddleware, uploadController.deleteImage);
router.post(
  "/communitydetail",
  upload.array("photos[]", 1),
  authMiddleware,
  uploadController.newImage
);
// 커뮤니티 게시글 작성, 삭제, 수정
router.post(
  "/upload",
  upload.array("photos[]", 10),
  authMiddleware,
  uploadController.uploadpost
);
router.delete("/:tpostid", authMiddleware, uploadController.deletepost);
router.put("/:tpostID", authMiddleware, uploadController.updatePost);

//Home.js 마커 이미지 출력용
router.get("/mapimage", authMiddleware, mapController.mapGetlist);

//커뮤니티 게시글 불러오기
router.get("/", authMiddleware, postController.getlist);
router.get("/search", authMiddleware, postController.getSearchlist);
router.get("/nearby", authMiddleware, postController.getNearbylist);
router.get("/cnearby", authMiddleware, postController.getCNearbylist);
router.get("/topkeyword", authMiddleware, postController.getTopSearches);
router.get("/searchcount", authMiddleware, postController.searchCount);
router.get("/status", authMiddleware, scrapController.checkScrapStatus);

//커뮤니티 게시글 상세정보
router.get(
  "/:tpostID",
  upload.array("photos[]", 10),
  authMiddleware,
  postController.getpost
);

// 댓글 관련
router.get("/comments/:tpostID", authMiddleware, commentController.getComments);
router.post("/comments/:tpostID", authMiddleware, commentController.addComment);
router.delete(
  "/comments/:tpostID",
  authMiddleware,
  commentController.deleteComment
);
router.get("/commentCount/:tpostID", async (req, res) => {
  const tpostID = req.query.tpostID;
  const count = await commentController.updateCommentCounts(tpostID);
  res.status(200).json({ message: "댓글 갯수", commentCount: count });
});

//스크랩 관련
router.post("/scrap", authMiddleware, scrapController.toggleScrap);

// 게시글 작성시 키워드 검색으로 위치를 받아오기
router.get("/posts/search-keyword", uploadController.searchKeyword);
router.get("/posts", postController.getlist);
router.get("/posts/:tpostID", postController.getpost);

module.exports = router;
