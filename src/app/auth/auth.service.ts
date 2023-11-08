import { PrismaClient, User } from "@prisma/client";
import { CreateAccountDto, LoginDto } from "./dto/request.dto";
import bcrypt from "bcryptjs";
import { JwtService } from "../../utils";
import { BadRequest } from "http-errors";

export class AuthService {
  constructor(private prisma: PrismaClient, private jwtService: JwtService) {}

  async signup(dto: {
    email: string;
    password: string;
    name: string;
    phone: string;
  }) {
    // Validate dto
    const { error } = CreateAccountDto.validate(dto);

    if (error) throw error;

    // Destructure dto
    const { email, password, name, phone } = dto;

    // Check if email or phone already exists
    const credentialExist = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
    });

    if (credentialExist) throw new BadRequest("Email or Phone already exists");

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        phone,
        name,
      },
    });

    // create wallet
    await this.prisma.wallet.create({
      data: {
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    const filteredUser = this.filterUser(user);

    return {
      message: "Account created successfully",
      data: filteredUser,
    };
  }

  async login(dto: { emailOrPhone: string; password: string }) {
    // Validate dto
    const { error } = LoginDto.validate(dto);

    if (error) throw error;

    // Destructure dto
    const { emailOrPhone, password } = dto;

    // Check if email or phone already exists
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: emailOrPhone }, { phone: emailOrPhone }],
      },
    });

    if (!user) throw new BadRequest("Email or phone incorrect");

    // compare password
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) throw new BadRequest("Password is incorrect");

    // generate token
    const token = await this.jwtService.signJWT(user.id);

    const filteredUser = this.filterUser(user);
    return {
      message: "Login successful",
      data: {
        token,
        user: filteredUser,
      },
    };
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
