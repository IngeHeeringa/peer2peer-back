import { Joi } from "express-validation";

const loginSchema = {
  body: Joi.object({
    email: Joi.string()
      .email({ minDomainSegments: 2 })
      .trim()
      .required()
      .messages({ "string.empty": "Email cannot be empty" }),
    password: Joi.string().min(8).max(20).required().messages({
      "string.empty": "Password cannot be empty",
      "string.min": "Password should be minimum 8 characters long",
      "string.max": "Password should be maximum 20 characters long",
    }),
  }),
};

export default loginSchema;
