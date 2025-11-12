import 'dotenv/config';
import { DataSource } from 'typeorm';
import { databaseConfig } from './database.config';
import { join } from 'path';

export const AppDataSource = new DataSource({
  ...databaseConfig,
  entities: [join(__dirname, '/../**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, '/migrations/**/*{.ts,.js}')],
});
