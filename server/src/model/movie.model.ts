import { PrismaClient } from "@prisma/client";
import { DbMovie } from "../core/entity/movie.entity";

const db = new PrismaClient();

const movieModel = {
  upsertMovies: async (movies: DbMovie[]) => {
    return db.$transaction(
      movies.map((movie) =>
        db.movie.upsert({
          where: { imdb_id: movie.imdb_id },
          update: movie,
          create: movie,
        }),
      ),
    );
  },

  async countMovies(term: string, year: number): Promise<number> {
    return db.movie.count({
      where: { year, term },
    });
  },
};

export default movieModel;
