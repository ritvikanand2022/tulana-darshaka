# Database Migration Guide - RefreshToken Table

## Overview
This guide explains how to apply the database migration for the RefreshToken table added in Phase 2.1 Authentication System.

## Migration Details

### New Table: RefreshToken
The migration adds a new table to support JWT refresh token persistence and revocation.

**Schema Changes:**
```prisma
model RefreshToken {
  id        String   @id @default(cuid())
  token     String   @unique
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  expiresAt DateTime
  createdAt DateTime @default(now())

  @@index([userId])
  @@index([token])
  @@map("refresh_tokens")
}

model User {
  // ... existing fields
  refreshTokens   RefreshToken[]
  // ... existing relations
}
```

**Table Structure:**
- `id` (String, Primary Key): Unique identifier (CUID)
- `token` (String, Unique): The JWT refresh token value
- `userId` (String, Foreign Key): References User.id
- `expiresAt` (DateTime): Token expiration timestamp
- `createdAt` (DateTime): When token was created

**Indexes:**
- Index on `userId` for fast user lookups
- Index on `token` for fast token validation
- Unique constraint on `token` to prevent duplicates

**Cascading Delete:**
- When a user is deleted, all their refresh tokens are automatically deleted

## Running the Migration

### Step 1: Ensure Database Connection
Make sure your `.env` file has the correct `DATABASE_URL`:

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/tulana_darshaka?schema=public"
```

### Step 2: Run Prisma Migration
Navigate to the API directory and run:

```bash
cd apps/api
npx prisma migrate dev --name add-refresh-tokens
```

This will:
1. Generate SQL migration files
2. Apply the migration to your database
3. Regenerate Prisma Client with new types

### Step 3: Verify Migration
Check that the migration was applied:

```bash
npx prisma studio
```

You should see the new `refresh_tokens` table in Prisma Studio.

### Step 4: Generate Prisma Client (if needed)
If Prisma Client wasn't regenerated automatically:

```bash
npx prisma generate
```

## Migration SQL (Reference)

The migration will create SQL similar to:

```sql
-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_key" ON "refresh_tokens"("token");

-- CreateIndex
CREATE INDEX "refresh_tokens_userId_idx" ON "refresh_tokens"("userId");

-- CreateIndex
CREATE INDEX "refresh_tokens_token_idx" ON "refresh_tokens"("token");

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
```

## Rollback (if needed)

If you need to rollback the migration:

```bash
npx prisma migrate resolve --rolled-back add-refresh-tokens
```

Then manually drop the table:

```sql
DROP TABLE "refresh_tokens";
```

## Production Deployment

### For Production Environments:

1. **Backup your database first:**
```bash
pg_dump -U user -d tulana_darshaka > backup_$(date +%Y%m%d_%H%M%S).sql
```

2. **Use migration deploy (not migrate dev):**
```bash
npx prisma migrate deploy
```

This applies pending migrations without prompts, suitable for CI/CD.

3. **Verify in production:**
```bash
npx prisma migrate status
```

## Troubleshooting

### Error: "Prisma Client not regenerated"
**Solution:** Run `npx prisma generate` manually

### Error: "Database connection failed"
**Solution:** Check DATABASE_URL in .env, ensure PostgreSQL is running

### Error: "Migration already applied"
**Solution:** This is fine - migration was already run. Check with `npx prisma migrate status`

### Error: "Cannot connect to Prisma engine binaries"
**Solution:** Network/firewall issue. Try:
```bash
npx prisma generate --generator client
```

Or set environment variable:
```bash
PRISMA_BINARIES_MIRROR=https://prisma-builds.s3-eu-west-1.amazonaws.com npx prisma generate
```

## Testing After Migration

After applying the migration, test the authentication endpoints:

```bash
# Register a new user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

# Check refresh_tokens table in Prisma Studio
npx prisma studio
# Navigate to refresh_tokens table - should see 1 record
```

## Next Steps

After migration:
1. ✅ RefreshToken table created
2. ⏭️ Configure JWT secrets in `.env`
3. ⏭️ Test authentication endpoints
4. ⏭️ Deploy to production
