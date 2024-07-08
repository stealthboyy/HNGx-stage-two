import { Response } from "express";

export class ResponseService {
  createdResponse(res: Response, message: string, data: any) {
    return res.status(201).json({
      status: "success",
      message,
      data,
    });
  }

  okResponse(res: Response, message: string, data?: any) {
    return res.status(200).json({
      status: "success",
      message,
      data,
    });
  }

  badRequestResponse(res: Response, message: string, errors?: any) {
    return res.status(400).json({
      status: "error",
      message,
      errors,
    });
  }

  unauthorizedResponse(res: Response, message: string) {
    return res.status(401).json({
      status: "error",
      message,
    });
  }

  forbiddenResponse(res: Response, message: string) {
    return res.status(403).json({
      status: "error",
      message,
    });
  }

  notFoundResponse(res: Response, message: string) {
    return res.status(404).json({
      status: "error",
      message,
    });
  }

  internalServerErrorResponse(res: Response, message?: string) {
    return res.status(500).json({
      status: "error",
      message: message || "Internal server error",
    });
  }

  validationErrorResponse(res: Response, errors: any) {
    return res.status(422).json({
      status: "error",
      errors,
    });
  }
}
