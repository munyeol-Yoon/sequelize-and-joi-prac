const express = require("express");

const authMiddleware = require("../middlewares/auth-middleware");

const router = express.Router();

// 게시글 생성 api
router.post("/", authMiddleware, async (req, res) => {
  res.send("게시글 생성");
});

// 게시글 전체 조회 api
router.get("/", async (req, res) => {
  res.send("게시글 전체 조회");
});

// 게시글 상세 조회 api
router.get("/:postId", async (req, res) => {
  res.send("게시글 상세 조회");
});

// 게시글 수정 api
router.put("/:postId", async (req, res) => {
  res.send("게시글 수정");
});

// 게시글 삭제 api
router.delete("/:postId", async (req, res) => {
  res.send("게시글 삭제");
});

module.exports = router;
