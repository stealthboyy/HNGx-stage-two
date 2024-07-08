import joi from "joi";

export interface ICreateAccountDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export const CreateAccountDto = joi
  .object<ICreateAccountDto>({
    email: joi.string().email().required(),
    password: joi.string().required(),
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    phone: joi.string().required(),
  })
  .strict();

export interface ILoginDto {
  email: string;
  password: string;
}

export const LoginDto = joi
  .object<ILoginDto>({
    email: joi.string().required(),
    password: joi.string().required(),
  })
  .strict();
