import joi from "joi";

export interface ICreateOrganisationDto {
  name: string;
  description?: string;
}

export const CreateOrganisationDto = joi
  .object<ICreateOrganisationDto>({
    name: joi.string().required(),
    description: joi.string(),
  })
  .strict();

export interface IAddUserToOrganisationDto {
  userId: string;
}

export const AddUserToOrganisationDto = joi
  .object<IAddUserToOrganisationDto>({
    userId: joi.string().required(),
  })
  .strict();
