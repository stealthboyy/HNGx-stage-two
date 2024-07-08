import { Router } from "express";
import { AuthMiddleWare } from "../../middlewares";
import { OrganisationController } from "./organisation.controller";

const router = Router();
const path = "/organisations";

router.get(
  "/",
  AuthMiddleWare.jwtProtect,
  OrganisationController.getOrganisations
);

router.get(
  "/:orgId",
  AuthMiddleWare.jwtProtect,
  OrganisationController.getOrganisation
);

router.post(
  "/",
  AuthMiddleWare.jwtProtect,
  OrganisationController.createOrganisation
);

router.post(
  "/:orgId/users",
  OrganisationController.addUserToOrganisation
);

export { router, path };
