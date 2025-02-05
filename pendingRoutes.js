const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');

router.get('/pending-applications', async (req, res) => {
    try {
        // Filter pending applications where requestDate matches a specific date
        const requestDate = new Date('2024-12-02T09:11:22.823+00:00'); // Target date

        console.log(`Fetching pending applications for requestDate: ${requestDate}`);

        const users = await User.find({
            $or: [
                {
                    'casteApplication.status': 'Pending',
                    'casteApplication.requestDate': requestDate,
                },
                {
                    'incomeApplication.status': 'Pending',
                    'incomeApplication.requestDate': requestDate,
                },
                {
                    'ewsApplication.status': 'Pending',
                    'ewsApplication.requestDate': requestDate,
                },
            ],
        });

        console.log('Pending Users:', users);

        // Render the pending applications template
        res.render('admin/pendingApplications', { users });
    } catch (error) {
        console.error('Error fetching pending applications:', error);
        res.status(500).send('Server error');
    }
});

// Route to render scanning illusion
router.get('/verify-documents/:userId', (req, res) => {
    const { userId } = req.params;
    res.render('scanningPage', { userId });
});

// Route to update application status to "Accepted"
router.post('/mark-completed/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const currentDate = new Date();

        const user = await User.findById(userId);

        if (user.casteApplication?.status === 'Pending') {
            user.casteApplication.status = 'Accepted';
            user.casteApplication.actualDate = currentDate;
        } else if (user.incomeApplication?.status === 'Pending') {
            user.incomeApplication.status = 'Accepted';
            user.incomeApplication.actualDate = currentDate;
        } else if (user.ewsApplication?.status === 'Pending') {
            user.ewsApplication.status = 'Accepted';
            user.ewsApplication.actualDate = currentDate;
        }

        await user.save();

        res.redirect(`/admin/pending-applications?state=${user.casteApplication?.state || user.incomeApplication?.state || user.ewsApplication?.state}`);
    } catch (error) {
        console.error('Error marking as completed:', error);
        res.status(500).send('Server error');
    }
});
// AdminRoutes.js
router.post('/mark-completed', async (req, res) => {
    const { userId, applicationType } = req.body;

    try {
        // Ensure applicationType is valid (casteApplication, incomeApplication, or ewsApplication)
        if (!['casteApplication', 'incomeApplication', 'ewsApplication'].includes(applicationType)) {
            return res.status(400).send('Invalid application type');
        }

        // Find the user and update the specific application
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                [`${applicationType}.status`]: 'Accepted', // Update status to 'Accepted'
                [`${applicationType}.actualDate`]: new Date(), // Set the actualDate to now
            },
            { new: true } // Ensure the updated user is returned
        );

        // Redirect back to the pending applications page
        res.redirect('/admin/pending-applications');
    } catch (error) {
        console.error('Error updating the application:', error);
        res.status(500).send('Error marking the application as completed');
    }
});


module.exports = router;
