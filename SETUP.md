# Quick Setup Guide

## Step 1: Install Dependencies

```bash
npm run install-all
```

## Step 2: Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cd server
   copy env.example .env
   ```
   (On Linux/Mac: `cp env.example .env`)

2. Edit `server/.env` and fill in your configuration:
   - PostgreSQL credentials
   - MongoDB connection string
   - LLM API key (OpenAI or Gemini)

## Step 3: Set Up PostgreSQL

Create the database:
```bash
createdb ciphersqlstudio
```

Or using psql:
```sql
psql -U postgres
CREATE DATABASE ciphersqlstudio;
\q
```

## Step 4: Initialize Sample Data

```bash
cd server
node scripts/initDatabase.js
```

This will:
- Create sample tables in PostgreSQL (employees, departments, orders)
- Insert sample data
- Create sample assignments in MongoDB

## Step 5: Start the Application

From the root directory:
```bash
npm run dev
```

This starts both frontend (port 3000) and backend (port 5000).

## Troubleshooting

### MongoDB Connection Error
- Make sure your MongoDB URI is correct
- For MongoDB Atlas, ensure your IP is whitelisted
- Check that the connection string includes the database name

### PostgreSQL Connection Error
- Verify PostgreSQL is running
- Check credentials in `.env` file
- Ensure the database `ciphersqlstudio` exists

### LLM API Error
- Verify your API key is correct
- Check your API quota/credits
- Ensure `LLM_PROVIDER` is set to either "openai" or "gemini"

