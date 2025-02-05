const express = require('express');
const router = express.Router();
const moment = require('moment');
const User = require('../models/User'); // Adjust path to your User model

// Route: Efficiency Graph
router.get('/efficiency-graph', async (req, res) => {
    try {
        const users = await User.find();
        const efficiencyData = [];

        users.forEach(user => {
            const casteProcessingTime = calculateProcessingTime(user.casteApplication.requestDate, user.casteApplication.actualDate, 'caste');
            const incomeProcessingTime = calculateProcessingTime(user.incomeApplication.requestDate, user.incomeApplication.actualDate, 'income');
            const ewsProcessingTime = calculateProcessingTime(user.ewsApplication.requestDate, user.ewsApplication.actualDate, 'ews');

            const totalProcessingTime = (casteProcessingTime + incomeProcessingTime + ewsProcessingTime) / 3;
            const efficiency = totalProcessingTime <= 6 ? 'Efficient' : 'Inefficient';

            efficiencyData.push({
                area: user.casteApplication.state, // Adjust for district/mandal/village if needed
                casteProcessingTime,
                incomeProcessingTime,
                ewsProcessingTime,
                totalProcessingTime,
                efficiency
            });
        });

        res.render('efficiencyGraph', { efficiencyData });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ message: 'Error fetching data' });
    }
});

// Helper function: Calculate processing time
function calculateProcessingTime(requestDate, actualDate, type) {
    const processingTimes = { caste: 5, income: 6, ews: 3 };
    const processingTime = processingTimes[type];

    if (actualDate) {
        return moment(actualDate).diff(moment(requestDate), 'days');
    }
    return processingTime; // Expected processing time
}

module.exports = router;
