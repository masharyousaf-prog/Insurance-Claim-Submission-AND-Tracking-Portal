require("dotenv").config();
const { DataSource } = require("typeorm");

const User = require("../entities/User");
const Claim = require("../entities/Claim");
const Comment = require("../entities/Comment");

const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "insurance_db",
  synchronize: true, 
  logging: true, 
  entities: [User, Claim, Comment],
});

module.exports = AppDataSource;