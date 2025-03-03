# 🎬 Movieo

Movieo is a powerful full-stack movie search and indexing application built with React, TypeScript, Node.js, Prisma, and Elasticsearch. It allows users to efficiently fetch, save, and index movies from the OMDB API based on a search term and year.

## 🚀 Features

- **Movie Search & Details** – Quickly search for movies and view detailed information.
- **Efficient Data Fetching** – Pull, save, and index movies from OMDB efficiently.
- **Debounced Search** – Optimized search experience with reduced API calls.
- **PostgreSQL Database** – Persistent movie storage.
- **Elasticsearch Integration** – Fast and intelligent search with n-grams for partial matching.
- **Docker Support** – Easily run the project using Docker.

---

## 🛠️ Setup Guide

### 📌 Prerequisites

Ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (Recommended: v20.9+)
- [PostgreSQL](https://www.postgresql.org/download/) – Required for local setup
- [Elasticsearch](https://www.elastic.co/downloads/elasticsearch) – Required for local setup

### 🔑 Obtaining an OMDB API Key

Get your API key from: [OMDB API](https://www.omdbapi.com/apikey.aspx)

### ⚙️ Running Locally

1. Clone the repository:

   ```sh
   git clone https://github.com/hossamabubakr/movieo.git
   cd movieo
   ```

2. Install dependencies:

   ```sh
   npm run install:local
   ```

3. Create and configure environment files:

   - In the `server/` folder, create a `.env` file:
     ```sh
     BACKEND_PORT=<port_number> # Port for the backend server
     POSTGRES_USER=<postgres_user> # PostgreSQL username
     POSTGRES_PASSWORD=<postgres_password> # PostgreSQL password
     POSTGRES_DB=<database_name> # Database name for PostgreSQL
     ELASTICSEARCH_URL=<elasticsearch_url> # URL of the Elasticsearch instance
     OMDB_API_KEY=<your_omdb_api_key> # API key for OMDB API
     ```
   - In the `client/` folder, create a `.env` file:
     ```sh
     VITE_API_URL=http://localhost:5000/api
     ```

4. Start the application:

   ```sh
   npm run start:local
   ```

---

### 🐳 Running with Docker

1. Clone the repository:

   ```sh
   git clone https://github.com/hossamabubakr/movieo.git
   cd movieo
   ```

2. Create a `.env` file in the root directory:

   ```sh
     # Backend
     BACKEND_PORT=<port_number>
     POSTGRES_USER=<postgres_user>
     POSTGRES_PASSWORD=<postgres_password>
     POSTGRES_DB=<database_name>
     ELASTICSEARCH_URL=<elasticsearch_url>
     OMDB_API_KEY=<your_omdb_api_key>

     # Frontend
     FRONTEND_PORT=<frontend_port>
     API_URL=<backend_url>
   ```

3. Build and start the containers:

   ```sh
   npm run build
   ```

4. Check logs (optional):

   ```sh
   npm run logs
   ```

5. Stop the application:

   ```sh
   npm run stop
   ```

---

## ✏️ Customizations

### Pulling Info

Feel free to edit the indexing function parameters in

```
    server\src\util\indexer.helper.ts
```

To customize the term and release year of the movies.

## 🧪 Testing

A full suite of tests is included for both server and client

You can run the tests for the server/client individually or together using the following commands

```
    npm run test # combined test
    npm run test:server
    npm run test:client
```

## 🏗️ Architecture

Included with the project is a design/architecture design [documentation](DESIGN.md)

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 📜 License

This project is licensed under the MIT License.
