import { PrismaClient, User } from "@prisma/client";
import {
  CreateAccountDto,
  ICreateAccountDto,
  ILoginDto,
  LoginDto,
} from "./dto";
import bcrypt from "bcryptjs";
import { JwtService } from "../../utils";
import { BadRequest } from "http-errors";

export class AuthService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly jwtService: JwtService
  ) {}

  async signup(dto: ICreateAccountDto) {
    // Validate dto
    const { error } = CreateAccountDto.validate(dto, {
      abortEarly: false,
    });

    if (error) throw error;

    // Destructure dto
    const { password, ...rest } = dto;

    // Check if email or phone already exists
    const credentialExist = await this.prisma.user.findFirst({
      where: {
        email: rest.email,
      },
    });

    if (credentialExist)
      throw new BadRequest("Registration unsuccessful, email already exists");

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        password: hashedPassword,
        ...rest,
        organisations: {
          create: {
            name: `${rest.firstName}'s Organisation`,
          },
        },
      },
      select: {
        userId: true,
        email: true,
        phone: true,
        firstName: true,
        lastName: true,
      },
    });

    // generate token
    const token = await this.jwtService.signJWT(user.userId);

    return {
      message: "Registration successful",
      data: {
        accessToken: token,
        user: user,
      },
    };
  }

  async login(dto: ILoginDto) {
    // Validate dto
    const { error } = LoginDto.validate(dto, {
      abortEarly: false,
    });

    if (error) throw error;

    // Destructure dto
    const { email, password } = dto;

    // Check if email already exists
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
      select: {
        userId: true,
        email: true,
        phone: true,
        firstName: true,
        lastName: true,
        password: true,
      },
    });

    if (!user) throw new BadRequest("Authentication failed, email not found");

    // compare password
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch)
      throw new BadRequest("Authentication failed, Password is incorrect");

    // generate token
    const token = await this.jwtService.signJWT(user.userId);

    delete user.password;

    return {
      message: "Login successful",
      data: {
        accessToken: token,
        user: user,
      },
    };
  }

  // private filterUser(user: User) {
  //   return {
  //     id: user.id,
  //     email: user.email,
  //     phone: user.phone,
  //     name: user.name,
  //   };
  // }
}
