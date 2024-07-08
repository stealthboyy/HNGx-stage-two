import { PrismaClient } from "@prisma/client";

import { Forbidden } from "http-errors";

export class UserService {
  constructor(private prisma: PrismaClient) {}

  async getProfile(cUserId: string, id: string) {
    let user = await this.prisma.user.findFirst({
      where: {
        userId: cUserId,
      },
      include: {
        organisations: {
          include: {
            users: true,
          },
        },
      },
    });

    if (cUserId !== id) {
      const isSameOrg = user.organisations.some((org) =>
        org.users.some((u) => u.userId === id)
      );

      if (!isSameOrg) {
        throw new Forbidden("You are not allowed to view this user's profile");
      }

      user = await this.prisma.user.findFirst({
        where: {
          userId: id,
        },
        include: {
          organisations: {
            include: {
              users: true,
            },
          },
        },
      });
    }

    delete user.password;
    delete user.organisations;

    return {
      message: "User profile retrieved successfully",
      data: user,
    };
  }
}
