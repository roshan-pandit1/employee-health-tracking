# Database Setup Guide

## Prerequisites

- PostgreSQL 12+ installed and running
- Node.js and npm/pnpm installed

## Environment Setup

1. Create a `.env.local` file in the project root:

```env
# PostgreSQL Connection String
DATABASE_URL="postgresql://user:password@localhost:5432/employee_health_db"
```

Replace `user`, `password`, and database name as needed.

## Installation & Setup

1. **Install Prisma dependencies** (if not already done):
```bash
npm install @prisma/client
npm install -D prisma
```

2. **Initialize Prisma** (creates schema and migrations):
```bash
npx prisma migrate dev --name init
```

3. **Generate Prisma Client**:
```bash
npx prisma generate
```

4. **Seed the database** (optional - populate with sample data):
```bash
npx prisma db seed
```

## Database Schema Overview

### Tables

- **Employee**: Stores employee information
  - id, name, email, role, department, avatar, age, joinDate, watchConnected, lastSync

- **VitalReading**: Smartwatch vital readings (heart rate, O2, steps, sleep, stress, temperature)
  - Multiple readings per employee, timestamped

- **Alert**: Health alerts triggered for employees
  - type, severity, message, suggestion, acknowledged flag

- **BurnoutScore**: Calculated burnout risk scores over time
  - score, risk level, component scores (fatigue, stress, sleep)

- **SmartwatchSync**: Logs of smartwatch synchronizations
  - syncedAt, duration, status, record counts

## Useful Commands

```bash
# View database in Prisma Studio (web UI)
npx prisma studio

# Run migrations
npx prisma migrate dev

# Check migration status
npx prisma migrate status

# Create a backup
pg_dump -U user -h localhost employee_health_db > backup.sql

# Reset database (careful!)
npx prisma migrate reset
```

## PostgreSQL Setup Instructions

If you don't have PostgreSQL installed:

### Windows
```bash
# Using Windows Subsystem for Linux (WSL)
# Or download from https://www.postgresql.org/download/windows/
```

### macOS
```bash
brew install postgresql@15
brew services start postgresql@15
```

### Linux
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Create Database
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE employee_health_db;

# Create user (optional)
CREATE USER health_user WITH PASSWORD 'secure_password';
ALTER USER health_user CREATEDB;
GRANT ALL PRIVILEGES ON DATABASE employee_health_db TO health_user;

# Exit
\q
```

## Using SQLite Instead (Easier for Development)

If you prefer SQLite for easier local development, update `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

And update `.env.local`:
```
DATABASE_URL="file:./dev.db"
```

Then run:
```bash
npx prisma migrate dev --name init
```

SQLite database will be created at `prisma/dev.db`.
