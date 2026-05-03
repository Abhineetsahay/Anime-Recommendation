# 🎌 AniList — Anime Recommendation & List Sharing Platform

> A full-stack web app where users discover anime, build personal watchlists, share them via links, and get personalised recommendations powered by a custom ML model.

---

## 📌 Table of Contents

1. [Project Overview](#project-overview)
2. [How The System Works](#how-the-system-works)
3. [Tech Stack](#tech-stack)
4. [Architecture](#architecture)
5. [Database Design](#database-design)
6. [Authentication Flow](#authentication-flow)
7. [Feature Walkthrough](#feature-walkthrough)
8. [ML Recommender System](#ml-recommender-system)
9. [Azure Blob Storage](#azure-blob-storage)
10. [API Reference](#api-reference)
11. [Project Structure](#project-structure)
12. [Environment Variables](#environment-variables)
13. [Setup & Running Locally](#setup--running-locally)
14. [Interview Talking Points](#interview-talking-points)

---

## Project Overview

AniList lets users:

- **Sign up** and pick favourite genres on first login (onboarding)
- **Discover** anime via Jikan (MyAnimeList API) — trending, seasonal, top-rated, or personalised
- **Build watchlists** — add anime, set watch status, rate, track progress, add notes
- **Share lists** via a unique public link — collaborators can view and edit
- **Get recommendations** from a custom Python KNN + TF-IDF model served via FastAPI
- **Upload avatars** stored on Azure Blob Storage
- **Update settings** — profile info, genre preferences, password

---

## How The System Works

### The Big Picture

```
Browser (Next.js React)
        ↓  HTTP requests
Next.js API Routes (Node.js runtime)
        ↓  Prisma ORM          ↓  HTTP
  PostgreSQL DB          FastAPI (Python ML)
        ↓
  Azure Blob Storage (images)
  Jikan API (anime data)
```

When a user visits the site:

1. **First visit** → Sign up → Onboarding page asks for favourite genres → Saved to `UserGenre` junction table → `firstLogin` flag set to `false`
2. **Subsequent logins** → JWT token in HTTP-only cookie → verified on every request → straight to Dashboard
3. **Discover page** → Calls Jikan API with genre IDs → Renders anime grid → User clicks "+ Add to list" → Anime cached in local `Anime` table → `ListEntry` created
4. **Shared list** → Every list has a `shareToken` UUID in the URL → Anyone with the link can view and edit
5. **Recommendations** → Next.js calls Python FastAPI `/recommend-by-genre` → FastAPI runs KNN model → Returns similar anime → Falls back to Jikan if Python service is down

---

## Tech Stack

| Layer         | Technology                                         | Why                                    |
| ------------- | -------------------------------------------------- | -------------------------------------- |
| Frontend      | Next.js 15 (App Router)                            | SSR + API routes in one project        |
| Styling       | Tailwind CSS                                       | Utility-first, fast to build           |
| Database      | PostgreSQL                                         | Relational data, strong for joins      |
| ORM           | Prisma v7                                          | Type-safe queries, easy migrations     |
| Auth          | JWT + bcrypt                                       | Stateless, stored in HTTP-only cookies |
| Image Storage | Azure Blob Storage                                 | Scalable, production-grade             |
| Anime Data    | Jikan API (MAL)                                    | Free, no API key needed                |
| ML Service    | Python FastAPI                                     | Serves KNN recommender model           |
| Deployment    | Vercel (frontend) + Railway (DB) + Render (Python) | Free tiers for all                     |

---

## Architecture

### Next.js App Router Structure

Next.js 15 with App Router means:

- **Server Components** (`page.tsx`) — run on the server, fetch from DB directly, no API call needed
- **Client Components** (`*Client.tsx`) — run in browser, handle interactivity and state
- **API Routes** (`route.ts`) — REST endpoints, same project, no separate backend needed

Pattern used throughout:

```
page.tsx (server) → fetches data from DB via Prisma
    ↓ passes as props
*Client.tsx (client) → handles UI state, calls API routes for mutations
```

### Why this pattern?

- Server components get data fast (direct DB access, no HTTP round trip)
- Client components stay interactive
- Clean separation of concerns

---

## Database Design

### Models & Relationships

```
User ──── Session          (one user, many sessions)
User ──── UserGenre        (many-to-many with Genre)
Genre ─── UserGenre
User ──── AnimeList        (one user owns many lists)
AnimeList ── ListGenre     (many-to-many with Genre, auto-tagged)
AnimeList ── ListEntry     (one list, many entries)
Anime ──── ListEntry       (one anime in many lists)
User ──── ListEntry        (tracks who added each entry)
```

### Key Design Decisions

**Junction tables** (`UserGenre`, `ListGenre`) handle many-to-many relationships cleanly. A user can like many genres, and a genre can belong to many users.

**`shareToken` vs `editToken`** — every `AnimeList` has two UUIDs:

- `shareToken` → in the URL, used for viewing (`/list/abc123`)
- `editToken` → only the creator holds this, enables edit access

**`Anime` as local cache** — anime data is fetched from Jikan and stored locally by `malId`. Next time the same anime is requested, it's served from the DB — faster and avoids Jikan rate limits.

**`firstLogin` flag** on `User` — set to `true` on signup, `false` after onboarding completes. Controls whether the user is redirected to `/onboarding` or `/dashboard` after login.

**`addedById` on `ListEntry`** — nullable foreign key to `User`. Tracks which collaborator added each anime to a shared list.

---

## Authentication Flow

### Signup

```
POST /api/v1/auth/signup
  → Validate input
  → Check email/username not taken
  → bcrypt.hash(password, 12)
  → prisma.user.create()
  → jwt.sign({ userId }, SECRET, { expiresIn: "7d" })
  → Set HTTP-only cookie: token=<jwt>
  → Return user with firstLogin: true
  → Frontend redirects to /onboarding
```

### Login

```
POST /api/v1/auth/login
  → Find user by email
  → bcrypt.compare(password, hash)
  → jwt.sign() → set cookie
  → If firstLogin → /onboarding, else → /dashboard
```

### Protected Routes

```
Every API route:
  getCurrentUser()
    → reads "token" from cookies
    → jwt.verify(token, SECRET)
    → returns { userId }
    → if invalid → 401 Unauthorized
```

### Why HTTP-only cookies?

- JavaScript cannot read them → XSS attacks cannot steal the token
- Sent automatically with every request → no manual header management
- `sameSite: "lax"` → protects against CSRF

---

## Feature Walkthrough

### 1. Onboarding

- Shown once on first signup
- User picks ≥3 genres from a grid
- Saves to `UserGenre` junction table (deletes old, inserts new — idempotent)
- Sets `firstLogin: false` on `User`
- Same endpoint (`POST /api/v1/user/genres`) is reused in Settings for updating preferences

### 2. Dashboard

- Server component fetches user + genres + recent lists in parallel using `Promise.all`
- Stats row (total lists, public lists, total anime) computed server-side
- "Create list" modal — `POST /api/v1/lists` → creates `AnimeList` with auto-generated `shareToken` and `editToken`
- Clicking a list card navigates to `/list/:shareToken`

### 3. Discover Page

- Tabs: **For You** (genre-filtered), **Trending**, **Top Rated**, **Seasonal**, **Search**
- All data comes from Jikan API called client-side
- "For You" maps user's genre names to Jikan genre IDs and filters accordingly
- Anime detail modal shows synopsis, genres, score
- "+ Add to list" → `POST /api/v1/lists/:listId/entries` → upserts `Anime` record → creates `ListEntry`
- Pagination via "Load more" button

### 4. List Detail Page

- Banner image = blurred first anime cover image
- Stats: total, completed, watching, average rating
- Filter by watch status
- Edit entry modal: status, rating (1–10), episode progress, personal notes
- `PATCH /api/v1/lists/:listId/entries/:entryId` updates the entry
- Share modal copies the view link to clipboard
- Only owner sees edit/delete controls

### 5. Settings

- **Modular architecture**: each section (Profile, Genres, Password) is a separate component with its own custom hook
- Custom hooks (`useProfileSave`, `useGenresSave`, `usePasswordChange`, `useAvatarUpload`) encapsulate all API logic
- Avatar upload → client validates (type + 5MB limit) → uploads to `/api/v1/user/upload` → server validates again → uploads to Azure → saves URL to DB
- Password change → `bcrypt.compare` current password → `bcrypt.hash` new password

---

## ML Recommender System

### How it works

```
User's genre list
      ↓
POST /api/v1/recommend  (Next.js)
      ↓ HTTP
POST /recommend-by-genre  (FastAPI)
      ↓
Filter df by genre match
      ↓
Sort by KNN similarity score + MAL score
  final_score = 0.7 × similarity + 0.3 × (score/10)
      ↓
Return top N results
```

### Model Details

1. **TF-IDF Vectorizer** — converts anime text features (genres, synopsis, studios, type) into numeric vectors. `max_features=5000`.
2. **Numeric features** — score, popularity, members — normalized with `MinMaxScaler`, concatenated with TF-IDF matrix via `scipy.sparse.hstack`
3. **KNN with cosine similarity** — `NearestNeighbors(metric='cosine', algorithm='brute')` — finds N most similar anime
4. **Fuzzy matching** — `rapidfuzz.fuzz.WRatio` matches user input to anime titles, `score_cutoff=70`
5. **Sequel filtering** — candidates with >75% title similarity to input are skipped
6. **Online fallback** — if anime not in local dataset, queries Jikan API directly

### FastAPI endpoint

```python
POST /recommend-by-genre
Body: { "genres": ["Action", "Supernatural"], "top_n": 10 }
Returns: { "recommendations": [...] }
```

---

## Azure Blob Storage

### How image upload works

```
User selects image
      ↓
Frontend validates (type: jpg/png/webp, size: ≤5MB)
      ↓
FormData POST to /api/v1/user/upload
      ↓
Server validates again (same checks)
      ↓
Fetch old avatar URL from DB
      ↓
deleteFromAzure(oldUrl)  — deletes old blob if exists
      ↓
uploadToAzure(buffer, fileName, mimeType)
  → BlobServiceClient connects to storage account
  → createIfNotExists() — auto-creates container
  → blockBlobClient.uploadData(buffer)
  → returns public URL: https://<account>.blob.core.windows.net/<container>/<blobName>
      ↓
prisma.user.update({ avatar: url })
      ↓
Return { url } to frontend
      ↓
Frontend updates avatar state immediately
```

### Why Azure over Cloudinary?

- More control over storage
- Better for enterprise/production scale
- Resume value — Azure is a widely-used cloud platform

---

## API Reference

### Auth

| Method | Endpoint              | Description           |
| ------ | --------------------- | --------------------- |
| POST   | `/api/v1/auth/signup` | Register new user     |
| POST   | `/api/v1/auth/login`  | Login, set JWT cookie |
| POST   | `/api/v1/auth/logout` | Clear cookie          |

### User

| Method | Endpoint                | Description            |
| ------ | ----------------------- | ---------------------- |
| GET    | `/api/v1/user`          | Get current user       |
| PATCH  | `/api/v1/user`          | Update username/bio    |
| PATCH  | `/api/v1/user/password` | Change password        |
| POST   | `/api/v1/user/genres`   | Set genre preferences  |
| GET    | `/api/v1/user/genres`   | Get genre preferences  |
| POST   | `/api/v1/user/upload`   | Upload avatar to Azure |

### Lists

| Method | Endpoint                | Description                  |
| ------ | ----------------------- | ---------------------------- |
| GET    | `/api/v1/lists`         | Get all user's lists         |
| POST   | `/api/v1/lists`         | Create new list              |
| PATCH  | `/api/v1/lists/:listId` | Update list title/visibility |
| DELETE | `/api/v1/lists/:listId` | Delete list                  |

### Entries

| Method | Endpoint                                 | Description                   |
| ------ | ---------------------------------------- | ----------------------------- |
| POST   | `/api/v1/lists/:listId/entries`          | Add anime to list             |
| PATCH  | `/api/v1/lists/:listId/entries/:entryId` | Update status/rating/progress |
| DELETE | `/api/v1/lists/:listId/entries/:entryId` | Remove from list              |

### Recommendations

| Method | Endpoint            | Description                      |
| ------ | ------------------- | -------------------------------- |
| POST   | `/api/v1/recommend` | Get personalised recommendations |

---

## Project Structure

```
animerecommendation/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── onboarding/page.tsx
│   ├── dashboard/
│   │   ├── page.tsx               ← server component
│   │   └── DashboardClient.tsx    ← client component
│   ├── discover/
│   │   ├── page.tsx
│   │   └── DiscoverClient.tsx
│   ├── list/[shareToken]/
│   │   ├── page.tsx
│   │   └── ListDetailClient.tsx
│   ├── settings/
│   │   ├── page.tsx
│   │   ├── SettingsClient.tsx
│   │   ├── types.ts
│   │   ├── constants.ts
│   │   ├── components/
│   │   │   ├── AvatarCard.tsx
│   │   │   ├── SettingsNav.tsx
│   │   │   ├── ProfileSection.tsx
│   │   │   ├── GenresSection.tsx
│   │   │   ├── PasswordSection.tsx
│   │   │   └── StatusMsg.tsx
│   │   └── hooks/
│   │       ├── useAvatarUpload.ts
│   │       ├── useProfileSave.ts
│   │       ├── useGenresSave.ts
│   │       └── usePasswordChange.ts
│   └── api/v1/
│       ├── auth/
│       │   ├── signup/route.ts
│       │   ├── login/route.ts
│       │   └── logout/route.ts
│       ├── user/
│       │   ├── route.ts
│       │   ├── genres/route.ts
│       │   ├── password/route.ts
│       │   └── upload/route.ts
│       ├── lists/
│       │   ├── route.ts
│       │   └── [listId]/
│       │       ├── route.ts
│       │       └── entries/
│       │           ├── route.ts
│       │           └── [entryId]/route.ts
│       └── recommend/route.ts
├── lib/
│   ├── prisma.ts                  ← Prisma client singleton
│   ├── auth.ts                    ← JWT helpers
│   └── azure.ts                   ← Azure Blob Storage helpers
├── prisma/
│   ├── schema.prisma              ← DB models
│   ├── seed.ts                    ← Seeds genres table
│   └── migrations/
├── .env
└── next.config.ts
```

---

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/animerecommendation"

# Auth
JWT_SECRET="your_super_secret_key_min_32_chars"

# Azure Blob Storage
AZURE_STORAGE_ACCOUNT_NAME="your_account_name"
AZURE_STORAGE_ACCOUNT_KEY="your_account_key"
AZURE_STORAGE_CONTAINER_NAME="images"

# Python ML service
PYTHON_API_URL="http://localhost:8000"
```

---

## Setup & Running Locally

```bash
# 1. Clone and install
git clone https://github.com/Abhineetsahay/anime-recommendation
cd anime-recommendation
npm install

# 2. Set up environment variables
cp .env.example .env
# Fill in your values

# 3. Set up database
npx prisma migrate dev --name init
npx prisma db seed           # seeds genres table

# 4. Run the dev server
npm run dev                  # → http://localhost:3000

# 5. Optional: run the Python recommender
# Separate backend repo: https://github.com/Abhineetsahay/Anime-Recommendation-Backend
cd python-recommender
pip install fastapi uvicorn scikit-learn pandas rapidfuzz
uvicorn main:app --reload    # runs at http://localhost:8000
```

---
