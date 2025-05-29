import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from '../models/User';
import 'dotenv/config';

const dbConfig: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true,
  logging: process.env.NODE_ENV === 'development',
  entities: [User],
  migrations: [],
  subscribers: [],
};

export const AppDataSource = new DataSource(dbConfig);
