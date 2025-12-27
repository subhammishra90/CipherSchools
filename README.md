# CipherSQLStudio

A browser-based SQL learning platform where students can practice SQL queries against pre-configured assignments with real-time execution and intelligent hints.

## Features

### Core Features
- **Assignment Listing Page**: Browse all available SQL assignments with difficulty levels and descriptions
- **Assignment Attempt Interface**: 
  - Question panel with requirements
  - Sample data viewer showing table schemas and sample rows
  - SQL editor powered by Monaco Editor
  - Real-time query execution results
  - LLM-powered hint system (provides guidance, not solutions)
- **Query Execution Engine**: Secure SQL query execution against PostgreSQL with validation and sanitization

### Optional Features
- User authentication system (Login/Signup)
- Save user's SQL query attempts for each assignment

## Technology Stack

### Frontend
- **React.js** - UI framework
- **React Router** - Navigation
- **Monaco Editor** - SQL code editor
- **SCSS** - Styling with mobile-first responsive design
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Sandbox database for query execution
- **MongoDB** - Persistence database for assignments and user data
- **LLM Integration** - OpenAI or Google Gemini for intelligent hints

## Project Structure

```
ciphersqlstudio/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── styles/         # SCSS files
│   │   └── App.js
│   └── package.json
├── server/                 # Express backend
│   ├── config/             # Database configuration
│   ├── routes/             # API routes
│   ├── services/           # Business logic (LLM service)
│   ├── scripts/            # Database initialization
│   └── package.json
├── package.json            # Root package.json
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- MongoDB Atlas account (or local MongoDB instance)
- LLM API key (OpenAI or Google Gemini)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd chipherschools
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**

   Copy the example environment file in the server directory:
   ```bash
   cd server
   copy env.example .env
   ```
   (On Linux/Mac: `cp env.example .env`)

   Then edit the `.env` file with your configuration:
   ```env
   PORT=5000
   
   # PostgreSQL Configuration
   POSTGRES_HOST=localhost
   POSTGRES_PORT=5432
   POSTGRES_DB=ciphersqlstudio
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=your_password
   
   # MongoDB Configuration
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ciphersqlstudio?retryWrites=true&w=majority
   
   # LLM Configuration
   OPENAI_API_KEY=your_openai_api_key
   # OR
   GEMINI_API_KEY=your_gemini_api_key
   LLM_PROVIDER=openai
   ```

4. **Set up PostgreSQL database**
   ```bash
   # Create database
   createdb ciphersqlstudio
   
   # Or using psql
   psql -U postgres
   CREATE DATABASE ciphersqlstudio;
   ```

5. **Initialize databases with sample data**
   ```bash
   cd server
   node scripts/initDatabase.js
   ```

6. **Start the application**
   ```bash
   # From root directory
   npm run dev
   
   # Or start separately:
   # Terminal 1 - Backend
   cd server
   npm run dev
   
   # Terminal 2 - Frontend
   cd client
   npm start
   ```

7. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Environment Variables

### Required Variables
- `POSTGRES_HOST` - PostgreSQL host
- `POSTGRES_PORT` - PostgreSQL port
- `POSTGRES_DB` - Database name
- `POSTGRES_USER` - Database user
- `POSTGRES_PASSWORD` - Database password
- `MONGODB_URI` - MongoDB connection string
- `OPENAI_API_KEY` or `GEMINI_API_KEY` - LLM API key
- `LLM_PROVIDER` - Either "openai" or "gemini"

## API Endpoints

### Assignments
- `GET /api/assignments` - Get all assignments
- `GET /api/assignments/:id` - Get single assignment by ID

### Query Execution
- `POST /api/query/execute` - Execute SQL query
  ```json
  {
    "query": "SELECT * FROM employees",
    "assignmentId": "assignment-1"
  }
  ```

### Hints
- `POST /api/hint` - Get intelligent hint for assignment
  ```json
  {
    "assignmentId": "assignment-1",
    "userQuery": "SELECT * FROM employees",
    "errorMessage": "optional error message"
  }
  ```

## Security Features

- SQL injection prevention through query sanitization
- Only SELECT queries allowed
- Dangerous operations blocked (DROP, DELETE, TRUNCATE, etc.)
- Query timeout (10 seconds)
- Input validation using express-validator

## Responsive Design

The application follows a mobile-first approach with breakpoints:
- **Mobile**: 320px and up
- **Tablet**: 641px and up
- **Desktop**: 1024px and up
- **Large Desktop**: 1281px and up

## SCSS Features Used

- Variables for colors, spacing, typography
- Mixins for responsive breakpoints and reusable styles
- Nesting for component-based styling
- Partials for organized code structure
- BEM naming convention

## Data Flow Diagram

The data flow for query execution:

1. User writes SQL query in Monaco Editor
2. User clicks "Execute Query" button
3. Frontend sends POST request to `/api/query/execute` with query and assignmentId
4. Backend validates and sanitizes the query
5. Backend executes query against PostgreSQL using connection pool
6. Results are formatted and returned to frontend
7. Frontend displays results in results table
8. If error occurs, error message is displayed

## Development

### Running in Development Mode
```bash
npm run dev
```

This runs both frontend and backend concurrently.

### Building for Production
```bash
cd client
npm run build
```

## License

ISC

## Contact

- Website: https://cipherschools.com
- Email: nitesh@cipherschools.com
- Contact: +91-8080399840

