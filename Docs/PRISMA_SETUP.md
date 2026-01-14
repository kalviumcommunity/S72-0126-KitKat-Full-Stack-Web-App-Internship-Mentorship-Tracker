# Prisma Setup Guide - UIMP Backend

This guide explains how to set up and use Prisma in the UIMP backend project.

## Prerequisites

- Node.js 20+ installed
- PostgreSQL database running (local or remote)
- npm or yarn package manager

## Initial Setup

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure Environment Variables

Copy the example environment file and update with your values:

```bash
cp .env.example .env
```

Edit `.env` and set:
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: A secure random string (minimum 32 characters)

Example `.env`:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/uimp_db?schema=public"
JWT_SECRET="your-super-secret-jwt-key-min-32-characters-long-change-this"
```

### 3. Generate Prisma Client

This generates the TypeScript client based on your schema:

```bash
npm run prisma:generate
```

Or use the shorthand:
```bash
npx prisma generate
```

### 4. Run Database Migrations

This creates the database tables based on your Prisma schema:

```bash
npm run prisma:migrate
```

Or use the shorthand:
```bash
npx prisma migrate dev --name init
```

This will:
- Create a new migration file
- Apply the migration to your database
- Regenerate Prisma Client

### 5. Seed the Database

Populate the database with sample data:

```bash
npm run prisma:seed
```

Or use the shorthand:
```bash
npx prisma db seed
```

### Quick Setup (All Steps at Once)

Run all setup steps in sequence:

```bash
npm run db:setup
```

This runs:
1. `prisma generate` - Generate Prisma Client
2. `prisma migrate dev` - Run migrations
3. `prisma db seed` - Seed database

## Available Scripts

### Prisma Commands

- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Create and apply new migration
- `npm run prisma:migrate:deploy` - Apply migrations (production)
- `npm run prisma:migrate:reset` - Reset database and reapply migrations
- `npm run prisma:studio` - Open Prisma Studio (database GUI)
- `npm run prisma:seed` - Seed database with sample data

### Database Commands

- `npm run db:setup` - Complete setup (generate + migrate + seed)
- `npm run db:reset` - Reset database (WARNING: Deletes all data)

## Common Workflows

### Creating a New Migration

When you modify `schema.prisma`:

```bash
# 1. Edit schema.prisma
# 2. Create migration
npm run prisma:migrate

# 3. Migration will be created and applied automatically
```

### Viewing Database Data

Open Prisma Studio to view and edit data:

```bash
npm run prisma:studio
```

This opens a web interface at `http://localhost:5555`

### Resetting Database

⚠️ **WARNING**: This deletes all data!

```bash
npm run db:reset
```

This will:
1. Drop the database
2. Recreate it
3. Apply all migrations
4. Run seed script

## Migration Files

Migrations are stored in `prisma/migrations/`. Each migration:
- Has a timestamp and name
- Contains SQL to modify the database
- Is tracked by Prisma

**Never edit migration files manually!** Always create new migrations.

## Schema Changes Workflow

1. **Edit `schema.prisma`**
   ```prisma
   model User {
     // Add new field
     newField String?
   }
   ```

2. **Create migration**
   ```bash
   npm run prisma:migrate
   ```
   Prisma will prompt for a migration name.

3. **Migration is applied automatically**
   Prisma Client is regenerated automatically.

## Production Deployment

For production, use:

```bash
npm run prisma:migrate:deploy
```

This applies pending migrations without creating new ones.

## Troubleshooting

### Migration Conflicts

If migrations are out of sync:

```bash
# Reset and reapply
npm run db:reset
```

### Prisma Client Out of Sync

If you see type errors:

```bash
npm run prisma:generate
```

### Database Connection Issues

Check your `DATABASE_URL` in `.env`:
- Format: `postgresql://user:password@host:port/database?schema=public`
- Ensure PostgreSQL is running
- Verify credentials are correct

### Seed Script Errors

If seed fails:
- Ensure migrations have been run
- Check that Prisma Client is generated
- Verify database connection

## Seed Data

The seed script creates:
- 1 Admin user
- 2 Mentor users
- 3 Student users
- 3 Mentor assignments
- 6 Applications (various statuses)
- 5 Feedback entries
- 5 Notifications

**Test Credentials:**
- Admin: `admin@uimp.com` / `Admin123!`
- Mentor1: `mentor1@uimp.com` / `Mentor123!`
- Mentor2: `mentor2@uimp.com` / `Mentor123!`
- Student1: `student1@uimp.com` / `Student123!`
- Student2: `student2@uimp.com` / `Student123!`
- Student3: `student3@uimp.com` / `Student123!`

## Next Steps

After setup:
1. Start the development server: `npm run dev`
2. Test API endpoints
3. Use Prisma Studio to explore data: `npm run prisma:studio`

---

**Last Updated**: 2024-01-15  
**Maintained By**: Backend Team (Heramb)

