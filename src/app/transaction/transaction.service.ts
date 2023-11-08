import { Prisma, PrismaClient } from "@prisma/client";
import {
  FundWalletDto,
  GetTransactionDto,
  PayForBusTicketDto,
  TransactionQueryDto,
  TransferCreditDto,
} from "./dto";
import { NotFound, BadRequest } from "http-errors";

export class TransactionService {
  constructor(private prisma: PrismaClient) {}

  async getAllTransactions(
    userId: string,
    query: {
      page?: string;
      limit?: string;
      startDateTime?: string;
      endDateTime?: string;
    }
  ) {
    // Validate query
    const { error } = TransactionQueryDto.validate(query);

    if (error) throw error;

    // Implement pagination and query per date/time period.
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const filters: Prisma.TransactionWhereInput = {};

    // Parse the start and end date parameters from the query string
    const startDateTime = query.startDateTime
      ? new Date(query.startDateTime)
      : undefined;
    const endDateTime = query.endDateTime
      ? new Date(query.endDateTime)
      : undefined;

    if (startDateTime || endDateTime) {
      filters.createdAt = {
        gte: startDateTime,
        lte: endDateTime,
      };
    }

    // Get paginated and filtered transactions
    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        ...filters,
      },
      take: limit,
      skip: startIndex,
      orderBy: {
        createdAt: "desc",
      },
    });

    // Get inflow transaction data
    const inflowTransactions = transactions.filter(
      (transaction) => transaction.flow === "INFLOW"
    );
    const inflowTransactionsAmount = inflowTransactions.reduce(
      (acc, transaction) => acc + transaction.amount,
      0
    );

    // Get outflow transaction data
    const outflowTransactions = transactions.filter(
      (transaction) => transaction.flow === "OUTFLOW"
    );
    const outflowTransactionsAmount = outflowTransactions.reduce(
      (acc, transaction) => acc + transaction.amount,
      0
    );

    return {
      message: "Transactions retrieved successfully",
      data: {
        allTrx: transactions,
        inflow: {
          transactions: inflowTransactions,
          amount: inflowTransactionsAmount,
          count: inflowTransactions.length,
        },
        outflow: {
          transactions: outflowTransactions,
          amount: outflowTransactionsAmount,
          count: outflowTransactions.length,
        },
        meta: {
          page,
          limit,
          count: transactions.length,
        },
      },
    };
  }

  async getTransaction(userId: string, params: { transactionId: string }) {
    // Validate params
    const { error } = GetTransactionDto.validate(params);
    if (error) throw error;

    // Destructure params
    const { transactionId } = params;

    // Get user
    const user = await this.getUser({ id: userId });

    // Get transaction
    const transaction = await this.prisma.transaction.findFirst({
      where: {
        id: transactionId,
        userId: user.id,
      },
    });

    if (!transaction) throw new NotFound("Transaction not found");

    return {
      message: "Transaction retrieved successfully",
      data: transaction,
    };
  }

  async fundWallet(userId: string, dto: { amount: number }) {
    // Validate dto
    const { error } = FundWalletDto.validate(dto);
    if (error) throw error;

    // Destructure dto
    const { amount } = dto;

    // Get user
    const user = await this.getUser(
      { id: userId },
      {
        wallet: true,
      }
    );

    // Get wallet
    const wallet = user.wallet;

    // Update wallet balance
    const updatedWallet = await this.prisma.wallet.update({
      where: {
        id: wallet.id,
      },
      data: {
        balance: {
          increment: amount,
        },
      },
    });

    // Create transaction
    const reference = this.generateRandomReference();

    const transaction = await this.prisma.transaction.create({
      data: {
        amount,
        status: "COMPLETED",
        reference: reference,
        flow: "INFLOW",
        type: "WALLET_FUNDING",
        description: "Wallet funding",
        wallet: {
          connect: {
            id: wallet.id,
          },
        },
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    return {
      message: "Wallet funded successfully",
      data: {
        wallet: updatedWallet,
        transaction,
      },
    };
  }

  async payForBusTicket(userId: string, params: { ticketId: string }) {
    // Validate params
    const { error } = PayForBusTicketDto.validate(params);
    if (error) throw error;

    // Destructure dto
    const { ticketId } = params;

    // Get user
    const user = await this.getUser(
      { id: userId },
      {
        wallet: true,
      }
    );

    // Get wallet
    const wallet = user.wallet;

    // Get ticket
    const ticket = await this.prisma.ticket.findFirst({
      where: {
        id: ticketId,
      },
    });

    if (!ticket) throw new NotFound("Ticket not found");

    // Check if ticket is already paid for
    if (ticket.isPaid) throw new BadRequest("Ticket already paid for");

    // Check if user has enough balance
    if (wallet.balance < ticket.price)
      throw new BadRequest("Insufficient balance");

    // Update wallet balance
    await this.prisma.wallet.update({
      where: {
        id: wallet.id,
      },
      data: {
        balance: {
          decrement: ticket.price,
        },
      },
    });

    // Update ticket
    const updatedTicket = await this.prisma.ticket.update({
      where: {
        id: ticket.id,
      },
      data: {
        isPaid: true,
      },
    });

    // Create transaction
    const reference = this.generateRandomReference();

    await this.prisma.transaction.create({
      data: {
        amount: ticket.price,
        status: "COMPLETED",
        reference: reference,
        flow: "OUTFLOW",
        type: "TICKET_PAYMENT",
        description: "Ticket payment",
        wallet: {
          connect: {
            id: wallet.id,
          },
        },
        user: {
          connect: {
            id: user.id,
          },
        },
        ticket: {
          connect: {
            id: ticket.id,
          },
        },
      },
    });

    return {
      message: "Ticket paid for successfully",
      data: updatedTicket,
    };
  }

  async sendCredit(
    userId: string,
    dto: { amount: number; emailPhoneOrId: string }
  ) {
    // Validate dto
    const { error } = TransferCreditDto.validate(dto);
    if (error) throw error;

    // Destructure dto
    const { amount, emailPhoneOrId } = dto;

    // Get user
    const user = await this.getUser(
      { id: userId },
      {
        wallet: true,
      }
    );

    if (
      user.id === emailPhoneOrId ||
      user.email === emailPhoneOrId ||
      user.phone === emailPhoneOrId
    )
      throw new BadRequest("You cannot send credit to yourself");

    // Get recipient
    const recipient = await this.getUser(
      {
        OR: [
          { id: emailPhoneOrId },
          { email: emailPhoneOrId },
          { phone: emailPhoneOrId },
        ],
      },
      {
        wallet: true,
      }
    );

    // Get wallet
    const wallet = user.wallet;

    // Check if user has enough balance
    if (wallet.balance < amount) throw new BadRequest("Insufficient balance");

    // Update wallet balance
    await this.prisma.wallet.update({
      where: {
        id: wallet.id,
      },
      data: {
        balance: {
          decrement: amount,
        },
      },
    });

    // Update recipient wallet balance
    await this.prisma.wallet.update({
      where: {
        id: recipient.wallet.id,
      },
      data: {
        balance: {
          increment: amount,
        },
      },
    });

    // Create sender transaction
    const senderReference = this.generateRandomReference();

    const senderTrx = await this.prisma.transaction.create({
      data: {
        amount: amount,
        status: "COMPLETED",
        reference: senderReference,
        flow: "OUTFLOW",
        type: "CREDIT_TRANSFER",
        description: "Credit transfer",
        wallet: {
          connect: {
            id: wallet.id,
          },
        },
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    // Create recipient transaction
    const recipientReference = this.generateRandomReference();

    await this.prisma.transaction.create({
      data: {
        amount: amount,
        status: "COMPLETED",
        reference: recipientReference,
        flow: "INFLOW",
        type: "CREDIT_TRANSFER",
        description: "Credit transfer",
        wallet: {
          connect: {
            id: recipient.wallet.id,
          },
        },
        user: {
          connect: {
            id: recipient.id,
          },
        },
      },
    });

    return {
      message: "Credit transfer successful",
      data: {
        amount,
        transaction: senderTrx,
        recipient: {
          id: recipient.id,
          name: recipient.name,
        },
      },
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

  private generateRandomReference(length = 13) {
    return Array.from(Array(length), () =>
      Math.floor(Math.random() * 36).toString(36)
    ).join("");
  }
}
