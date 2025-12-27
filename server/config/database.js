const { Pool } = require('pg');
const { MongoClient } = require('mongodb');

// PostgreSQL Pool (Sandbox Database)
const pgPool = new Pool({
    host: process.env.POSTGRES_HOST || 'localhost',
    port: process.env.POSTGRES_PORT || 5432,
    database: process.env.POSTGRES_DB || 'ciphersqlstudio',
    user: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

// Test PostgreSQL connection
pgPool.on('connect', () => {
    console.log('PostgreSQL connected');
});

pgPool.on('error', (err) => {
    console.error('Unexpected error on idle PostgreSQL client', err);
});

// MongoDB Client (Persistence Database)
let mongoClient = null;
let mongoDb = null;

const connectMongoDB = async () => {
    try {
        if (!mongoClient) {
            mongoClient = new MongoClient(process.env.MONGODB_URI);
            await mongoClient.connect();
            mongoDb = mongoClient.db('ciphersqlstudio');
            console.log('MongoDB connected');
        }
        return mongoDb;
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
};

const getMongoDB = () => {
    if (!mongoDb) {
        throw new Error('MongoDB not connected. Call connectMongoDB first.');
    }
    return mongoDb;
};

module.exports = {
    pgPool,
    connectMongoDB,
    getMongoDB,
};
