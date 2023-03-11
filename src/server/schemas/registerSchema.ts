import { Joi } from "express-validation";

const registerSchema = {
  body: Joi.object({
    username: Joi.string().min(3).max(12).required().messages({
      "string.empty": "Username cannot be empty",
      "string.min": "Username should have minimum 3 characters",
      "string.max": "Username should have maximum 12 characters",
    }),
    email: Joi.string()
      .email({ minDomainSegments: 2 })
      .trim()
      .required()
      .messages({ "string.empty": "Email cannot be empty" }),
    password: Joi.string().min(8).required().messages({
      "string.empty": "Password cannot be empty",
      "string.min": "Password should have minimum 8 characters",
    }),
  }),
};

export default registerSchema;
