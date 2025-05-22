// src/data-source.ts
import { DataSource } from "typeorm"
import { User } from "./users/entities/user.entity"

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "authdb",
  entities: [User],
  synchronize: true,
})
