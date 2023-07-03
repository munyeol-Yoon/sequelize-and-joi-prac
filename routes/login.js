const express = require("express");
const router = express.Router();

// 로그인 api
router.post("/", async (req, res) => {
  res.send("로그인");
});

module.exports = router;
