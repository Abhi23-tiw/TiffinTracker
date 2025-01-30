const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const colors = require("colors");
const morgan = require("morgan");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/v1/auth", require("./routes/userRoutes"));
app.use("/api/v1/tiffins", require("./routes/tiffinsRoutes"));
app.use("/api/v1/notifications", require("./routes/notificationRoutes"));
// PORT
const PORT = process.env.PORT || 8081;

// Listen
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`.bgGreen.white);
});
