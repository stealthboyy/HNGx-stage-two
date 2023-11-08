import express, { NextFunction, Request } from "express";
import useragent from "express-useragent";
import cors from "cors";
import compression from "compression";
import { router as baseRouter, path as basePath } from "./app.router";
import { di } from "./di";
import { Config } from "./config";
import { ContainerBuilder } from "node-dependency-injection";
import { ErrorMiddleware } from "./middlewares";
import { NotFound } from "http-errors";

declare global {
  namespace Express {
    interface Request {
      container: ContainerBuilder;
      user: Record<string, any>;
    }
  }
}

const port: string | number = Config.port;
const app = express();
app.use(express.json());
app.use(
  express.urlencoded({
    limit: "50mb",
    extended: true,
  })
);
app.use(compression());
app.use(useragent.express());
app.use<string, unknown>("*", cors());

//health check
app.get("/health", (_, res) => {
  res.status(200).json({
    status: "success",
    message: "Server is up and running",
  });
});

const container = di();
app.use("*", (req: Request, _, next: NextFunction) => {
  req.container = container;
  next();
});

app.use(basePath, baseRouter);

app.all("*", (req: Request, _, next: NextFunction) => {
  next(NotFound(`Cannot ${req.method} ${req.originalUrl}`));
});

app.use(ErrorMiddleware.globalErrorHandler);

export { app, port };
