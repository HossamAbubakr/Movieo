-- CreateTable
CREATE TABLE "Movie" (
    "id" SERIAL NOT NULL,
    "imdb_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "director" TEXT,
    "poster" TEXT NOT NULL,
    "plot" TEXT,
    "term" TEXT NOT NULL,
    "year" INTEGER NOT NULL,

    CONSTRAINT "Movie_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Movie_imdb_id_key" ON "Movie"("imdb_id");
