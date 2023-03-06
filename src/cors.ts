import type cors from "cors";

const allowedOrigins = ["http://localhost:4000"];

const options: cors.CorsOptions = {
  origin: allowedOrigins,
};

export default options;
