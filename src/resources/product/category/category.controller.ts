import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@utils/interfaces/controller.interface';
import HttpException from '@utils/exceptions/http.exception';
import validationMiddleware from '@middleware/validation.middleware';
import validate from '@resources/product/category/category.validation';
import authenticated from '@middleware/authenticated.middleware';
import CategoryModel from '@resources/product/category/category.model';
import { ObjectId } from '@utils/utils';
import { isAuthorized } from '@middleware/isAuthorized.middleware';

class CategoryController implements Controller {
  public path = '/product/category';
  public router = Router();
  private categoryModel = CategoryModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      `${this.path}/create`,
      authenticated,
      isAuthorized({ hasRole: ['admin'] }),
      validationMiddleware(validate.createCategory),
      this.createCategory,
    );
    this.router.get(`${this.path}/getAll`, this.getAllCategories);
    this.router.put(`${this.path}/update/:id`, this.updateCategory);
    this.router.delete(`${this.path}/delete/:id`, this.deleteCategory);
  }

  private createCategory = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { app, name } = req.body;

      const nameCheck = await this.categoryModel.findOne({
        app: app,
        name: name,
        active: true,
      });

      if (nameCheck?.name === name) {
        return next(new HttpException(400, 'category already exists'));
      }

      const category = await this.categoryModel.create(req.body);

      res.status(200).json({
        message: 'category created successfully',
        category: category,
      });
    } catch (error: any) {
      next(new HttpException(500, error.message));
    }
  };

  private getAllCategories = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const page = req.query.page || 1;
      const limit = req.query.limit || 10;

      const options = {
        page: page,
        limit: limit,
        lean: true,
        sort: {
          createdAt: 'desc',
        },
      };

      const query = {
        active: true,
      };

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const category = await this.categoryModel.paginate(query, options);

      if (category === null) {
        return next(new HttpException(404, 'category not found'));
      }

      res.status(200).json({ message: 'categories fetched successfully', category: category });
    } catch (error: any) {
      next(new HttpException(500, error.message));
    }
  };

  private updateCategory = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { id } = req.params;
      const body = req.body;

      if (!ObjectId.isValid(id as string)) {
        return next(new HttpException(400, 'invalid category id'));
      }

      const category = await this.categoryModel.findOneAndUpdate(
        {
          _id: new ObjectId(id),
          active: true,
        },
        body,
      );
      if (category === null) {
        return next(new HttpException(404, 'category not found'));
      }
      const updatedCategory = await this.categoryModel.findOne({
        _id: new ObjectId(id),
        active: true,
      });

      res.status(200).json({
        message: 'category updated successfully',
        category: updatedCategory,
      });
    } catch (error: any) {
      next(new HttpException(500, error.message));
    }
  };

  private deleteCategory = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { id } = req.params;

      if (!ObjectId.isValid(id as string)) {
        return next(new HttpException(400, 'invalid category id'));
      }

      const update = {
        active: false,
      };

      const category = await this.categoryModel.findOneAndUpdate(
        {
          _id: new ObjectId(id),
          active: true,
        },
        update,
      );
      if (category === null) {
        return next(new HttpException(404, 'category not found'));
      }

      res.status(200).json({ message: 'category deleted successfully' });
    } catch (error: any) {
      next(new HttpException(500, error.message));
    }
  };
}

export default CategoryController;
