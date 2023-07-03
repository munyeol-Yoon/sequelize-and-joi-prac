const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

const { Users } = require("../models");

dotenv.config();

module.exports = async (req, res, next) => {
  try {
    const { Authorization } = req.cookies;
    const [tokenType, token] = (Authorization ?? "").split(" ");

    if (tokenType !== "Bearer" || !token) {
      res.clearCookie("Authorization");
      return res
        .status(403)
        .json({ errorMessage: "로그인이 필요한 기능입니다." });
    }

    const nickname = jwt.verify(token, process.env.JWT_SECRET).nickname;

    const user = await Users.findOne({
      where: { nickname },
    });

    if (!user) {
      res.clearCookie("Authorization");
      return res
        .status(403)
        .json({ errorMessage: "로그인이 필요한 기능입니다. " });
    }

    res.locals.user = user;

    next();
  } catch (err) {
    res.clearCookie("Authorization");
    return res
      .status(403)
      .json({ errorMessage: "전달된 쿠키에서 오류가 발생하였습니다." });
  }
};
