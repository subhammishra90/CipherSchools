const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { pgPool } = require('../config/database');

// Security: Allowed SQL keywords and patterns
const ALLOWED_KEYWORDS = [
  'SELECT', 'FROM', 'WHERE', 'JOIN', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN',
  'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'OFFSET', 'DISTINCT', 'AS', 'AND', 'OR',
  'COUNT', 'SUM', 'AVG', 'MAX', 'MIN', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END',
  'IN', 'NOT IN', 'LIKE', 'BETWEEN', 'IS NULL', 'IS NOT NULL', 'UNION', 'EXCEPT', 'INTERSECT'
];

// Basic SQL injection prevention - remove dangerous keywords
const sanitizeQuery = (query) => {
  if (!query || typeof query !== 'string') {
    throw new Error('Invalid query');
  }

  const upperQuery = query.toUpperCase().trim();
  
  // Block dangerous operations
  const dangerousPatterns = [
    /DROP\s+(TABLE|DATABASE|SCHEMA)/i,
    /DELETE\s+FROM/i,
    /TRUNCATE/i,
    /ALTER\s+TABLE/i,
    /CREATE\s+(TABLE|DATABASE|SCHEMA)/i,
    /INSERT\s+INTO/i,
    /UPDATE\s+SET/i,
    /GRANT|REVOKE/i,
    /EXEC|EXECUTE/i,
    /;\s*DROP/i,
    /;\s*DELETE/i,
    /;\s*TRUNCATE/i,
    /;\s*ALTER/i,
    /;\s*CREATE/i,
    /;\s*INSERT/i,
    /;\s*UPDATE/i,
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(query)) {
      throw new Error('Query contains prohibited operations');
    }
  }

  // Only allow SELECT queries
  if (!upperQuery.startsWith('SELECT')) {
    throw new Error('Only SELECT queries are allowed');
  }

  return query.trim();
};

// Execute SQL query
router.post('/execute',
  [
    body('query').notEmpty().withMessage('Query is required'),
    body('assignmentId').optional().isString(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { query, assignmentId } = req.body;

      // Sanitize and validate query
      const sanitizedQuery = sanitizeQuery(query);

      // Execute query with timeout
      const client = await pgPool.connect();
      
      try {
        const result = await Promise.race([
          client.query(sanitizedQuery),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Query timeout')), 10000)
          )
        ]);

        // Format result
        const formattedResult = {
          rows: result.rows,
          rowCount: result.rowCount,
          columns: result.fields.map(field => ({
            name: field.name,
            dataType: field.dataTypeID
          }))
        };

        res.json({
          success: true,
          data: formattedResult
        });
      } catch (queryError) {
        res.status(400).json({
          success: false,
          error: queryError.message
        });
      } finally {
        client.release();
      }
    } catch (error) {
      console.error('Query execution error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to execute query'
      });
    }
  }
);

module.exports = router;

