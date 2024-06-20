const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const dbConnect = require("./dbConnect");
const cookieparser = require("cookie-parser");
const authRouter = require("./routers/authRouter");
dotenv.config("/.env");

//Middlewares
const app = express();
app.use(morgan("common"));
app.use(express.json());
app.use(cookieparser());

// Routers

app.use("/auth", authRouter);
const PORT = process.env.PORT;
dbConnect();
app.listen(PORT, () => {
  console.log(`Connected Successfully: ${PORT}`);
});
