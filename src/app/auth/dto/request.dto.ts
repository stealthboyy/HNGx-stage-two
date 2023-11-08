import joi from "joi";

export const CreateAccountDto = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
  name: joi.string().min(3),
  phone: joi.string().required(),
}).strict();

export const LoginDto = joi.object({
  emailOrPhone: joi.string().required(),
  password: joi.string().min(6).required(),
}).strict();
