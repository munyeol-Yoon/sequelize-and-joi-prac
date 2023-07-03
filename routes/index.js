const express = require("express");

const signupRouter = require("./signup");
const loginRouter = require("./login");
const postRouter = require("./posts");

const router = express.Router();

router.use("/signup", signupRouter);
router.use("/login", loginRouter);
router.use("/posts", postRouter);

module.exports = router;
