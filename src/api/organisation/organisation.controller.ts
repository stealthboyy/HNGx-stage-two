import { Request, Response, NextFunction } from "express";
import { OrganisationService } from "./organisation.service";
import { ResponseService } from "../../utils";

export class OrganisationController {
  static async getOrganisations(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const container = req.container;
      const organisationService = container.get<OrganisationService>(
        "service.OrganisationService"
      );
      const responseService = container.get<ResponseService>(
        "service.ResponseService"
      );

      const userId = req.user["userId"];

      const { message, data } = await organisationService.getOrganisations(
        userId
      );

      return responseService.okResponse(res, message, data);
    } catch (error) {
      next(error);
    }
  }

  static async getOrganisation(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const container = req.container;
      const organisationService = container.get<OrganisationService>(
        "service.OrganisationService"
      );
      const responseService = container.get<ResponseService>(
        "service.ResponseService"
      );

      const userId = req.user["userId"];
      const { orgId } = req.params;

      const { message, data } = await organisationService.getOrganisation(
        userId,
        orgId
      );

      return responseService.okResponse(res, message, data);
    } catch (error) {
      next(error);
    }
  }

  static async createOrganisation(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const container = req.container;
      const organisationService = container.get<OrganisationService>(
        "service.OrganisationService"
      );
      const responseService = container.get<ResponseService>(
        "service.ResponseService"
      );

      const userId = req.user["userId"];
      const dto = req.body;

      const { message, data } = await organisationService.createOrganisation(
        userId,
        dto
      );

      return responseService.createdResponse(res, message, data);
    } catch (error) {
      next(error);
    }
  }

  static async addUserToOrganisation(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const container = req.container;
      const organisationService = container.get<OrganisationService>(
        "service.OrganisationService"
      );
      const responseService = container.get<ResponseService>(
        "service.ResponseService"
      );

      const { orgId } = req.params;
      const dto = req.body;

      const { message } = await organisationService.addUserToOrganisation(
        orgId,
        dto
      );

      return responseService.okResponse(res, message);
    } catch (error) {
      next(error);
    }
  }
}
