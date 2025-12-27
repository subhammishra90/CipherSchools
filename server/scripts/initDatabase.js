const { pgPool } = require('../config/database');
const { connectMongoDB, getMongoDB } = require('../config/database');

/**
 * Initialize PostgreSQL with sample tables and data
 */
const initPostgreSQL = async () => {
  const client = await pgPool.connect();
  
  try {
    // Create sample tables for assignments
    await client.query(`
      DROP TABLE IF EXISTS employees CASCADE;
      CREATE TABLE employees (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        department VARCHAR(50),
        salary DECIMAL(10, 2),
        hire_date DATE
      );
    `);

    await client.query(`
      DROP TABLE IF EXISTS departments CASCADE;
      CREATE TABLE departments (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        location VARCHAR(100)
      );
    `);

    await client.query(`
      DROP TABLE IF EXISTS orders CASCADE;
      CREATE TABLE orders (
        id SERIAL PRIMARY KEY,
        customer_id INTEGER,
        product_name VARCHAR(100),
        quantity INTEGER,
        price DECIMAL(10, 2),
        order_date DATE
      );
    `);

    // Insert sample data
    await client.query(`
      INSERT INTO employees (name, department, salary, hire_date) VALUES
      ('John Doe', 'Engineering', 75000, '2020-01-15'),
      ('Jane Smith', 'Marketing', 65000, '2019-03-20'),
      ('Bob Johnson', 'Engineering', 80000, '2018-06-10'),
      ('Alice Williams', 'Sales', 70000, '2021-02-05'),
      ('Charlie Brown', 'Engineering', 72000, '2020-11-12');
    `);

    await client.query(`
      INSERT INTO departments (name, location) VALUES
      ('Engineering', 'Building A'),
      ('Marketing', 'Building B'),
      ('Sales', 'Building C'),
      ('HR', 'Building A');
    `);

    await client.query(`
      INSERT INTO orders (customer_id, product_name, quantity, price, order_date) VALUES
      (1, 'Laptop', 1, 1200.00, '2023-01-15'),
      (1, 'Mouse', 2, 25.00, '2023-01-15'),
      (2, 'Keyboard', 1, 75.00, '2023-02-20'),
      (3, 'Monitor', 1, 300.00, '2023-03-10'),
      (2, 'Laptop', 1, 1200.00, '2023-04-05');
    `);

    console.log('PostgreSQL initialized with sample data');
  } catch (error) {
    console.error('Error initializing PostgreSQL:', error);
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Initialize MongoDB with sample assignments
 */
const initMongoDB = async () => {
  await connectMongoDB();
  const db = getMongoDB();

  const assignments = [
    {
      _id: 'assignment-1',
      title: 'Basic SELECT Query',
      difficulty: 'Easy',
      description: 'Learn to retrieve data from a single table',
      question: 'Write a SQL query to retrieve all employees from the Engineering department.',
      requirements: [
        'Use the employees table',
        'Filter by department = "Engineering"',
        'Return all columns'
      ],
      sampleData: {
        tables: [
          {
            name: 'employees',
            columns: [
              { name: 'id', type: 'INTEGER', description: 'Employee ID' },
              { name: 'name', type: 'VARCHAR(100)', description: 'Employee name' },
              { name: 'department', type: 'VARCHAR(50)', description: 'Department name' },
              { name: 'salary', type: 'DECIMAL(10,2)', description: 'Employee salary' },
              { name: 'hire_date', type: 'DATE', description: 'Hire date' }
            ],
            sampleRows: [
              { id: 1, name: 'John Doe', department: 'Engineering', salary: 75000, hire_date: '2020-01-15' },
              { id: 2, name: 'Jane Smith', department: 'Marketing', salary: 65000, hire_date: '2019-03-20' },
              { id: 3, name: 'Bob Johnson', department: 'Engineering', salary: 80000, hire_date: '2018-06-10' }
            ]
          }
        ]
      }
    },
    {
      _id: 'assignment-2',
      title: 'Aggregate Functions',
      difficulty: 'Medium',
      description: 'Use aggregate functions to calculate statistics',
      question: 'Write a SQL query to find the average salary of all employees.',
      requirements: [
        'Use the employees table',
        'Calculate the average salary',
        'Use the AVG() function'
      ],
      sampleData: {
        tables: [
          {
            name: 'employees',
            columns: [
              { name: 'id', type: 'INTEGER' },
              { name: 'name', type: 'VARCHAR(100)' },
              { name: 'department', type: 'VARCHAR(50)' },
              { name: 'salary', type: 'DECIMAL(10,2)' },
              { name: 'hire_date', type: 'DATE' }
            ],
            sampleRows: [
              { id: 1, name: 'John Doe', department: 'Engineering', salary: 75000, hire_date: '2020-01-15' },
              { id: 2, name: 'Jane Smith', department: 'Marketing', salary: 65000, hire_date: '2019-03-20' },
              { id: 3, name: 'Bob Johnson', department: 'Engineering', salary: 80000, hire_date: '2018-06-10' }
            ]
          }
        ]
      }
    },
    {
      _id: 'assignment-3',
      title: 'JOIN Operations',
      difficulty: 'Hard',
      description: 'Combine data from multiple tables using JOINs',
      question: 'Write a SQL query to find all employees with their department locations. Show employee name and department location.',
      requirements: [
        'Use both employees and departments tables',
        'Join on the department name',
        'Return employee name and department location'
      ],
      sampleData: {
        tables: [
          {
            name: 'employees',
            columns: [
              { name: 'id', type: 'INTEGER' },
              { name: 'name', type: 'VARCHAR(100)' },
              { name: 'department', type: 'VARCHAR(50)' },
              { name: 'salary', type: 'DECIMAL(10,2)' }
            ],
            sampleRows: [
              { id: 1, name: 'John Doe', department: 'Engineering', salary: 75000 },
              { id: 2, name: 'Jane Smith', department: 'Marketing', salary: 65000 }
            ]
          },
          {
            name: 'departments',
            columns: [
              { name: 'id', type: 'INTEGER' },
              { name: 'name', type: 'VARCHAR(50)' },
              { name: 'location', type: 'VARCHAR(100)' }
            ],
            sampleRows: [
              { id: 1, name: 'Engineering', location: 'Building A' },
              { id: 2, name: 'Marketing', location: 'Building B' }
            ]
          }
        ]
      }
    }
  ];

  // Clear existing assignments
  await db.collection('assignments').deleteMany({});
  
  // Insert sample assignments
  await db.collection('assignments').insertMany(assignments);
  
  console.log('MongoDB initialized with sample assignments');
};

// Run initialization
const init = async () => {
  try {
    await initPostgreSQL();
    await initMongoDB();
    console.log('Database initialization complete!');
    process.exit(0);
  } catch (error) {
    console.error('Initialization failed:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  init();
}

module.exports = { initPostgreSQL, initMongoDB };

