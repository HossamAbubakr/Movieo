import express from "express";
import movieRoutes from "./movie.routes";

const routes = express.Router();

routes.get("/", (_, res) => {
  res.send("Welcome to the Movie Database API!");
});

routes.use("/movies", movieRoutes);

export default routes;
