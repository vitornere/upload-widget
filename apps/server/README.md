# Upload Widget Server API

This project provides an API for uploading images to Cloudflare using a Fastify-based server. It supports file upload functionality with validation, and provides routes to manage and retrieve uploaded files.

## Features

- **Image Upload**: Upload image files to Cloudflare.
- **File Retrieval**: Retrieve previously uploaded images.
- **Cloudflare Integration**: Integrates with Cloudflare's storage service for file hosting.
- **Swagger Documentation**: API documentation available at `/docs`.

## Getting Started

### Prerequisites

- Node.js (>=16.x)
- Docker (for PostgreSQL database setup)
- Cloudflare account with Access Key and Secret Key

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/upload-widget.git
   cd upload-widget
   ```

2. Install dependencies:

    ```bash
    pnpm install
    ```

3. Set up environment variables by copying the .env.example file to .env and updating it with your Cloudflare account credentials:

    ```bash
    cp .env.example .env
    ```

    Add your Cloudflare account credentials in the .env file:

    ```bash
    CLOUDFLARE_ACCOUNT_ID=your_account_id
    CLOUDFLARE_ZONE_ID=your_zone_id
    CLOUDFLARE_ACCESS_KEY=your_access_key
    CLOUDFLARE_SECRET_KEY=your_secret_key
    ```

4. Run PostgreSQL using Docker:

   ```bash
   docker-compose up -d
   ```

5. Run the server:

    ```bash
    pnpm dev
    ```

    The server will start at <http://localhost:3333>.

   ## Available Routes

    - **POST** `/uploads`: Upload an image to Cloudflare. The image will be validated, and upon successful upload, the image's URL will be returned.
    - **GET** `/uploads`: Retrieve a list of all uploaded files.
    - **Swagger UI**: API documentation available at `/docs`.

## Testing

To run the tests for the project, use:

```bash
pnpm test
```

## Database Setup

The project uses PostgreSQL to store metadata about uploaded files. The database is initialized via a Docker container, and you can configure the schema in the `docker/init.sql` file.

Run the following command to apply migrations:

```bash
pnpm db:migrate
```

## Environment Variables

The `.env` file should contain the following variables:

- `PORT`: The port the API server will run on (default: 3333).
- `NODE_ENV`: The environment (default: development).
- `DATABASE_URL`: The connection URL for PostgreSQL (default: postgresql://docker:docker@localhost:5432/upload).
- `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID.
- `CLOUDFLARE_ACCESS_KEY_ID`: Your Cloudflare access key.
- `CLOUDFLARE_SECRET_ACCESS_KEY`: Your Cloudflare secret key.
- `CLOUDFLARE_BUCKET`: The Cloudflare bucket name for uploads.
- `CLOUDFLARE_PUBLIC_URL`: The public URL for uploaded images.

## Directory Structure

```bash
.
├── pnpm-lock.yaml
├── docker
│   └── init.sql                  # Database initialization script
├── vite.config.mjs               # Vite configuration for bundling
├── .env.test                     # Test environment variables
├── .editorconfig
├── .dockerignore
├── .gitignore
├── package.json
├── .env                          # Environment variables
├── .nvmrc
├── lefthook.yml                  # Lefthook configuration for Git hooks
├── tsconfig.json                 # TypeScript configuration
├── docker-compose.yml            # Docker compose for running PostgreSQL
├── drizzle.config.ts             # Drizzle ORM configuration
├── .vscode
│   ├── settings.json             # VSCode settings
│   └── extensions.json           # Recommended VSCode extensions
├── biome.json                    # Biome configuration for code quality checks
├── src
│   ├── infra
│   │   ├── storage
│   │   │   ├── upload-file-to-storage.ts # Logic for uploading to Cloudflare
│   │   │   └── client.ts                # Cloudflare client setup
│   │   ├── http
│   │   │   ├── transform-swagger-schema.ts # Swagger schema transformation
│   │   │   ├── server.ts               # Fastify server setup
│   │   │   └── routes
│   │   │       ├── get-uploads.ts      # Endpoint for retrieving uploads
│   │   │       └── upload-image.ts    # Endpoint for uploading images
│   │   ├── db
│   │   │   └── migrations
│   │   ├── schemas
│   │   └── index.ts
│   ├── app
│   │   ├── functions
│   │   └── errors
│   └── shared
│       └── either.ts
└── test
    └── factories
```
