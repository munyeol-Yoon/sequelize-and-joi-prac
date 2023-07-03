const Joi = require("joi");

const signupValidation = Joi.object({
  nickname: Joi.string().not("").alphanum().required().messages({
    "any.only": "닉네임의 형식이 일치하지 않습니다.",
  }),
  password: Joi.string().not("").min(3).required().messages({
    "string.base": "비밀번호 형식이 일치하지 않습니다.",
    "any.required": "비밀번호를 입력해주세요.",
  }),
  confirmPassword: Joi.equal(Joi.ref("password")).not("").required().messages({
    "any.only": "비밀번호가 일치하지 않습니다.",
    "any.required": "confirm 을 입력해주세요",
  }),
});

const loginValidadtion = Joi.object({
  nickname: Joi.string().not("").required().messages({
    "any.required": "닉네임을 입력해주세요.",
  }),
  password: Joi.string().not("").required().messages({
    "any.required": "패스워드를 입력해주세요.",
  }),
});

module.exports = {
  signupValidation,
  loginValidadtion,
};
