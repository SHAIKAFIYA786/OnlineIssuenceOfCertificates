// const express = require('express');
// const router = express.Router();
// router.get('/staff-efficiency-comparison', async (req, res) => {
//     try {
//         // Fetch application data for all users
//         const users = await User.find(); // You may adjust this query based on your schema
        
//         // Initialize variables for calculating times and efficiency
//         let state1Data = {
//             caste: { total: 0, count: 0 },
//             income: { total: 0, count: 0 },
//             ews: { total: 0, count: 0 }
//         };
//         let state2Data = {
//             caste: { total: 0, count: 0 },
//             income: { total: 0, count: 0 },
//             ews: { total: 0, count: 0 }
//         };
        
//         // Loop through each user and calculate total times for each certificate type
//         users.forEach(user => {
//             if (user.casteApplication) {
//                 if (user.casteApplication.state === 'state1') {
//                     state1Data.caste.total += 5; // Caste certificate takes 5 days
//                     state1Data.caste.count += 1;
//                 } else if (user.casteApplication.state === 'state2') {
//                     state2Data.caste.total += 5;
//                     state2Data.caste.count += 1;
//                 }
//             }
//             if (user.incomeApplication) {
//                 if (user.incomeApplication.state === 'state1') {
//                     state1Data.income.total += 6; // Income certificate takes 6 days
//                     state1Data.income.count += 1;
//                 } else if (user.incomeApplication.state === 'state2') {
//                     state2Data.income.total += 6;
//                     state2Data.income.count += 1;
//                 }
//             }
//             if (user.ewsApplication) {
//                 if (user.ewsApplication.state === 'state1') {
//                     state1Data.ews.total += 3; // EWS certificate takes 3 days
//                     state1Data.ews.count += 1;
//                 } else if (user.ewsApplication.state === 'state2') {
//                     state2Data.ews.total += 3;
//                     state2Data.ews.count += 1;
//                 }
//             }
//         });

//         // Calculate average processing times for each certificate type and total
//         const calculateAverage = (data) => ({
//             casteAverage: data.caste.count > 0 ? data.caste.total / data.caste.count : 0,
//             incomeAverage: data.income.count > 0 ? data.income.total / data.income.count : 0,
//             ewsAverage: data.ews.count > 0 ? data.ews.total / data.ews.count : 0,
//             totalAverage: (data.caste.total + data.income.total + data.ews.total) / (data.caste.count + data.income.count + data.ews.count)
//         });

//         const state1Averages = calculateAverage(state1Data);
//         const state2Averages = calculateAverage(state2Data);

//         // Calculate efficiency
//         const efficiency = (averageTime) => {
//             return averageTime <= 5 ? 'Efficient' : 'Inefficient'; // Assuming 5 days as the threshold
//         };

//         // Render the results in EJS template
//         res.render('staff-efficiency-comparison', {
//             state1: state1Averages,
//             state2: state2Averages,
//             state1Efficiency: efficiency(state1Averages.totalAverage),
//             state2Efficiency: efficiency(state2Averages.totalAverage)
//         });
//     } catch (error) {
//         console.error('Error fetching staff efficiency data:', error);
//         res.status(500).send('Server error');
//     }
// });
const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Make sure this path is correct

// Route to fetch efficiency data for all areas
router.get('/staff-efficiency-comparison', async (req, res) => {
    try {
        const users = await User.find(); // Adjust query if necessary
        const efficiencyData = [];

        users.forEach(user => {
            const casteProcessingTime = calculateProcessingTime(user.casteApplication.requestDate, user.casteApplication.actualDate, 'caste');
            const incomeProcessingTime = calculateProcessingTime(user.incomeApplication.requestDate, user.incomeApplication.actualDate, 'income');
            const ewsProcessingTime = calculateProcessingTime(user.ewsApplication.requestDate, user.ewsApplication.actualDate, 'ews');

            const areaData = {
                area: user.casteApplication.state, // You can adjust to include district, mandal, village if needed
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
