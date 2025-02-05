const express = require('express');
const User = require('../models/User'); // Adjust the path according to your project structure
const router = express.Router();

// Function to calculate the delay in processing
const calculateEfficiency = (certificate, certificateType) => {
    let expectedDate = new Date(certificate.expectedDate);
    let actualDate = new Date(certificate.actualDate);

    if (!actualDate || !expectedDate) return null;

    const timeDiff = (actualDate - expectedDate) / (1000 * 3600 * 24);  // Time difference in days

    return {
        state: certificate.state,
        district: certificate.district,
        mandal: certificate.mandal,
        type: certificateType,
        expectedTime: certificateType === 'Caste' ? 2 : certificateType === 'Income' ? 3 : 5,  // Custom expected time based on certificate type
        actualTime: timeDiff,
        efficiency: timeDiff <= (certificateType === 'Caste' ? 2 : certificateType === 'Income' ? 3 : 5) ? 'Efficient' : 'Inefficient'
    };
};

// Function to calculate efficiency at different levels
const getEfficiencyAtLevels = (users) => {
    const stateEfficiency = {};
    const districtEfficiency = {};
    const mandalEfficiency = {};

    users.forEach(user => {
        if (user.casteApplication && user.casteApplication.expectedDate && user.casteApplication.actualDate) {
            const casteEfficiency = calculateEfficiency(user.casteApplication, 'Caste');
            stateEfficiency[casteEfficiency.state] = stateEfficiency[casteEfficiency.state] || [];
            stateEfficiency[casteEfficiency.state].push(casteEfficiency);

            districtEfficiency[casteEfficiency.state + '-' + casteEfficiency.district] = districtEfficiency[casteEfficiency.state + '-' + casteEfficiency.district] || [];
            districtEfficiency[casteEfficiency.state + '-' + casteEfficiency.district].push(casteEfficiency);

            mandalEfficiency[casteEfficiency.state + '-' + casteEfficiency.district + '-' + casteEfficiency.mandal] = mandalEfficiency[casteEfficiency.state + '-' + casteEfficiency.district + '-' + casteEfficiency.mandal] || [];
            mandalEfficiency[casteEfficiency.state + '-' + casteEfficiency.district + '-' + casteEfficiency.mandal].push(casteEfficiency);
        }

        if (user.incomeApplication && user.incomeApplication.expectedDate && user.incomeApplication.actualDate) {
            const incomeEfficiency = calculateEfficiency(user.incomeApplication, 'Income');
            stateEfficiency[incomeEfficiency.state] = stateEfficiency[incomeEfficiency.state] || [];
            stateEfficiency[incomeEfficiency.state].push(incomeEfficiency);

            districtEfficiency[incomeEfficiency.state + '-' + incomeEfficiency.district] = districtEfficiency[incomeEfficiency.state + '-' + incomeEfficiency.district] || [];
            districtEfficiency[incomeEfficiency.state + '-' + incomeEfficiency.district].push(incomeEfficiency);

            mandalEfficiency[incomeEfficiency.state + '-' + incomeEfficiency.district + '-' + incomeEfficiency.mandal] = mandalEfficiency[incomeEfficiency.state + '-' + incomeEfficiency.district + '-' + incomeEfficiency.mandal] || [];
            mandalEfficiency[incomeEfficiency.state + '-' + incomeEfficiency.district + '-' + incomeEfficiency.mandal].push(incomeEfficiency);
        }

        if (user.ewsApplication && user.ewsApplication.expectedDate && user.ewsApplication.actualDate) {
            const ewsEfficiency = calculateEfficiency(user.ewsApplication, 'EWS');
            stateEfficiency[ewsEfficiency.state] = stateEfficiency[ewsEfficiency.state] || [];
            stateEfficiency[ewsEfficiency.state].push(ewsEfficiency);

            districtEfficiency[ewsEfficiency.state + '-' + ewsEfficiency.district] = districtEfficiency[ewsEfficiency.state + '-' + ewsEfficiency.district] || [];
            districtEfficiency[ewsEfficiency.state + '-' + ewsEfficiency.district].push(ewsEfficiency);

            mandalEfficiency[ewsEfficiency.state + '-' + ewsEfficiency.district + '-' + ewsEfficiency.mandal] = mandalEfficiency[ewsEfficiency.state + '-' + ewsEfficiency.district + '-' + ewsEfficiency.mandal] || [];
            mandalEfficiency[ewsEfficiency.state + '-' + ewsEfficiency.district + '-' + ewsEfficiency.mandal].push(ewsEfficiency);
        }
    });

    return { stateEfficiency, districtEfficiency, mandalEfficiency };
};

router.get('/efficiency', async (req, res) => {
    try {
        const users = await User.find();
        const { stateEfficiency, districtEfficiency, mandalEfficiency } = getEfficiencyAtLevels(users);

        // Render the efficiency table with three levels of efficiency data
        res.render('efficiencyTable', {
            stateEfficiency,
            districtEfficiency,
            mandalEfficiency
        });
    } catch (error) {
        console.error("Error fetching efficiency data:", error);
        res.status(500).send("Error fetching efficiency data.");
    }
});

module.exports = router;
