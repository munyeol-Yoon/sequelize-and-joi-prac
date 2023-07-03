const express = require("express");
const jwt = require("jsonwebtoken");

const { Users } = require("../models");
const { loginValidadtion } = require("../validation/validation");

const router = express.Router();

// 로그인 api
router.post("/", async (req, res) => {
  try {
    const { nickname, password } = await loginValidadtion.validateAsync(
      req.body
    );
    const existUser = await Users.findOne({
      where: { nickname },
    });

    if (!existUser) {
      return res
        .status(412)
        .json({ errorMessage: "닉네임 또는 패스워드를 잘못입력하였습니다." });
    }

    const token = jwt.sign({ nickname }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("Authorization", `Bearer ${token}`);

    res.status(200).json({ token });
  } catch (err) {
    if (err.isJoi) {
      return res.status(412).json({ errorMessage: err.details[0].message });
    }
    console.error(err);
  }
});

module.exports = router;
