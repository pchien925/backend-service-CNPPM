import 'dotenv/config';
import { DatabaseConfig } from './database-config.type';

export const databaseConfig: DatabaseConfig = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '11223344',
  database: process.env.DB_NAME || 'nestjs_base',
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
  logging: process.env.DB_LOGGING === 'true' || process.env.NODE_ENV !== 'prod',
  migrationsRun: process.env.DB_MIGRATIONS_RUN === 'true' || false,
};
