import express from "express";
import morgan from "morgan";
import cors from "cors";
import options from "../cors";
import {
  generalError,
  notFoundError,
} from "./middlewares/errorMiddlewares/errorMiddlewares";

export const app = express();

app.disable("x-powered-by");

app.use(morgan("dev"));
app.use(cors(options));
app.use(express.json());

app.use(notFoundError);
app.use(generalError);
