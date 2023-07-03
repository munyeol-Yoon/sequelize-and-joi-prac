const express = require("express");
const router = express.Router();

// 회원 가입 api
router.post("/", async (req, res) => {
  res.send("회원가입");
});

module.exports = router;
