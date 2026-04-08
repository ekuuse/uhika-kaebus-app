const cors = require('cors');

const configuredOrigins = [
    Bun.env.ADMIN_FRONTEND_URL,
    Bun.env.FRONTEND_ADMIN_URL,
    Bun.env.FRONTEND_URL,
].filter(Boolean);

const defaultOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:4173',
    'http://127.0.0.1:4173',
];

const allowedOrigins = [...new Set([...configuredOrigins, ...defaultOrigins])];

const corsOptions = {
    origin(origin, callback) {
        // Allow tools like curl/Postman that do not send an Origin header.
        if (!origin) {
            return callback(null, true);
        }

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    optionsSuccessStatus: 200
};

module.exports = cors(corsOptions);