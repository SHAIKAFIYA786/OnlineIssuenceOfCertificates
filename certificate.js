const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Apply for Caste Certificate
router.post('/apply/caste', async (req, res) => {
    const { state, district, mandal, village, caste, dob, address } = req.body;
    try {
        const user = await User.findById(req.user.id);  // Assuming req.user has user info
        if (!user) {
            return res.status(404).send('User not found');
        }

        if (user.casteApplication.state) {
            return res.status(400).send('You have already applied for a caste certificate');
        }

        user.casteApplication = { state, district, mandal, village, caste, dob, address };
        user.casteApplication.expectedDate = new Date(new Date().setDate(new Date().getDate() + 5)); // 5 days
        await user.save();

        res.send('Caste Certificate Application submitted successfully!');
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error in submitting application');
    }
});

// Apply for Income Certificate
router.post('/apply/income', async (req, res) => {
    const { state, district, mandal, village, income, address } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).send('User not found');
        }

        if (user.incomeApplication.state) {
            return res.status(400).send('You have already applied for an income certificate');
        }

        user.incomeApplication = { state, district, mandal, village, income, address };
        user.incomeApplication.expectedDate = new Date(new Date().setDate(new Date().getDate() + 6)); // 6 days
        await user.save();

        res.send('Income Certificate Application submitted successfully!');
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error in submitting application');
    }
});

// Apply for EWS Certificate
router.post('/apply/ews', async (req, res) => {
    const { state, district, mandal, village, income, address } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).send('User not found');
        }

        if (user.ewsApplication.state) {
            return res.status(400).send('You have already applied for an EWS certificate');
        }

        user.ewsApplication = { state, district, mandal, village, income, address };
        user.ewsApplication.expectedDate = new Date(new Date().setDate(new Date().getDate() + 3)); // 3 days
        await user.save();

        res.send('EWS Certificate Application submitted successfully!');
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error in submitting application');
    }
});

module.exports = router;
