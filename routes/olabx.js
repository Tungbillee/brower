const express = require('express');
const router = express.Router();
const { getOlabxToken } = require('../services/open-olabx_token');

// POST /api/olabx/get-token
router.post('/get-token', async (req, res) => {
    try {
        console.log('🎨 Starting Olabx token retrieval...');
        const result = await getOlabxToken();
        console.log('✅ Olabx token retrieved successfully');
        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('❌ Olabx token error:', error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;
