const express = require('express');
const router = express.Router();
const User = require('../models/User');  // Make sure the path is correct to your User model

// Your efficiency route
router.get('/staff-efficiency-comparison', async (req, res) => {
    try {
        const users = await User.find(); // Make sure this query returns the necessary data
        const efficiencyData = [];

        users.forEach(user => {
            // Calculate processing times for each certificate type
            const casteProcessingTime = calculateProcessingTime(user.casteApplication.requestDate, user.casteApplication.actualDate, 'caste');
            const incomeProcessingTime = calculateProcessingTime(user.incomeApplication.requestDate, user.incomeApplication.actualDate, 'income');
            const ewsProcessingTime = calculateProcessingTime(user.ewsApplication.requestDate, user.ewsApplication.actualDate, 'ews');

            const areaData = {
                area: user.casteApplication.state,  // Change based on how you want to show areas
                casteProcessingTime,
                incomeProcessingTime,
                ewsProcessingTime
            };

            const { totalProcessingTime, efficiency, suggestion } = calculateEfficiency([casteProcessingTime, incomeProcessingTime, ewsProcessingTime]);

            areaData.totalProcessingTime = totalProcessingTime;
            areaData.efficiency = efficiency;
            areaData.suggestion = suggestion;

            efficiencyData.push(areaData);
        });

        res.render('efficiency-comparison', { efficiencyData }); 
    } catch (error) {
        console.error('Error fetching staff efficiency data:', error);
        res.status(500).send('Server error');
    }
});

module.exports = router;
