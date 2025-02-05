const express = require('express');
const router = express.Router();
const { calculateStaffEfficiency } = require('./staffEfficiency');

router.get('/staff-efficiency', async (req, res) => {
    try {
        const efficiencyData = await calculateStaffEfficiency();
        res.json(efficiencyData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
