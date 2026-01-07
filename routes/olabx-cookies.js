const express = require('express');
const router = express.Router();
const { getOlabxCookie, CHROME_PROFILES } = require('../services/open-olabx_cookies');

// POST /api/olabx-cookies/get-cookie
router.post('/get-cookie', async (req, res) => {
    try {
        const { profileIndex = 0 } = req.body;
        console.log(`🍪 Starting Olabx cookie retrieval (profile ${profileIndex}/${CHROME_PROFILES.length - 1})...`);
        const result = await getOlabxCookie(profileIndex);
        console.log('✅ Olabx cookie retrieved successfully');
        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('❌ Olabx cookie error:', error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;
