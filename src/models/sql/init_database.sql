CREATE TABLE IF NOT EXISTS "file" ("id" UUID NOT NULL , "name" VARCHAR(255) NOT NULL, "path" VARCHAR(255), "shortUrl" VARCHAR(255), "downloads" BIGINT DEFAULT 0, "downloadLimit" BIGINT DEFAULT 100, "message" TEXT DEFAULT 'File shared using FShare', "expire" BIGINT, "password" VARCHAR(255), "createdAt" TIMESTAMP WITH TIME ZONE, "updatedAt" TIMESTAMP WITH TIME ZONE, "userId" UUID REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE, PRIMARY KEY ("id"));

CREATE TABLE IF NOT EXISTS "users" ("id" UUID NOT NULL , "username" VARCHAR(255) NOT NULL, "email" VARCHAR(255) NOT NULL UNIQUE, "token" VARCHAR(255), "createdAt" TIMESTAMP WITH TIME ZONE, "updatedAt" TIMESTAMP WITH TIME ZONE, PRIMARY KEY ("id"))