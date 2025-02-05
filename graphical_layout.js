const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  // Replace with actual data from the database
  const data = {
    state: 'State1',
    total: 100,
    caste: 40,
    income: 30,
    ews: 30
  };

  res.render('graphical_layout', data);
});
const express = require('express');
const router = express.Router();
const Certificate = require('../models/certificate');  // Assuming the certificate schema

// Route to render the graphical layout page
router.get('/graphical-layout', async (req, res) => {
    try {
        // Fetch the certificate data grouped by state, district, and mandal (example)
        const statesData = await Certificate.aggregate([
            {
                $group: {
                    _id: "$state",
                    caste: { $sum: { $cond: [{ $eq: ["$certificateType", "Caste"] }, 1, 0] } },
                    income: { $sum: { $cond: [{ $eq: ["$certificateType", "Income"] }, 1, 0] } },
                    ews: { $sum: { $cond: [{ $eq: ["$certificateType", "EWS"] }, 1, 0] } },
                    total: { $sum: 1 }  // Total requests
                }
            }
        ]);

        const districtsData = await Certificate.aggregate([
            {
                $group: {
                    _id: "$district",
                    caste: { $sum: { $cond: [{ $eq: ["$certificateType", "Caste"] }, 1, 0] } },
                    income: { $sum: { $cond: [{ $eq: ["$certificateType", "Income"] }, 1, 0] } },
                    ews: { $sum: { $cond: [{ $eq: ["$certificateType", "EWS"] }, 1, 0] } },
                    total: { $sum: 1 }  // Total requests
                }
            }
        ]);

        const mandalsData = await Certificate.aggregate([
            {
                $group: {
                    _id: "$mandal",
                    caste: { $sum: { $cond: [{ $eq: ["$certificateType", "Caste"] }, 1, 0] } },
                    income: { $sum: { $cond: [{ $eq: ["$certificateType", "Income"] }, 1, 0] } },
                    ews: { $sum: { $cond: [{ $eq: ["$certificateType", "EWS"] }, 1, 0] } },
                    total: { $sum: 1 }  // Total requests
                }
            }
        ]);

        // Format the data for EJS
        const results = {
            states: {
                state1: statesData.find(state => state._id === 'state1') || { caste: 0, income: 0, ews: 0, total: 0 },
                state2: statesData.find(state => state._id === 'state2') || { caste: 0, income: 0, ews: 0, total: 0 }
            },
            districts: {
                district1: districtsData.find(district => district._id === 'district1') || { caste: 0, income: 0, ews: 0, total: 0 },
                district2: districtsData.find(district => district._id === 'district2') || { caste: 0, income: 0, ews: 0, total: 0 }
            },
            mandals: {
                mandal1: mandalsData.find(mandal => mandal._id === 'mandal1') || { caste: 0, income: 0, ews: 0, total: 0 },
                mandal2: mandalsData.find(mandal => mandal._id === 'mandal2') || { caste: 0, income: 0, ews: 0, total: 0 }
            }
        };

        // Render the 'graphical-layout' EJS page with the data
        res.render('graphical-layout', { results });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send("Internal Server Error");
    }
});

// module.exports = router;

module.exports = router;
