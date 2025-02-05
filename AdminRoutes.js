const express = require('express');
const axios = require('axios');
const router = express.Router();
const User = require('../models/User');  // Adjust the path if needed


router.get('/Admin', async (req, res) => {
    const state = 'state1'; // Replace with dynamic state if needed

    try {
        // Fetch data from the APIs
        const [casteResponse, incomeResponse, ewsResponse] = await Promise.all([
            axios.get(`http://localhost:3000/user-count/state/${state}`),
            axios.get(`http://localhost:3000/income-count/state/${state}`),
            axios.get(`http://localhost:3000/ews-count/state/${state}`),
        ]);

        // Extract counts from API responses
        const casteCount = casteResponse.data.count || 0;
        const incomeCount = incomeResponse.data.count || 0;
        const ewsCount = ewsResponse.data.count || 0;
        const totalRequests = casteCount + incomeCount + ewsCount;

        // Render the admin page with data
        res.render('admin', {
            state,
            casteCount,
            incomeCount,
            ewsCount,
            totalRequests,
        });
    } catch (error) {
        console.error('Error fetching data for admin dashboard:', error);
        res.status(500).send('Error fetching data for admin dashboard');
    }
});
// Example route for admin dashboard
router.get('/', (req, res) => {
    res.render('admin');  // Ensure you have an admin-dashboard.ejs file
});

router.get('/admin', async (req, res) => {
    const state = 'state1';  // Or retrieve this dynamically if necessary
    
    try {
        // Fetch the total requests data for the state (you can modify this to your API endpoint)
        const response = await fetch(`http://localhost:5000/api/users/user-count/state/${state}`);
        const data = await response.json();

        // Extract the count (or any other data you need)
        const totalRequests = data.count || 0;

        // Pass the data to the EJS view
        res.render('admin', {
            state: 'state1',
            totalRequests: totalRequests,
        });

    } catch (error) {
        console.error('Error fetching data for admin dashboard:', error);
        res.status(500).send('Error fetching data');
    }
});

// Admin - View Application Details
router.get('/admin/view-application/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.render('admin/viewApplication', { user });
    } catch (error) {
        res.status(500).send('Error fetching user data');
    }
});
// routes/adminRoutes.js

// router.get('/pending-applications', async (req, res) => {
//     console.log("Received request for pending applications");

//     try {
//         const usersWithPendingApplications = await User.find({
//             $or: [
//                 { 'casteApplication.status': 'Pending' },
//                 { 'incomeApplication.status': 'Pending' },
//                 { 'ewsApplication.status': 'Pending' }
//             ]
//         }).select('name email casteApplication incomeApplication ewsApplication');

//         console.log("Users with pending applications:", usersWithPendingApplications);
//         res.render('admin/pendingApplications', { users: usersWithPendingApplications });
//     } catch (error) {
//         console.error('Error fetching pending applications:', error);
//         res.status(500).send('Error fetching pending applications');
//     }
// });
 // Adjust the path to your User model

// Route to render the pending applications page
function verifyAdminPassword(req, res, next) {
    const password = req.query.password; // Retrieve the password from query params

    if (password === '123') {
        next(); // Allow access if the password is correct
    } else {
        res.status(401).send('Unauthorized: Incorrect Password'); // Deny access
    }
}
router.get('/pending-applications', async (req, res) => {
    console.log("Received request for pending applications");

    try {
        // Fetch users with pending applications
        const usersWithPendingApplications = await User.find({
            $or: [
                { 'casteApplication.status': 'Pending' },
                { 'incomeApplication.status': 'Pending' },
                { 'ewsApplication.status': 'Pending' }
            ]
        }).select('name email casteApplication incomeApplication ewsApplication');

        console.log("Users with pending applications:", usersWithPendingApplications);

        // Render the EJS page and pass the user data
        res.render('admin/pendingApplications', { users: usersWithPendingApplications });
    } catch (error) {
        console.error('Error fetching pending applications:', error);
        res.status(500).send('Error fetching pending applications');
    }
});

module.exports = router;

router.get('/h', async (req, res) => {
    console.log("Received request for pending applications");

    try {
        // Fetch users with pending applications
        const usersWithPendingApplications = await User.find({
            $or: [
                { 'casteApplication.status': 'Pending' },
                { 'incomeApplication.status': 'Pending' },
                { 'ewsApplication.status': 'Pending' }
            ]
        }).select('name email casteApplication incomeApplication ewsApplication');

        console.log("Users with pending applications:", usersWithPendingApplications);

        // Render the EJS template located at views/admin/pendingApplications.ejs
        res.render('admin/pendingApplications', { users: usersWithPendingApplications });
    } catch (error) {
        console.error('Error fetching pending applications:', error);
        res.status(500).send('Error fetching pending applications');
    }
});
// router.post('/complete/caste/:userId', async (req, res) => {
//     try {
//         const user = await User.findById(req.params.userId);
//         if (!user) return res.status(404).json({ message: 'User not found' });

//         // Update the status
//         user.casteApplication.status = 'Completed';
//         await user.save();

//         res.redirect('/admin/pending-applications');
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Error marking caste application as completed');
//     }
// });

// // Similarly for income and EWS
// router.post('/complete/income/:userId', async (req, res) => {
//     try {
//         const user = await User.findById(req.params.userId);
//         if (!user) return res.status(404).json({ message: 'User not found' });

//         // Update the status
//         user.incomeApplication.status = 'Completed';
//         await user.save();

//         res.redirect('/admin/pending-applications');
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Error marking income application as completed');
//     }
// });

// router.post('/complete/ews/:userId', async (req, res) => {
//     try {
//         const user = await User.findById(req.params.userId);
//         if (!user) return res.status(404).json({ message: 'User not found' });

//         // Update the status
//         user.ewsApplication.status = 'Completed';
//         await user.save();

//         res.redirect('/admin/pending-applications');
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Error marking EWS application as completed');
//     }
// });
// router.post('/update-status', async (req, res) => {
//     const { userId, certificateType, newStatus } = req.body;

//     try {
//         const user = await User.findById(userId);
//         if (!user) return res.status(404).json({ message: 'User not found' });

//         // Update the status of the specified certificate type
//         if (certificateType === 'caste' && user.casteApplication) {
//             user.casteApplication.status = newStatus;
//         } else if (certificateType === 'income' && user.incomeApplication) {
//             user.incomeApplication.status = newStatus;
//         } else if (certificateType === 'ews' && user.ewsApplication) {
//             user.ewsApplication.status = newStatus;
//         } else {
//             return res.status(400).json({ message: 'Invalid certificate type or no pending application' });
//         }

//         await user.save();
//         res.status(200).json({ message: 'Status updated successfully' });
//     } catch (error) {
//         console.error('Error updating status:', error);
//         res.status(500).json({ message: 'Error updating status' });
//     }
// });
 // Update status for a certificate application
 
router.post('/admin/update-status', async (req, res) => {
    const { userId, certificateType, newStatus } = req.body;

    try {
        // Log the incoming request data
        console.log('Received request to update status:', { userId, certificateType, newStatus });

        // Find the user by their ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the status based on the certificateType
        switch (certificateType) {
            case 'caste':
                if (user.casteApplication) {
                    user.casteApplication.status = newStatus;
                } else {
                    return res.status(400).json({ message: 'Caste application not found' });
                }
                break;
            case 'income':
                if (user.incomeApplication) {
                    user.incomeApplication.status = newStatus;
                } else {
                    return res.status(400).json({ message: 'Income application not found' });
                }
                break;
            case 'ews':
                if (user.ewsApplication) {
                    user.ewsApplication.status = newStatus;
                } else {
                    return res.status(400).json({ message: 'EWS application not found' });
                }
                break;
            default:
                return res.status(400).json({ message: 'Invalid certificate type' });
        }

        // Save the updated user data
        await user.save();

        // Send success response
        // res.status(200).json({ message: 'Status updated successfully' });

        res.status(200).json({ message: 'Status updated successfully' });
    } catch (error) {
        // Log the error with more details for debugging
        console.error('Error during status update:', error);

        // Send detailed error response
        res.status(500).json({
            message: 'Error updating status',
            error: error.message,  // Send the error message to help with debugging
            stack: error.stack      // Send the stack trace (useful for debugging)
        });
    }
});



module.exports = router;
