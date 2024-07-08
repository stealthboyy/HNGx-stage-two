import { PrismaClient } from "@prisma/client";
import { ContainerBuilder } from "node-dependency-injection";
import { AuthService } from "../api/auth/auth.service";
import { UserService } from "../api/user/user.service";
import { JwtService, ResponseService } from "../utils";
import { OrganisationService } from "../api/organisation/organisation.service";

// Init services
export function di(): ContainerBuilder {
  const container = new ContainerBuilder();

  // Register services
  container.register("service.PrismaService", PrismaClient);

  container.register("service.JwtService", JwtService);

  container.register("service.ResponseService", ResponseService);

  container
    .register("service.AuthService", AuthService)
    .addArgument(container.get("service.PrismaService"))
    .addArgument(container.get("service.JwtService"));

  container
    .register("service.UserService", UserService)
    .addArgument(container.get("service.PrismaService"));

  container
    .register("service.OrganisationService", OrganisationService)
    .addArgument(container.get("service.PrismaService"));

  return container;
}
