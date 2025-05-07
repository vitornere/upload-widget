# Upload Widget Monorepo

This repository is a monorepo that houses the **Upload Widget** project—both the Fastify-based server API for uploading images to Cloudflare and a React client application. It also provides a structure to share libraries and utilities across these projects.

---

## Projects

- **Server API (`apps/server`)**  
  *See the README in `apps/client` for detailed instructions.*

- **Client Application (`apps/client`)**  
  A React client that interacts with the Upload Widget API to upload images and display results.  
  *See the README in `apps/client` for detailed instructions.*

## Directory Structure

```sh
monorepo/
├── apps/
│   ├── server/                  # Fastify API for image uploads
│   └── client/                  # React client application
├── iac/                         # Infrastructure as Code for AWS using Pulumi
├── .github/                     # GitHub workflows, issue templates, etc.
├── .vscode/                     # VSCode workspace settings
└── README.md                    # This file
```
