import { NextFunction, Request, Response } from 'express';
import HttpException from '@utils/exceptions/http.exception';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function errorMiddleware(error: HttpException, req: Request, res: Response, _next: NextFunction): void {
  const status = error.status || 500;
  const message = error.message || 'Something went wrong';
  res.status(status).send({
    status,
    message,
  });
}

export default errorMiddleware;
