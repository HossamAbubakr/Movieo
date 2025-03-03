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

export const searchMovies = async (query: string) =>
  (
    await elasticClient.search({
      index: INDEX_NAME,
      query: { multi_match: { query, fields: ["title", "director", "plot"] } },
    })
  ).hits.hits.map(({ _source }) => _source);
