# PostgreSQL Setup for Windows

## Option 1: Using Windows Installer (Recommended)

1. Download PostgreSQL from https://www.postgresql.org/download/windows/
2. Run the installer and follow the setup wizard
3. Remember the password you set for the `postgres` user
4. Choose port 5432 (default)
5. Complete the installation

## Option 2: Using Windows Package Manager (winget)

```powershell
# Install PostgreSQL
winget install PostgreSQL.PostgreSQL

# Follow the installer prompts
```

## Option 3: Using WSL (Windows Subsystem for Linux)

```bash
# In your WSL terminal
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib

# Start PostgreSQL
sudo service postgresql start

# Check status
sudo service postgresql status
```

## Verify Installation

```powershell
# Test connection (use postgres as default user)
psql -U postgres -h localhost -d postgres
```

If successful, you'll see the `postgres=#` prompt.

## Create Database and User

```sql
-- Connect to PostgreSQL as postgres user first
psql -U postgres

-- Create database
CREATE DATABASE employee_health_db;

-- Create user (optional)
CREATE USER health_user WITH PASSWORD 'secure_password';
ALTER USER health_user CREATEDB;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE employee_health_db TO health_user;

-- List databases
\l

-- Exit
\q
```

## Connection String for .env.local

For the `postgres` user:
```
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/employee_health_db"
```

For the `health_user`:
```
DATABASE_URL="postgresql://health_user:secure_password@localhost:5432/employee_health_db"
```

## Troubleshooting

If you can't connect:
1. Make sure PostgreSQL service is running
2. Check if port 5432 is in use
3. Verify your credentials
4. On Windows, PostgreSQL might need to be added to PATH

### Check if PostgreSQL is Running (Windows)
```powershell
# Open Services and search for "PostgreSQL"
# Or via PowerShell:
Get-Service postgresql-x64-*
```

### Start PostgreSQL Service (Windows)
```powershell
# Via Services app or PowerShell as Administrator:
Start-Service postgresql-x64-15
```
