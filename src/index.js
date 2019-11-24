import bodyParser from "body-parser";
import logger from "morgan";

import app from "./app";
import { ENV } from "./config";
const { NODE_ENV, PORT } = ENV;
import { apiRoutes } from "./routes";
import cors from "cors";

app.express.use(cors());
app.express.use(bodyParser.json());
app.express.use(bodyParser.urlencoded({ extended: true }));

if (NODE_ENV == "developer") {
  app.express.use(logger("dev"));
}

(async () => {
  app.mountRoutes(apiRoutes);
  app.start(PORT);
})();
