import { Options } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();
export const db: Options = {
  dialect: 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
};

export default {
  db,
};
