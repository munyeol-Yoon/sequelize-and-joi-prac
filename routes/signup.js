const express = require("express");
const bcrypt = require("bcrypt");

const { Users } = require("../models");
const { signupValidation } = require("../validation/validation");

const router = express.Router();

// 회원 가입 api
router.post("/", async (req, res) => {
  try {
    const { nickname, password, confirmPassword } =
      await signupValidation.validateAsync(req.body);

    const regexp = new RegExp(nickname);
    if (regexp.test(password)) {
      return res
        .status(412)
        .json({ errorMessage: "패스워드에 닉네임이 포함되어 있습니다." });
    }

    const existUser = await Users.findOne({
      where: { nickname },
    });

    if (existUser) {
      return res
        .status(412)
        .json({ errorMessage: "이미 같은 닉네임의 유저가 존재합니다. " });
    }

    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT));
    const hashedPassword = await bcrypt.hash(password, salt);

    await Users.create({
      nickname,
      password: hashedPassword,
    });

    return res.status(201).json({ message: "회원 가입에 성공하였습니다." });
  } catch (err) {
    if (err.isJoi) {
      return res.status(412).json({ errorMessage: err.details[0].message });
    }
    console.error(err);
  }
});

module.exports = router;
