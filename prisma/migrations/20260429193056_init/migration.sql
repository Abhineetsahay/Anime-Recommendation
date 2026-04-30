-- CreateEnum
CREATE TYPE "WatchStatus" AS ENUM ('WATCHING', 'COMPLETED', 'ON_HOLD', 'DROPPED', 'PLAN_TO_WATCH');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT,
    "avatar" TEXT,
    "bio" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "genres" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "genres_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_genres" (
    "userId" TEXT NOT NULL,
    "genreId" TEXT NOT NULL,

    CONSTRAINT "user_genres_pkey" PRIMARY KEY ("userId","genreId")
);

-- CreateTable
CREATE TABLE "anime_lists" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "shareToken" TEXT NOT NULL,
    "editToken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "anime_lists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "list_genres" (
    "listId" TEXT NOT NULL,
    "genreId" TEXT NOT NULL,

    CONSTRAINT "list_genres_pkey" PRIMARY KEY ("listId","genreId")
);

-- CreateTable
CREATE TABLE "anime" (
    "id" TEXT NOT NULL,
    "malId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "titleEnglish" TEXT,
    "synopsis" TEXT,
    "coverImage" TEXT,
    "genres" TEXT[],
    "type" TEXT,
    "episodes" INTEGER,
    "score" DOUBLE PRECISION,
    "rank" INTEGER,
    "popularity" INTEGER,
    "status" TEXT,
    "year" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "anime_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "list_entries" (
    "id" TEXT NOT NULL,
    "listId" TEXT NOT NULL,
    "animeId" TEXT NOT NULL,
    "addedById" TEXT,
    "status" "WatchStatus" NOT NULL DEFAULT 'PLAN_TO_WATCH',
    "rating" INTEGER,
    "progress" INTEGER,
    "notes" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "list_entries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "genres_name_key" ON "genres"("name");

-- CreateIndex
CREATE UNIQUE INDEX "anime_lists_shareToken_key" ON "anime_lists"("shareToken");

-- CreateIndex
CREATE UNIQUE INDEX "anime_lists_editToken_key" ON "anime_lists"("editToken");

-- CreateIndex
CREATE UNIQUE INDEX "anime_malId_key" ON "anime"("malId");

-- CreateIndex
CREATE UNIQUE INDEX "list_entries_listId_animeId_key" ON "list_entries"("listId", "animeId");

-- AddForeignKey
ALTER TABLE "user_genres" ADD CONSTRAINT "user_genres_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_genres" ADD CONSTRAINT "user_genres_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "genres"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anime_lists" ADD CONSTRAINT "anime_lists_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "list_genres" ADD CONSTRAINT "list_genres_listId_fkey" FOREIGN KEY ("listId") REFERENCES "anime_lists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "list_genres" ADD CONSTRAINT "list_genres_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "genres"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "list_entries" ADD CONSTRAINT "list_entries_listId_fkey" FOREIGN KEY ("listId") REFERENCES "anime_lists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "list_entries" ADD CONSTRAINT "list_entries_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "anime"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "list_entries" ADD CONSTRAINT "list_entries_addedById_fkey" FOREIGN KEY ("addedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
