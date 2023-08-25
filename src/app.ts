import "express-async-errors";
import express, { Application } from "express";
import handleMiddlewares from "./midllewares/handle.middlewares";
import routes from "./router/routes";

const app: Application = express();

app.use(express.json());
app.use(routes);
app.use(handleMiddlewares.error);

export default app;
