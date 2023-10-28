import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@utils/interfaces/controller.interface';
import HttpException from '@utils/exceptions/http.exception';
import validationMiddleware from '@middleware/validation.middleware';
import validate from '@resources/product/product.validation';
import authenticated from '@middleware/authenticated.middleware';
import Product from './product.model';
import { ObjectId } from '@utils/utils';
import { isAuthorized } from '@middleware/isAuthorized.middleware';

class ProductController implements Controller {
  public path = '/product';
  public router = Router();
  private product = Product;

  constructor() {
    this.initialiseRoutes();
  }

  private initialiseRoutes(): void {
    this.router.post(
      `${this.path}/create`,
      authenticated,
      isAuthorized({ hasRole: ['admin'] }),
      validationMiddleware(validate.create),
      this.createProduct,
    );
    this.router.get(`${this.path}/get/:id`, authenticated, this.getProduct);
    this.router.post(`${this.path}/getAll`, authenticated, this.getAllProduct);
    this.router.patch(
      `${this.path}/update/:id`,
      authenticated,
      isAuthorized({ hasRole: ['admin'] }),
      this.updateProduct,
    );
    this.router.delete(
      `${this.path}/delete/:id`,
      authenticated,
      isAuthorized({ hasRole: ['admin'] }),
      this.deleteProduct,
    );
  }

  private createProduct = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const body = req.body;

      const product = await this.product.create(body);

      res.status(200).json({
        message: 'product registered successfully',
        product: product,
      });
    } catch (error: any) {
      next(new HttpException(500, error.message));
    }
  };

  private getProduct = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { id } = req.params;

      if (!ObjectId.isValid(id as string)) {
        return next(new HttpException(400, 'invalid product id'));
      }

      const product = await this.product
        .findOne({
          _id: new ObjectId(id),
          active: true,
        })
        .populate({ path: 'category', select: 'name' });

      if (product === null) {
        return next(new HttpException(404, 'product not found'));
      }

      res.status(200).json({ message: 'product details', product: product });
    } catch (error: any) {
      next(new HttpException(500, error.message));
    }
  };

  private updateProduct = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { id } = req.params;
      const body = req.body;

      if (!ObjectId.isValid(id as string)) {
        return next(new HttpException(400, 'invalid product id'));
      }

      const product = await this.product.findOneAndUpdate(
        {
          _id: new ObjectId(id),
          active: true,
        },
        body,
      );
      if (product === null) {
        return next(new HttpException(404, 'product not found'));
      }
      const updateProduct = await this.product.findOne({
        _id: new ObjectId(id),
        active: true,
      });

      res.status(200).json({ message: 'product updated successfully', product: updateProduct });
    } catch (error: any) {
      next(new HttpException(500, error.message));
    }
  };

  private deleteProduct = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { id } = req.params;

      if (!ObjectId.isValid(id as string)) {
        return next(new HttpException(400, 'invalid product id'));
      }

      const update = {
        active: false,
      };

      const product = await this.product.findOneAndUpdate(
        {
          _id: new ObjectId(id),
          active: true,
        },
        update,
      );
      if (product === null) {
        return next(new HttpException(404, 'product not found'));
      }

      res.status(200).json({ message: 'product deleted successfully' });
    } catch (error: any) {
      next(new HttpException(500, error.message));
    }
  };
  private getAllProduct = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | Response<any, Record<string, any>>> => {
    try {
      const page = req.query.page || 1;
      const limit = req.query.limit || 10;
      const sort = req.query.limit || 'desc';
      const searchFields = req.body.search || '';

      let search = {};

      for (const property in searchFields) {
        const field = property;
        search = {
          ...search,
          [field]: { $regex: searchFields[property], $options: 'i' },
        };
      }

      const options = {
        page: page,
        limit: limit,
        lean: true,
        sort: {
          createdAt: sort,
        },
        populate: [
          {
            path: 'category',
            select: 'name',
          },
        ],
      };

      const query = {
        ...search,
      };

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const product = await this.product.paginate(query, options);

      res.status(200).json({ message: 'all product details', product: product });
    } catch (error: any) {
      next(new HttpException(500, error.message));
    }
  };
}

export default ProductController;
