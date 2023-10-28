import express, { Application, json, urlencoded } from 'express';
import mongoose from 'mongoose';
import compression from 'compression';
import cors from 'cors';
import morgan from 'morgan';
import Controller from '@utils/interfaces/controller.interface';
import ErrorMiddleware from '@middleware/error.middleware';
import helmet from 'helmet';

class App {
  public express: Application;
  public port: number;

  constructor(controllers: Controller[], port: number) {
    this.express = express();
    this.port = port;

    this.initialiseDatabaseConnection();
    this.initialiseMiddleware();
    this.initialiseControllers(controllers);
    this.initialiseErrorHandling();
  }

  private initialiseMiddleware(): void {
    this.express.use(helmet());
    this.express.use(cors());
    this.express.use(morgan('dev'));
    this.express.use(json());
    this.express.use(urlencoded({ extended: false }));
    this.express.use(compression());
  }

  private initialiseControllers(controllers: Controller[]): void {
    this.express.get('/', (req, res) => {
      return res.status(200).json({
        message: 'Hello! Welcome to Node Js Typescript Backend',
      });
    });
    controllers.forEach((controller: Controller) => {
      this.express.use('/api', controller.router);
    });
  }

  private initialiseErrorHandling(): void {
    this.express.use(ErrorMiddleware);
  }

  private async initialiseDatabaseConnection(): Promise<void> {
    const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH } = process.env;

    try {
      mongoose.set('strictQuery', true);

      await mongoose.connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`);

      console.log('::::-- Mongo db connected successfully --::::');
    } catch (e: any) {
      return console.log('::::-- Mongo db not connected --::::', e);
    }
  }

  public listen(): void {
    this.express.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }
}

export default App;
