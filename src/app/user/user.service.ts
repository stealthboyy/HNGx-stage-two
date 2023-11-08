import { Prisma, PrismaClient, User } from "@prisma/client";
import {
  CreateBusTicketDto,
  GetUserBusTicketByIdDto,
  GetUserByEmailOrPhoneDto,
} from "./dto";
import { NotFound } from "http-errors";

export class UserService {
  constructor(private prisma: PrismaClient) {}

  async getProfile(userId: string) {
    const user = await this.getUser(
      {
        id: userId,
      },
      {
        wallet: true,
        transactions: true,
      }
    );

    return {
      message: "User profile retrieved successfully",
      data: user,
    };
  }

  async getUserByEmailOrPhone(query: { emailOrPhone: string }) {
    // Validate query
    const { error } = GetUserByEmailOrPhoneDto.validate(query);
    if (error) throw error;

    // Destructure query
    const { emailOrPhone } = query;

    // Get user
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: emailOrPhone }, { phone: emailOrPhone }],
      },
    });

    if (!user) throw new NotFound("User not found");

    const filteredUser = this.filterUser(user);
    return {
      message: "User retrieved successfully",
      data: filteredUser,
    };
  }

  async createBusTicket(userId: string, dto: { amount: number }) {
    // Validate dto
    const { error } = CreateBusTicketDto.validate(dto);

    if (error) throw error;

    // Destructure dto
    const { amount } = dto;

    // Get user
    const user = await this.getUser({ id: userId });

    // Create ticket
    const ticket = await this.prisma.ticket.create({
      data: {
        user: {
          connect: {
            id: user.id,
          },
        },
        price: amount,
      },
    });

    return {
      message: "Bus ticket created successfully",
      data: ticket,
    };
  }

  async getUserBusTickets(userId: string) {
    // Get user
    const user = await this.getUser(
      { id: userId },
      {
        tickets: true,
      }
    );

    const tickets = user.tickets;

    return {
      message: "Bus tickets retrieved successfully",
      data: tickets,
    };
  }

  async getBusTicket(userId: string, params: { ticketId: string }) {
    // Validate dto
    const { error } = GetUserBusTicketByIdDto.validate(params);
    if (error) throw error;

    // Destructure dto
    const { ticketId } = params;

    // Get user
    const user = await this.getUser({ id: userId });

    // Get ticket
    const ticket = await this.prisma.ticket.findFirst({
      where: {
        id: ticketId,
        userId: user.id,
      },
    });

    if (!ticket) throw new NotFound("Ticket not found");

    return {
      message: "Bus ticket retrieved successfully",
      data: ticket,
    };
  }

  async getWalletDetails(userId: string) {
    // Get user
    const user = await this.getUser(
      { id: userId },
      {
        wallet: {
          include: {
            transactions: true,
          },
        },
      }
    );

    const wallet = user.wallet;

    return {
      message: "Wallet details retrieved successfully",
      data: wallet,
    };
  }

  async getWalletBalance(userId: string) {
    // Get user
    const user = await this.getUser(
      { id: userId },
      {
        wallet: true,
      }
    );

    const balance = user.wallet.balance;

    return {
      message: "Wallet balance retrieved successfully",
      data: balance,
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

  private filterUser(user: User) {
    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      name: user.name,
    };
  }
}
