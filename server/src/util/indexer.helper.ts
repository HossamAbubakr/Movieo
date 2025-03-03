import { MovieService } from "../services/movie.service";

export const indexMovies = async () => {
  try {
    const movieService = new MovieService();
    await movieService.saveMovies("Space", 2020);
    console.log(`All Done.`);
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
};
