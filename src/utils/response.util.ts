import { Response } from "express";

export class ResponseService {
  createdResponse(res: Response, message: string, data: any) {
    return res.status(201).json({
      success: true,
      statusCode: 201,
      message,
      data,
    });
  }

  okResponse(res: Response, message: string, data?: any) {
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message,
      data,
    });
  }

  badRequestResponse(res: Response, message: string, errors?: any) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message,
      errors,
    });
  }

  unauthorizedResponse(res: Response, message: string) {
    return res.status(401).json({
      success: false,
      statusCode: 401,
      message,
    });
  }

  forbiddenResponse(res: Response, message: string) {
    return res.status(403).json({
      success: false,
      statusCode: 403,
      message,
    });
  }

  notFoundResponse(res: Response, message: string) {
    return res.status(404).json({
      success: false,
      statusCode: 404,
      message,
    });
  }

  internalServerErrorResponse(res: Response, message?: string) {
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: message || "Internal server error",
    });
  }
}
