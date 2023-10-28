import { Request, NextFunction } from 'express';
import userModel from '@resources/user/user.model';
import HttpException from '@utils/exceptions/http.exception';

export function isAuthorized(opts: { hasRole: Array<'admin' | 'user'> }) {
  return async (req: Request, res: any, next: NextFunction) => {
    const { _id } = req.user;

    const user = await userModel.findOne({
      _id: _id,
      active: true,
    });

    if (user === null) {
      return next(new HttpException(404, 'user not found'));
    }

    if (opts.hasRole.includes(user.role)) return next();

    return next(new HttpException(401, 'Unauthorised'));
  };
}
