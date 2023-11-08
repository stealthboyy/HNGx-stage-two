import joi from "joi";

export const CreateBusTicketDto = joi
  .object({
    amount: joi.number().required(),
  })
  .strict();

export const GetUserBusTicketByIdDto = joi
  .object({
    ticketId: joi.string().required(),
  })
  .strict();

export const GetUserByEmailOrPhoneDto = joi
  .object({
    emailOrPhone: joi.string().required(),
  })
  .strict();
