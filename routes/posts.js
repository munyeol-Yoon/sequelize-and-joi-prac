const express = require("express");
const joi = require("joi");

const authMiddleware = require("../middlewares/auth-middleware");
const { Posts } = require("../models");
const { createPostValidation } = require("../validation/validation");

const router = express.Router();

// 게시글 생성 api
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, content } = await createPostValidation.validateAsync(
      req.body
    );
    const { userId } = res.locals.user;

    const createPost = await Posts.create({
      userId,
      title,
      content,
    });

    if (!createPost) {
      return res
        .status(400)
        .json({ errorMessage: "게시글 작성에 실패했습니다." });
    }

    res.status(201).json({ message: "게시글 작성에 성공하였습니다. " });
  } catch (err) {
    if (err.isJoi) {
      return res.status(412).json({ errorMessage: err.details[0].message });
    }
    console.error(err);
  }
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
