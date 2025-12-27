# Data Flow Diagram Description

This document describes the data flow for the CipherSQLStudio application. You should draw this diagram by hand as required by the assignment.

## Query Execution Flow

```
┌─────────────────┐
│   User Browser  │
│  (React Client) │
└────────┬────────┘
         │
         │ 1. User writes SQL query in Monaco Editor
         │
         │ 2. User clicks "Execute Query" button
         │
         ▼
┌─────────────────────────────────────┐
│  Frontend: AssignmentAttempt.js     │
│  - Validates query is not empty     │
│  - Sets loading state               │
│  - Prepares request payload         │
└────────┬────────────────────────────┘
         │
         │ 3. POST /api/query/execute
         │    { query: "SELECT ...", assignmentId: "..." }
         │
         ▼
┌─────────────────────────────────────┐
│  Express Server (index.js)          │
│  - Receives HTTP request            │
│  - Routes to queryRoutes            │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  Backend: routes/query.js            │
│  - Validates request body            │
│  - Sanitizes SQL query               │
│  - Checks for dangerous operations   │
│  - Ensures only SELECT queries       │
└────────┬────────────────────────────┘
         │
         │ 4. Get PostgreSQL connection from pool
         │
         ▼
┌─────────────────────────────────────┐
│  PostgreSQL Database (Sandbox)       │
│  - Executes SELECT query             │
│  - Returns result set                │
│  - Query timeout: 10 seconds        │
└────────┬────────────────────────────┘
         │
         │ 5. Query results returned
         │
         ▼
┌─────────────────────────────────────┐
│  Backend: routes/query.js            │
│  - Formats result data               │
│  - Extracts columns and rows        │
│  - Returns JSON response             │
└────────┬────────────────────────────┘
         │
         │ 6. HTTP Response
         │    { success: true, data: { rows, columns, rowCount } }
         │
         ▼
┌─────────────────────────────────────┐
│  Frontend: AssignmentAttempt.js     │
│  - Receives response                │
│  - Updates state with results       │
│  - Displays results in table        │
│  - Clears loading state             │
└─────────────────────────────────────┘
```

## Error Flow

If an error occurs during query execution:

```
PostgreSQL Error
       │
       ▼
Backend catches error
       │
       ▼
Returns error response
  { success: false, error: "error message" }
       │
       ▼
Frontend displays error message
  in results-section__error div
```

## Hint Generation Flow

```
┌─────────────────┐
│   User Browser  │
│  (React Client) │
└────────┬────────┘
         │
         │ 1. User clicks "Get Hint" button
         │
         ▼
┌─────────────────────────────────────┐
│  Frontend: AssignmentAttempt.js     │
│  - Sets hintLoading state           │
│  - Prepares request with:           │
│    - assignmentId                   │
│    - userQuery (optional)           │
│    - errorMessage (optional)        │
└────────┬────────────────────────────┘
         │
         │ 2. POST /api/hint
         │
         ▼
┌─────────────────────────────────────┐
│  Express Server (index.js)          │
│  - Routes to hintRoutes             │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  Backend: routes/hint.js             │
│  - Validates request                │
│  - Fetches assignment from MongoDB  │
└────────┬────────────────────────────┘
         │
         │ 3. Query MongoDB
         │
         ▼
┌─────────────────────────────────────┐
│  MongoDB (Persistence Database)      │
│  - Returns assignment document       │
│  - Includes question, requirements, │
│    sampleData                        │
└────────┬────────────────────────────┘
         │
         │ 4. Assignment data returned
         │
         ▼
┌─────────────────────────────────────┐
│  Backend: services/llmService.js     │
│  - Builds prompt with:               │
│    - Assignment question             │
│    - Requirements                    │
│    - Sample data schema              │
│    - User's query (if provided)      │
│    - Error message (if provided)     │
│  - Calls LLM API (OpenAI/Gemini)     │
└────────┬────────────────────────────┘
         │
         │ 5. HTTP request to LLM API
         │
         ▼
┌─────────────────────────────────────┐
│  LLM API (OpenAI or Gemini)          │
│  - Processes prompt                  │
│  - Generates hint (not solution)     │
│  - Returns text response             │
└────────┬────────────────────────────┘
         │
         │ 6. LLM response returned
         │
         ▼
┌─────────────────────────────────────┐
│  Backend: routes/hint.js             │
│  - Formats response                  │
│  - Returns JSON                      │
└────────┬────────────────────────────┘
         │
         │ 7. HTTP Response
         │    { success: true, hint: "..." }
         │
         ▼
┌─────────────────────────────────────┐
│  Frontend: AssignmentAttempt.js      │
│  - Updates hint state                │
│  - Displays hint in hint-section    │
│  - Clears hintLoading state         │
└─────────────────────────────────────┘
```

## Assignment Listing Flow

```
┌─────────────────┐
│   User Browser  │
│  (React Client) │
└────────┬────────┘
         │
         │ 1. Component mounts
         │
         ▼
┌─────────────────────────────────────┐
│  Frontend: AssignmentList.js        │
│  - useEffect triggers               │
│  - Sets loading state               │
└────────┬────────────────────────────┘
         │
         │ 2. GET /api/assignments
         │
         ▼
┌─────────────────────────────────────┐
│  Express Server (index.js)          │
│  - Routes to assignmentRoutes       │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  Backend: routes/assignments.js     │
│  - Queries MongoDB                  │
└────────┬────────────────────────────┘
         │
         │ 3. Query MongoDB
         │
         ▼
┌─────────────────────────────────────┐
│  MongoDB (Persistence Database)      │
│  - Returns all assignments          │
└────────┬────────────────────────────┘
         │
         │ 4. Assignments array returned
         │
         ▼
┌─────────────────────────────────────┐
│  Frontend: AssignmentList.js        │
│  - Updates assignments state        │
│  - Renders assignment cards         │
│  - Clears loading state            │
└─────────────────────────────────────┘
```

## Key Components

1. **State Updates**: Each step updates React component state
2. **Error Handling**: Errors are caught and displayed to users
3. **Loading States**: UI shows loading indicators during async operations
4. **Security**: SQL queries are sanitized before execution
5. **Database Separation**: 
   - PostgreSQL: Query execution (sandbox)
   - MongoDB: Assignment storage (persistence)

## Notes for Hand-Drawn Diagram

When drawing your diagram, make sure to:
- Label each step with numbers (1, 2, 3, etc.)
- Show data flow with arrows
- Include all components (Browser, Express, PostgreSQL, MongoDB, LLM API)
- Show error paths
- Indicate state updates
- Show request/response formats
- Use different colors for different types of operations (read, write, external API)

