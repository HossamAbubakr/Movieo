import express from "express";
import { MovieController } from "../controllers/movie.controller";

const movieRoutes = express.Router();

movieRoutes.get("/", MovieController.search);

export default movieRoutes;
