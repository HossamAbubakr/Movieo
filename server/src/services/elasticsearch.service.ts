import { MovieDetails } from "../core/entity/movie.entity";
import { Client } from "@elastic/elasticsearch";

const INDEX_NAME = "movies";
const ELASTICSEARCH_HOST = process.env.ELASTICSEARCH_URL || "http://localhost:9200";

const elasticClient = new Client({ node: ELASTICSEARCH_HOST });

export const createIndexIfNotExists = async () => {
  if (!(await elasticClient.indices.exists({ index: INDEX_NAME }))) {
    await elasticClient.indices.create({
      index: INDEX_NAME,
      body: {
        mappings: {
          properties: {
            imdbID: { type: "keyword" },
            title: { type: "text" },
            director: { type: "text" },
            plot: { type: "text" },
            poster: { type: "text" },
          },
        },
      },
    });
  }
};

export const indexMovies = async (movies: MovieDetails[]) => {
  if (!movies.length) return;

  const body = movies.flatMap((m) => [{ index: { _index: INDEX_NAME, _id: m.imdb_id } }, m]);

  try {
    const { errors, items } = await elasticClient.bulk({ refresh: true, body });
    if (errors) console.error("Indexing errors:", items);
    else console.log(`Indexed ${movies.length} movies.`);
  } catch (error) {
    console.error("Bulk index request failed:", error);
  }
};

export const searchMovies = async (query: string, page: number = 1, size: number = 10) => {
  const from = (page - 1) * size;

  const response = await elasticClient.search({
    index: INDEX_NAME,
    from,
    size,
    query: {
      multi_match: {
        query,
        fields: ["title", "director", "plot"],
      },
    },
  });

  const totalHits = typeof response.hits.total === "object" ? response.hits.total.value : (response.hits.total ?? 0);

  return {
    movies: response.hits.hits.map(({ _source }) => _source),
    total: totalHits,
    page,
    size,
    totalPages: Math.ceil(totalHits / size),
  };
};
