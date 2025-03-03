import express from "express";
import cors from "cors";
import routes from "./routes/index";
import errorHandler from "./middleware/error.middleware";
import { indexMovies } from "./util/indexer.helper";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
  }),
);

app.use(express.json());

app.get("/", (req, res) => {
  res.redirect("/api");
});

app.use("/api", routes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  indexMovies();
  console.log(`Server is running on port ${PORT}`);
});
