const cors = require('cors');

const configuredOrigins = [
    process.env.ADMIN_FRONTEND_URL,
    process.env.FRONTEND_ADMIN_URL,
    process.env.FRONTEND_URL,
].filter(Boolean);

const defaultOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:4173',
    'http://127.0.0.1:4173',
    'http://localhost:8081',
    'http://127.0.0.1:8081',
    'http://localhost:19006',
    'http://127.0.0.1:19006',
];

const allowedOrigins = [...new Set([...configuredOrigins, ...defaultOrigins])];

const corsOptions = {
    origin(origin, callback) {
        // Allow requests with no Origin (mobile apps, curl, Postman).
        if (!origin) {
            return callback(null, true);
        }

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    optionsSuccessStatus: 200,
};

module.exports = cors(corsOptions);