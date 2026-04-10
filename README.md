# OMU WS TTS

Webapp connectée à OMU IA TTS.

## Configuration

Créer un fichier `.env.local` (développement) ou `.env` / `.env.local` (Docker Compose) à la racine du projet :

```
TTS_API_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
API_URL=http://127.0.0.1:8001
DOWNLOAD_FLAG=true
NEXT_PUBLIC_TTS_TEXT_LIMIT=5000
```

- **TTS_API_TOKEN** et **API_URL** sont obligatoires pour que l’API `/api/tts` fonctionne.
- Sous Docker, si l’API TTS tourne sur la machine hôte, utilisez par défaut `http://host.docker.internal:8001` (déjà la valeur par défaut dans `docker-compose.yml` si `API_URL` n’est pas défini).

### Port 8001 (API TTS) et Coolify

Sur un VPS avec **Coolify**, le port **8000** de l’hôte est souvent déjà utilisé par l’interface Coolify (`coolify` mappe `8000->8080`). Pour éviter le conflit `Bind for 0.0.0.0:8000 failed: port is already allocated`, l’API TTS doit **ne pas** publier `8000` sur l’hôte, ou publier **`8001:8000`** (port hôte **8001** → port applicatif **8000** dans le conteneur).

Dans le repo **omu_ia_tts**, adapte le `docker-compose.yml` du service API : remplace `8000:8000` par `8001:8000` (ou supprime `ports` si Coolify route uniquement via le proxy sans bind hôte). Ce dépôt pointe par défaut vers l’API sur le **8001** de l’hôte pour le dev local / Docker Desktop.
- **NEXT_PUBLIC_TTS_TEXT_LIMIT** est pris en compte au **build** de l’image Docker (voir ci‑dessous).

## Développement local

```bash
npm install
npm run dev
```

## Docker

### Prérequis

- [Docker](https://docs.docker.com/get-docker/) et Docker Compose v2.

### Lancer avec Compose

1. Définir les variables dans `.env` ou `.env.local` à la racine (Compose charge maintenant les deux fichiers).
2. Construire et démarrer :

```bash
docker compose up --build
```

L’application est disponible sur [http://localhost:3000](http://localhost:3000).

Pour changer la limite de texte côté client, définir `NEXT_PUBLIC_TTS_TEXT_LIMIT` dans `.env` **avant** `docker compose build` (ou `up --build`), car Next.js l’intègre au moment du build.

### Image seule (sans Compose)

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
