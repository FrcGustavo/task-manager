import express, { Application } from 'express';
import morgan from 'morgan';
import path from 'path';
import connectDatabase from './lib/sequelize';

export class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.config();
    connectDatabase();
  }

  config() {
    this.app.use(
      express.static(path.join(__dirname, '..', '..', 'web', 'build'))
    );
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(morgan('dev'));
  }
}
