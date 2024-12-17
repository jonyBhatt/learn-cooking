import { Request, Response, NextFunction } from "express";

class AppError extends Error {
  status: string;
  statusCode: number;
  inOptional: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.inOptional = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Error Interface
interface IError {
  err: AppError;
  req: Request;
  res: Response;
  next: NextFunction;
}

const errorHandler = ({ err, req, res, next }: IError) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message || "An unexpected error occurred",
    });
  }
};

export { AppError, errorHandler };
export default errorHandler;
