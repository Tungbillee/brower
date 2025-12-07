const express = require('express');
const router = express.Router();
const { getCookieTiktok } = require('../services/get_cookie_tiktok');

// POST /api/tiktok/get-cookie
router.post('/get-cookie', async (req, res) => {
    try {
        console.log('📱 Starting TikTok cookie retrieval...');
        const result = await getCookieTiktok();
        console.log('✅ TikTok cookie retrieved successfully');
        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('❌ TikTok cookie error:', error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;
