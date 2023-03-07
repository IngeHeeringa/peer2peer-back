import { Joi } from "express-validation";

const loginSchema = {
  body: Joi.object({
    email: Joi.string().email().trim().required(),
    password: Joi.string().min(8).max(20).required(),
  }),
};

export default loginSchema;
