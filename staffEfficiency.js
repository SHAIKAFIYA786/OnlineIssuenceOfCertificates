// const express = require('express');
// const router = express.Router();
// const User = require('../models/userModel'); // Ensure this path is correct

// // Helper function to calculate backlog
// function calculateBacklog(expectedDate, actualDate) {
//   if (!expectedDate || !actualDate) return 0; // No backlog if either date is missing
//   const expected = new Date(expectedDate);
//   const actual = new Date(actualDate);
//   if (actual > expected) {
//     const diffTime = actual - expected;
//     return diffTime / (1000 * 3600 * 24); // Convert milliseconds to days
//   }
//   return 0;
// }

// // Function to calculate efficiency data for each application type
// function calculateEfficiency(users) {
//   const casteData = {};
//   const incomeData = {};
//   const ewsData = {};

//   users.forEach(user => {
//     // Process Caste Applications
//     if (user.casteApplication) {
//       const { state, district, mandal, expectedDate, actualDate, status } = user.casteApplication;
//       if (status === 'Accepted') {
//         const backlog = calculateBacklog(expectedDate, actualDate);

//         // Group by state, district, mandal for caste
//         if (!casteData[state]) casteData[state] = {};
//         if (!casteData[state][district]) casteData[state][district] = {};
//         if (!casteData[state][district][mandal]) casteData[state][district][mandal] = { totalBacklog: 0, count: 0 };

//         casteData[state][district][mandal].totalBacklog += backlog;
//         casteData[state][district][mandal].count += 1;
//       }
//     }

//     // Process Income Applications
//     if (user.incomeApplication) {
//       const { state, district, mandal, expectedDate, actualDate, status } = user.incomeApplication;
//       if (status === 'Accepted') {
//         const backlog = calculateBacklog(expectedDate, actualDate);

//         // Group by state, district, mandal for income
//         if (!incomeData[state]) incomeData[state] = {};
//         if (!incomeData[state][district]) incomeData[state][district] = {};
//         if (!incomeData[state][district][mandal]) incomeData[state][district][mandal] = { totalBacklog: 0, count: 0 };

//         incomeData[state][district][mandal].totalBacklog += backlog;
//         incomeData[state][district][mandal].count += 1;
//       }
//     }

//     // Process EWS Applications
//     if (user.ewsApplication) {
//       const { state, district, mandal, expectedDate, actualDate, status } = user.ewsApplication;
//       if (status === 'Accepted') {
//         const backlog = calculateBacklog(expectedDate, actualDate);

//         // Group by state, district, mandal for EWS
//         if (!ewsData[state]) ewsData[state] = {};
//         if (!ewsData[state][district]) ewsData[state][district] = {};
//         if (!ewsData[state][district][mandal]) ewsData[state][district][mandal] = { totalBacklog: 0, count: 0 };

//         ewsData[state][district][mandal].totalBacklog += backlog;
//         ewsData[state][district][mandal].count += 1;
//       }
//     }
//   });

//   // Calculate average backlog for each mandal, district, and state
//   const calculateAverage = (data) => {
//     for (const state in data) {
//       for (const district in data[state]) {
//         for (const mandal in data[state][district]) {
//           const mandalData = data[state][district][mandal];
//           mandalData.averageBacklog = mandalData.totalBacklog / mandalData.count;
//         }
//       }
//     }
//   };

//   calculateAverage(casteData);
//   calculateAverage(incomeData);
//   calculateAverage(ewsData);

//   return { casteData, incomeData, ewsData };
// }

// // Route to display efficiency tables
// router.get('/efficiency', async (req, res) => {
//   try {
//     const users = await User.find(); // Fetch all users with their application data
//     const { casteData, incomeData, ewsData } = calculateEfficiency(users);

//     res.render('efficiencyTable', { casteData, incomeData, ewsData });
//   } catch (error) {
//     console.error('Error fetching efficiency data:', error);
//     res.status(500).send('Internal Server Error');
//   }
// });

// module.exports = router;
const express = require('express');
const User = require('../models/User'); // Adjust according to your model structure
const router = express.Router();

// Define default processing times in case some values are missing
const defaultProcessingTimes = {
    caste: 5,   // Caste certificate default time: 5 days
    income: 6,  // Income certificate default time: 6 days
    ews: 3      // EWS certificate default time: 3 days
};

// Function to calculate processing time for each certificate
const calculateProcessingTime = (requestDate, actualDate, type) => {
    if (actualDate) {
        return (new Date(actualDate) - new Date(requestDate)) / (1000 * 3600 * 24);  // Difference in days
    }
    return defaultProcessingTimes[type]; // Return default value if actual date is not available
};

// Function to calculate efficiency and suggestion based on average processing time
const calculateEfficiency = (processingTimes) => {
    const totalProcessingTime = processingTimes.reduce((sum, time) => sum + time, 0) / processingTimes.length;
    const efficiency = totalProcessingTime <= 6 ? 'Efficient' : 'Inefficient';  // 6 days as threshold
    const suggestion = efficiency === 'Inefficient' ? 
        'Reduce staff or reallocate staff to districts with fewer cases.' : 
        'No action required; staff is working efficiently.';
    
    return { totalProcessingTime, efficiency, suggestion };
};

// Route to fetch and calculate efficiency for all areas (state, district, mandal)
router.get('/staff-efficiency-comparison', async (req, res) => {
    try {
        const users = await User.find();  // Fetch all users' application data

        const efficiencyData = [];

        // Loop through each user to calculate efficiency data for state, district, mandal
        users.forEach(user => {
            // Retrieve processing times for each certificate type
            const casteProcessingTime = calculateProcessingTime(user.casteApplication.requestDate, user.casteApplication.actualDate, 'caste');
            const incomeProcessingTime = calculateProcessingTime(user.incomeApplication.requestDate, user.incomeApplication.actualDate, 'income');
            const ewsProcessingTime = calculateProcessingTime(user.ewsApplication.requestDate, user.ewsApplication.actualDate, 'ews');

            // Store the processing data for state, district, mandal
            const areaData = {
                area: user.casteApplication.state,   // You can also include district/mandal here if needed
                casteProcessingTime,
                incomeProcessingTime,
                ewsProcessingTime
            };

            // Calculate efficiency and suggestions
            const { totalProcessingTime, efficiency, suggestion } = calculateEfficiency([casteProcessingTime, incomeProcessingTime, ewsProcessingTime]);

            areaData.totalProcessingTime = totalProcessingTime;
            areaData.efficiency = efficiency;
            areaData.suggestion = suggestion;

            efficiencyData.push(areaData);
        });

        // Render the results to the EJS template
        res.render('staff-efficiency-comparison', { efficiencyData });

    } catch (error) {
        console.error('Error fetching staff efficiency data:', error);
        res.status(500).send('Server error');
    }
});

module.exports = router;
