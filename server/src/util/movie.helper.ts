import movieModel from "../model/movie.model";

export async function shouldSkipFetching(totalResults: number, searchTerm: string, year: number): Promise<boolean> {
  const existingCount = await movieModel.countMovies(searchTerm, year);

  if (existingCount >= totalResults) {
    console.log(`Skipping fetch: Database already contains all ${totalResults} movies for "${searchTerm}" (${year}).`);
    return true;
  }

  console.log(
    `Fetching remaining ${totalResults - existingCount} movies for "${searchTerm}" (${year}) to complete the database.`,
  );
  return false;
}
