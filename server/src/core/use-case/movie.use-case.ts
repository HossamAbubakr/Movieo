import { Status } from "../entity/status.entity";

export interface MovieUseCase {
  saveMovies(searchTerm: string, year: number, batchSize?: number): Promise<Status<void>>;
}
