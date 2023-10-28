import 'dotenv/config';
import 'module-alias/register';
import validateEnv from '@utils/validateEnv';
import App from './app';
import UserController from '@resources/user/user.controller';
import CategoryController from '@resources/product/category/category.controller';
import ProductController from '@resources/product/product.controller';

validateEnv();

const app = new App(
  [new UserController(), new CategoryController(), new ProductController()],
  Number(process.env.PORT),
);

app.listen();
