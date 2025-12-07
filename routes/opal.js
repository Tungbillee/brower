const express = require('express');
const router = express.Router();
const { getOpalToken } = require('../services/open-opal');

// POST /api/opal/get-token
router.post('/get-token', async (req, res) => {
    try {
        console.log('🔮 Starting Opal token retrieval...');
        const result = await getOpalToken();
        console.log('✅ Opal token retrieved successfully');
        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('❌ Opal token error:', error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;
