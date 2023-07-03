const express = require("express");

const authMiddleware = require("../middlewares/auth-middleware");
const { Posts, Users } = require("../models");
const { postValidation } = require("../validation/validation");
const { Op } = require("sequelize");

const router = express.Router();

// 게시글 생성 api
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, content } = await postValidation.validateAsync(req.body);
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

    return res.status(201).json({ message: "게시글 작성에 성공하였습니다. " });
  } catch (err) {
    if (err.isJoi) {
      return res.status(412).json({ errorMessage: err.details[0].message });
    }
    console.error(err);
  }
});

// 게시글 전체 조회 api
router.get("/", async (_, res) => {
  try {
    const findPosts = await Posts.findAll({
      attributes: ["postId", "userId", "title", "createdAt", "updatedAt"],
      include: [
        {
          model: Users,
          attributes: ["nickname"],
        },
      ],
    });

    const posts = findPosts.map((post) => {
      return {
        postId: post.postId,
        userId: post.userId,
        nickname: post.User.nickname,
        title: post.title,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      };
    });

    return res.status(200).json({ posts: posts });
  } catch (err) {
    console.error(err);
  }
});

// 게시글 상세 조회 api
router.get("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const findPost = await Posts.findOne({
      where: { postId },
      attributes: ["postId", "userId", "title", "createdAt", "updatedAt"],
      include: [
        {
          model: Users,
          attributes: ["nickname"],
        },
      ],
    });

    const post = {
      postId: findPost.postId,
      userId: findPost.userId,
      nickname: findPost.User.nickname,
      title: findPost.title,
      createdAt: findPost.createdAt,
      updatedAt: findPost.updatedAt,
    };

    return res.status(200).json({ posts: post });
  } catch (err) {
    console.error(err);
  }
});

// 게시글 수정 api
router.put("/:postId", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const { title, content } = await postValidation.validateAsync(req.body);
    const { userId } = res.locals.user;

    const existPost = await Posts.findOne({
      where: { postId },
    });

    if (!existPost) {
      return res
        .status(404)
        .json({ errorMessage: "해당 게시글이 존재하지 않습니다." });
    }

    const updatePost = await Posts.update(
      {
        title,
        content,
      },
      {
        where: {
          [Op.and]: [{ userId }, { postId }],
        },
      }
    );

    if (!updatePost) {
      return res
        .status(400)
        .json({ errorMessage: "게시글 수정에 실패하였습니다" });
    }

    return res.status(200).json({ message: "게시글을 수정하였습니다." });
  } catch (err) {
    if (err.isJoi) {
      return res.status(412).json({ errorMessage: err.details[0].message });
    }
    console.error(err);
  }
});

// 게시글 삭제 api
router.delete("/:postId", authMiddleware, async (req, res) => {
  res.send("게시글 삭제");
});

module.exports = router;
