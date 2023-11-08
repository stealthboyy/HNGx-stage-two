import joi from "joi";

export const TransactionQueryDto = joi
  .object({
    page: joi.string(),
    limit: joi.string(),
    startDateTime: joi.string(),
    endDateTime: joi.string(),
  })
  .strict();

export const GetTransactionDto = joi
  .object({
    transactionId: joi.string().required(),
  })
  .strict();

export const FundWalletDto = joi
  .object({
    amount: joi.number().required(),
  })
  .strict();

export const PayForBusTicketDto = joi
  .object({
    ticketId: joi.string().required(),
  })
  .strict();

export const TransferCreditDto = joi
  .object({
    amount: joi.number().required(),
    emailPhoneOrId: joi.string().required(),
  })
  .strict();
