require("dotenv").config();
const { DataSource } = require("typeorm");

const User = require("../entities/User");
const Claim = require("../entities/Claim");
const Comment = require("../entities/Comment");

const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: true, // auto create tables
  logging: false,
  entities: [User, Claim, Comment],
});

module.exports = AppDataSource;