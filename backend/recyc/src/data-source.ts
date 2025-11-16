import { DataSource } from 'typeorm';
import { User } from './user.entity';
import { Article } from './article.entity';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'db_recyclage',
  entities: [User,Article  ],
  migrations: ['src/migrations/*.ts'],
  synchronize: false, 
  logging: true,
});
