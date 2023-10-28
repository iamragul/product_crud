import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@utils/interfaces/controller.interface';
import HttpException from '@utils/exceptions/http.exception';
import validationMiddleware from '@middleware/validation.middleware';
import validate from '@resources/user/user.validation';
import authenticated from '@middleware/authenticated.middleware';
import UserModel from '@resources/user/user.model';
import { createToken } from '@utils/token';

class UserController implements Controller {
  public path = '/user';
  public router = Router();
  private user = UserModel;

  constructor() {
    this.initialiseRoutes();
  }

  private initialiseRoutes(): void {
    this.router.post(`${this.path}/register`, validationMiddleware(validate.register), this.register);
    this.router.post(`${this.path}/login`, validationMiddleware(validate.login), this.login);
    this.router.get(`${this.path}`, authenticated, this.getUser);
  }

  private register = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { name, email, password, role } = req.body;

      const userEmailCheck = await this.user.findOne({
        email: email,
      });

      if (userEmailCheck?.email === email) {
        return next(new HttpException(400, 'email already exists'));
      }

      const user = await this.user.create({
        name,
        email,
        password,
        role,
      });

      const accessToken = createToken(user);

      res.status(201).json({ user, accessToken });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };

  private login = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { email, password } = req.body;

      const user = await this.user.findOne({ email });

      if (!user) {
        return next(new HttpException(404, 'Unable to find user with that email address'));
      }

      if (await user.isValidPassword(password)) {
        res.status(200).json({
          message: 'logged in successfully',
          user: user,
          accessToken: createToken(user),
        });
      } else {
        return next(new HttpException(400, 'Wrong credentials given'));
      }
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };

  private getUser = (req: Request, res: Response, next: NextFunction): Response | void => {
    if (!req.user) {
      return next(new HttpException(404, 'No logged in user'));
    }

    res.status(200).send({ data: req.user });
  };
}

export default UserController;
