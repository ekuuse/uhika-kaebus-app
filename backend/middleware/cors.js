const cors = require('cors');

const corsOptions = {
    origin: ['localhost:8081', 'http://localhost:8081', 'http://localhost:8081/'],
    credentials: true,
    optionsSuccessStatus: 200
};

module.exports = cors(corsOptions);