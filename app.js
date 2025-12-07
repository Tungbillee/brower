require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3050;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const tiktokRoutes = require('./routes/tiktok');
const olabxRoutes = require('./routes/olabx');
const olabxCookiesRoutes = require('./routes/olabx-cookies');
const opalRoutes = require('./routes/opal');

app.use('/api/tiktok', tiktokRoutes);
app.use('/api/olabx', olabxRoutes);
app.use('/api/olabx-cookies', olabxCookiesRoutes);
app.use('/api/opal', opalRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'browser-service' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(500).json({ error: err.message });
});

app.listen(PORT, () => {
    console.log(`🚀 Browser Service running on port ${PORT}`);
    console.log(`📡 Endpoints:`);
    console.log(`   - GET  /health`);
    console.log(`   - POST /api/tiktok/get-cookie`);
    console.log(`   - POST /api/olabx/get-token`);
    console.log(`   - POST /api/olabx-cookies/get-cookie`);
    console.log(`   - POST /api/opal/get-token`);
});
