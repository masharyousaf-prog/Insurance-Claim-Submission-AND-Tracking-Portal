require("dotenv").config();
require("reflect-metadata");

const express = require("express");
const cors = require("cors");

const AppDataSource = require("./config/db");

const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/claims", require("./routes/claimRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

app.use(errorHandler);

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected");

    app.listen(process.env.PORT, () => {
      console.log("Server running on port", process.env.PORT);
    });
  })
  .catch((err) => console.log(err));