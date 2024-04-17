import express from "express";
import connectDb from "./DB/ConnectDb.js";
import AuthRoute from "./Routes/AuthRoute.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api", AuthRoute);

connectDb()
  .then((res) => {
    console.log("connection to database is successful");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(5000, () => {
  console.log("server is running");
});
