const express = require('express');
const router = express.Router();
const { getOpalToken } = require('../services/open-opal');

// POST /api/opal/get-token
// Body: { type: 'google-opal_1' | 'google-opal_2' | ... | 'google-opal_5' }
router.post('/get-token', async (req, res) => {
    try {
        const { type = 'google-opal_1' } = req.body;
        console.log(`🔮 Starting Opal token retrieval for type: ${type}...`);

        const result = await getOpalToken(type);
        console.log(`✅ Opal token retrieved successfully for ${type}`);

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
