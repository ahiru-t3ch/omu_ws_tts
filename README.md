# OMU WS TTS

Web app connected to OMU IA TTS.

**Voice cloning** is planned for this project and is **under construction** — the web UI will expose it once the OMU IA TTS API supports it.

## Configuration

Create a `.env.local` file (local development) or `.env` / `.env.local` (Docker Compose) at the project root:

```
TTS_API_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
API_URL=http://127.0.0.1:8001
DOWNLOAD_FLAG=true
NEXT_PUBLIC_TTS_TEXT_LIMIT=5000
```

- **TTS_API_TOKEN** and **API_URL** are required for the `/api/tts` route to work.
- With Docker, if the TTS API runs on the host machine, use `http://host.docker.internal:8001` by default (already the default in `docker-compose.yml` when `API_URL` is not set).

### Port 8001 (TTS API) and Coolify

On a VPS with **Coolify**, host port **8000** is often already used by the Coolify UI (`coolify` maps `8000->8080`). To avoid `Bind for 0.0.0.0:8000 failed: port is already allocated`, the TTS API should **not** publish `8000` on the host, or publish **`8001:8000`** (host port **8001** → application port **8000** in the container).

In the **omu_ia_tts** repo, update the API service `docker-compose.yml`: replace `8000:8000` with `8001:8000` (or remove `ports` if Coolify routes only through the proxy without host binding). This repo defaults to the API on host **8001** for local dev / Docker Desktop.

- **NEXT_PUBLIC_TTS_TEXT_LIMIT** is applied at Docker image **build** time (see below).

## Local development

```bash
npm install
npm run dev
```

## Docker

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose v2.

### Run with Compose

1. Set variables in `.env` or `.env.local` at the project root (Compose loads both files).
2. Build and start:

```bash
docker compose up --build
```

The app is available at [http://localhost:3000](http://localhost:3000).

To change the client-side text limit, set `NEXT_PUBLIC_TTS_TEXT_LIMIT` in `.env` **before** `docker compose build` (or `up --build`), because Next.js embeds it at build time.

### Image only (without Compose)

```bash
docker build \
  --build-arg NEXT_PUBLIC_TTS_TEXT_LIMIT=5000 \
  -t omu-ws-tts .

docker run --rm -p 3000:3000 \
  -e TTS_API_TOKEN=... \
  -e API_URL=http://host.docker.internal:8001 \
  -e DOWNLOAD_FLAG=true \
  omu-ws-tts
```
