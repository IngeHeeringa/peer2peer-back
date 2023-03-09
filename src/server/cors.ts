import "../loadEnvironment.js";
import type cors from "cors";

const allowedOrigins = [
  "http://localhost:4000",
  "http://localhost:4200",
  process.env.DEPLOY_ORIGIN_URL!,
];

const options: cors.CorsOptions = {
  origin: allowedOrigins,
};

export default options;
