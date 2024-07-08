import { Prisma, PrismaClient } from "@prisma/client";
import {
  CreateOrganisationDto,
  ICreateOrganisationDto,
  AddUserToOrganisationDto,
  IAddUserToOrganisationDto,
} from "./dto";
import { NotFound } from "http-errors";

export class OrganisationService {
  constructor(private prisma: PrismaClient) {}

  async getOrganisations(userId: string) {
    // Get user
    const user = await this.getUser(
      { userId },
      {
        organisations: true,
      }
    );

    return {
      message: "User organisations retrieved successfully",
      data: user.organisations,
    };
  }

  async getOrganisation(userId: string, orgId: string) {
    // Get user
    const user = await this.getUser(
      { userId },
      {
        organisations: {
          where: {
            orgId,
          },
        },
      }
    );

    if (user.organisations.length === 0)
      throw new NotFound("Organisation not found");

    return {
      message: "User organisation retrieved successfully",
      data: user.organisations[0],
    };
  }

  async createOrganisation(userId: string, dto: ICreateOrganisationDto) {
    // Validate dto
    const { error } = CreateOrganisationDto.validate(dto, {
      abortEarly: false,
    });
    if (error) throw error;

    // Get user
    const user = await this.getUser({ userId });

    // Create organisation
    const organisation = await this.prisma.organisation.create({
      data: {
        ...dto,
        users: {
          connect: {
            userId: user.userId,
          },
        },
      },
    });

    return {
      message: "Organisation created successfully",
      data: organisation,
    };
  }

  async addUserToOrganisation(orgId: string, dto: IAddUserToOrganisationDto) {
    // Validate dto
    const { error } = AddUserToOrganisationDto.validate(dto, {
      abortEarly: false,
    });
    if (error) throw error;

    // Get organisation
    const organisation = await this.prisma.organisation.findFirst({
      where: {
        orgId,
      },
    });
    if (!organisation) throw new NotFound("Organisation not found");

    // Get user
    const user = await this.getUser({ userId: dto.userId });

    if (!user) throw new NotFound("User not found");

    // Add user to organisation
    const updatedOrganisation = await this.prisma.organisation.update({
      where: {
        orgId,
      },
      data: {
        users: {
          connect: {
            userId: user.userId,
          },
        },
      },
    });

    return {
      message: "User added to organisation successfully",
    };
  }

  private async getUser(
    query: Prisma.UserWhereInput,
    include?: Prisma.UserInclude
  ) {
    const user = await this.prisma.user.findFirst({
      where: { ...query },
      include: {
        ...include,
      },
    });
    if (!user) throw new NotFound("User not found");

    delete user.password;
    return user;
  }
}
