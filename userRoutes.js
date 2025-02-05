const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const verifyToken = require('../middlewares/authMiddleware');
const dotenv = require('dotenv');
dotenv.config();
const router = express.Router();
router.post('/register', async (req, res) => {
    const { name, email, password, phone } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = new User({ name, email, password, phone });
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
});

// Login Route
// router.post('/login', async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         const isMatch = await user.matchPassword(password);
//         if (!isMatch) {
//             return res.status(400).json({ message: 'Invalid credentials' });
//         }

//         // Generate JWT token
//         const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//         res.cookie('token', token, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
//             sameSite: 'strict', // Prevent CSRF
//             maxAge: 15778463000, // 1 hour
//         });

//         // res.status(200).json({ message: 'Login successful', token, redirect: '/dashboard' });
//         // res.render('dashboard');
//         res.render('dashboard', { user });
//     } catch (error) {
//         res.status(500).json({ message: 'Error logging in', error });
//     }
// });
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the password matches
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token (expires in 1 hour)
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Send the token in a secure cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',  // Ensure cookies are secure in production
            sameSite: 'strict',  // Helps prevent CSRF attacks
            maxAge: 15778463000, // 1 hour
        });

        // Redirect or send response back
        // For example, redirect to the dashboard page after login
        res.render('dashboard', { user }); // Render the dashboard page and pass the user data

    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
});



// Update status of an application
router.post('/admin/update-status', async (req, res) => {
    const { userId, certificateType, newStatus } = req.body; // userId, certificateType (caste, income, or ews), newStatus (Completed)

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Update the status based on the certificate type
        if (certificateType === 'caste') {
            user.casteApplication.status = newStatus;
        } else if (certificateType === 'income') {
            user.incomeApplication.status = newStatus;
        } else if (certificateType === 'ews') {
            user.ewsApplication.status = newStatus;
        }

        await user.save();

        res.status(200).send('Status updated successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating status');
    }
});




// const authController = require('../controllers/authController');


// Apply for Caste Certificate Form
router.get('/apply/caste', (req, res) => {
    res.render('casteForm'); // Render caste form
});

// Apply for Income Certificate Form
router.get('/apply/income', (req, res) => {
    res.render('incomeForm'); // Render income form
});

// Apply for EWS Certificate Form
router.get('/apply/ews',(req, res) => {
    res.render('ewsForm'); // Render EWS form
});

// Caste Form Submission
// router.post('/apply/caste', verifyToken, async (req, res) => {
//     const { state, district, mandal, village, caste, dob, address } = req.body;

//     try {
//         const user = await User.findById(req.user.id);
//         if (!user) {
//             return res.status(404).send('User not found');
//         }
//         if (user.casteApplication && user.casteApplication.state) {
//             return res.status(400).send('You have already applied for a caste certificate');
//         }
//         // Store caste application data
//         user.casteApplication = { state, district, mandal, village, caste, dob, address };
//         await user.save();

//         res.send('Caste Certificate Application submitted successfully!');
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).send('Error in submitting application');
//     }
// });

// router.post('/apply/caste', verifyToken, async (req, res) => {
//     const { state, district, mandal, village, caste, dob, address } = req.body;

//     try {
//         const user = await User.findById(req.user.id);
//         if (!user) {
//             return res.status(404).send('User not found');
//         }

//         // Check if the user has already applied for a caste certificate
//         if (user.casteApplication && user.casteApplication.state) {
//             return res.status(400).send('You have already applied for a caste certificate');
//         }

//         // Store caste application data
//         user.casteApplication = { state, district, mandal, village, caste, dob, address };
//         await user.save();

//         res.send('Caste Certificate Application submitted successfully!');
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).send('Error in submitting application');
//     }
// });

// Income Certificate Application
// router.post('/apply/income',verifyToken, async (req, res) => {
//     const { income, state, district, mandal, village, address } = req.body;

//     try {
//         const user = await User.findById(req.user.id);
//         if (!user) {
//             return res.status(404).send('User not found');
//         }

//         // Check if the user has already applied for an income certificate
//         if (user.incomeApplication && user.incomeApplication.state) {
//             return res.status(400).send('You have already applied for an income certificate');
//         }

//         // Store income certificate data
//         user.incomeApplication = { income, state, district, mandal, village, address };
//         await user.save();

//         res.send('Income Certificate Application submitted successfully!');
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).send('Error in submitting application');
//     }
// });
// router.post('/apply/income', verifyToken, async (req, res) => {
//     const { income, state, district, mandal, village, address } = req.body;

//     try {
//         const user = await User.findById(req.user.id);  // req.user should have the decoded JWT info
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         // Check if the user has already applied for an income certificate
//         if (user.incomeApplication && user.incomeApplication.state) {
//             return res.status(400).json({ message: 'You have already applied for an income certificate' });
//         }

//         // Store income certificate data
//         user.incomeApplication = { income, state, district, mandal, village, address };
//         await user.save();

//         res.status(200).json({ message: 'Income Certificate Application submitted successfully!' });
//     } catch (error) {
//         console.error('Error in submitting application:', error.message);
//         res.status(500).json({ message: 'Error in submitting application', error });
//     }
// });
router.post('/apply/income', verifyToken, async (req, res) => {
    const { income, state, district, mandal, village, address } = req.body;

    try {
        const user = await User.findById(req.user.id);  // req.user should have the decoded JWT info
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the user has already applied for an income certificate
        if (user.incomeApplication && user.incomeApplication.state) {
            return res.status(400).json({ message: 'You have already applied for an income certificate' });
        }

        // Calculate the expected issuance date (6 days from today for income certificates)
        const requestDate = new Date();
        const expectedDate = new Date();
        expectedDate.setDate(requestDate.getDate() + 6); // 6-day processing time

        // Store income certificate data
        user.incomeApplication = {
            income,
            state,
            district,
            mandal,
            village,
            address,
            requestDate,
            expectedDate,
            actualDate: null, // To be updated when status is "Accepted"
            status: 'Pending', // Default status
        };
        await user.save();

        res.status(200).json({ message: 'Income Certificate Application submitted successfully!' });
    } catch (error) {
        console.error('Error in submitting application:', error.message);
        res.status(500).json({ message: 'Error in submitting application', error });
    }
});

router.post('/apply/caste', verifyToken, async (req, res) => {
    const { caste, state, district, mandal, village, dob, address } = req.body;

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the user has already applied for a caste certificate
        if (user.casteApplication && user.casteApplication.state) {
            return res.status(400).json({ message: 'You have already applied for a caste certificate' });
        }

        // Calculate the expected issuance date (2 days from today for caste certificates)
        const requestDate = new Date();
        const expectedDate = new Date();
        expectedDate.setDate(requestDate.getDate() + 2); // 2-day processing time

        // Store caste certificate data
        user.casteApplication = {
            caste,
            state,
            district,
            mandal,
            village,
            dob,
            address,
            requestDate,
            expectedDate,
            actualDate: null,
            status: 'Pending',
        };
        await user.save();

        res.status(200).json({ message: 'Caste Certificate Application submitted successfully!' });
    } catch (error) {
        console.error('Error in submitting application:', error.message);
        res.status(500).json({ message: 'Error in submitting application', error });
    }
});

 
router.post('/apply/ews', verifyToken, async (req, res) => {
    const { state, district, mandal, village, income, address } = req.body;

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the user has already applied for an EWS certificate
        if (user.ewsApplication && user.ewsApplication.state) {
            return res.status(400).json({ message: 'You have already applied for an EWS certificate' });
        }

        // Calculate the expected issuance date (3 days from today for EWS certificates)
        const requestDate = new Date();
        const expectedDate = new Date();
        expectedDate.setDate(requestDate.getDate() + 3); // 3-day processing time

        // Store EWS certificate data
        user.ewsApplication = {
            state,
            district,
            mandal,
            village,
            income,
            address,
            requestDate,
            expectedDate,
            actualDate: null, // To be updated when status is "Accepted"
            status: 'Pending', // Default status
        };
        await user.save();

        res.status(200).json({ message: 'EWS Certificate Application submitted successfully!' });
    } catch (error) {
        console.error('Error in submitting application:', error.message);
        res.status(500).json({ message: 'Error in submitting application', error });
    }
});
// server.js or routes/verify.js

// Route to verify Aadhaar number
// module.exports = router;

router.get('/income-count/state/:state', async (req, res) => {
    const state = req.params.state; // Get the state from the URL parameter

    try {
        // Count users with an incomeApplication.state matching the given state
        const count = await User.aggregate([
            {
                $match: { "incomeApplication.state": state }  // Match documents with incomeApplication.state
            },
            {
                $unwind: "$incomeApplication"  // Unwind the incomeApplication array (if it's an array)
            },
            {
                $match: { "incomeApplication.state": state }  // Match again to ensure correct state
            },
            {
                $count: "count"  // Count the number of matched documents
            }
        ]);

        // If no documents are found, return count as 0
        const result = count.length > 0 ? count[0].count : 0;

        res.json({ state, count: result });
    } catch (error) {
        console.error('Error fetching income certificate count by state:', error);
        res.status(500).json({ message: 'Error fetching income certificate count by state' });
    }
});

router.get('/ews-count/state/:state', async (req, res) => {
    const state = req.params.state; // Get the state from the URL parameter

    try {
        // Count users with an ewsApplication.state matching the given state
        const count = await User.aggregate([
            {
                $match: { "ewsApplication.state": state }  // Match documents with ewsApplication.state
            },
            {
                $unwind: "$ewsApplication"  // Unwind the ewsApplication array (if it's an array)
            },
            {
                $match: { "ewsApplication.state": state }  // Match again to ensure correct state
            },
            {
                $count: "count"  // Count the number of matched documents
            }
        ]);


        // res.json({ state, count: result });
        // res.render('state-progress', { count: result });
        const result = count.length > 0 ? count[0].count : 0;
        console.log("Count for state:", result);  // Log the result to check
        // res.render('state-progress', { count: result });

        res.render('state-progress', { count: result });
    } catch (error) {
        console.error('Error fetching ews certificate count by state:', error);
        res.status(500).json({ message: 'Error fetching ews certificate count by state' });
    }
});
router.get('/caste-count/district/:district', async (req, res) => {
    const district = req.params.district; // Get the district from the URL parameter

    try {
        // Count users with a casteApplication.district matching the given district
        const count = await User.aggregate([
            {
                $match: { "casteApplication.district": district }  // Match documents with casteApplication.district
            },
            {
                $unwind: "$casteApplication"  // Unwind the casteApplication array (if it's an array)
            },
            {
                $match: { "casteApplication.district": district }  // Match again to ensure correct district
            },
            {
                $count: "count"  // Count the number of matched documents
            }
        ]);

        // If no documents are found, return count as 0
        const result = count.length > 0 ? count[0].count : 0;

        res.json({ district, count: result });
    } catch (error) {
        console.error('Error fetching caste certificate count by district:', error);
        res.status(500).json({ message: 'Error fetching caste certificate count by district' });
    }
});
router.get('/income-count/district/:district', async (req, res) => {
    const district = req.params.district; // Get the district from the URL parameter

    try {
        // Count users with an incomeApplication.district matching the given district
        const count = await User.aggregate([
            {
                $match: { "incomeApplication.district": district }  // Match documents with incomeApplication.district
            },
            {
                $unwind: "$incomeApplication"  // Unwind the incomeApplication array (if it's an array)
            },
            {
                $match: { "incomeApplication.district": district }  // Match again to ensure correct district
            },
            {
                $count: "count"  // Count the number of matched documents
            }
        ]);

        // If no documents are found, return count as 0
        const result = count.length > 0 ? count[0].count : 0;

        res.json({ district, count: result });
    } catch (error) {
        console.error('Error fetching income certificate count by district:', error);
        res.status(500).json({ message: 'Error fetching income certificate count by district' });
    }
});
router.get('/ews-count/district/:district', async (req, res) => {
    const district = req.params.district; // Get the district from the URL parameter

    try {
        // Count users with an ewsApplication.district matching the given district
        const count = await User.aggregate([
            {
                $match: { "ewsApplication.district": district }  // Match documents with ewsApplication.district
            },
            {
                $unwind: "$ewsApplication"  // Unwind the ewsApplication array (if it's an array)
            },
            {
                $match: { "ewsApplication.district": district }  // Match again to ensure correct district
            },
            {
                $count: "count"  // Count the number of matched documents
            }
        ]);

        // If no documents are found, return count as 0
        const result = count.length > 0 ? count[0].count : 0;

        res.json({ district, count: result });
    } catch (error) {
        console.error('Error fetching ews certificate count by district:', error);
        res.status(500).json({ message: 'Error fetching ews certificate count by district' });
    }
});

router.get('/income-count/mandal/:mandal', async (req, res) => {
    const mandal = req.params.mandal; // Get the mandal from the URL parameter

    try {
        const count = await User.aggregate([
            {
                $match: { "incomeApplication.mandal": mandal } // Match documents with incomeApplication.mandal
            },
            {
                $unwind: "$incomeApplication" // Unwind the incomeApplication array (if it's an array)
            },
            {
                $match: { "incomeApplication.mandal": mandal } // Match again to ensure correct mandal
            },
            {
                $count: "count" // Count the number of matched documents
            }
        ]);

        const result = count.length > 0 ? count[0].count : 0;
        // res.render('mandal-dashboard', { mandal, count });

        res.json({ mandal, count: result });
    } catch (error) {
        console.error('Error fetching income certificate count by mandal:', error);
        res.status(500).json({ message: 'Error fetching income certificate count by mandal' });
    }
});
router.get('/caste-count/mandal/:mandal', async (req, res) => {
    const mandal = req.params.mandal; // Get the mandal from the URL parameter

    try {
        const count = await User.aggregate([
            {
                $match: { "casteApplication.mandal": mandal } // Match documents with casteApplication.mandal
            },
            {
                $unwind: "$casteApplication" // Unwind the casteApplication array (if it's an array)
            },
            {
                $match: { "casteApplication.mandal": mandal } // Match again to ensure correct mandal
            },
            {
                $count: "count" // Count the number of matched documents
            }
        ]);

        const result = count.length > 0 ? count[0].count : 0;

        res.json({ mandal, count: result });
    } catch (error) {
        console.error('Error fetching caste certificate count by mandal:', error);
        res.status(500).json({ message: 'Error fetching caste certificate count by mandal' });
    }
});
router.get('/ews-count/mandal/:mandal', async (req, res) => {
    const mandal = req.params.mandal; // Get the mandal from the URL parameter

    try {
        const count = await User.aggregate([
            {
                $match: { "ewsApplication.mandal": mandal } // Match documents with ewsApplication.mandal
            },
            {
                $unwind: "$ewsApplication" // Unwind the ewsApplication array (if it's an array)
            },
            {
                $match: { "ewsApplication.mandal": mandal } // Match again to ensure correct mandal
            },
            {
                $count: "count" // Count the number of matched documents
            }
        ]);

        const result = count.length > 0 ? count[0].count : 0;

        res.json({ mandal, count: result });
    } catch (error) {
        console.error('Error fetching EWS certificate count by mandal:', error);
        res.status(500).json({ message: 'Error fetching EWS certificate count by mandal' });
    }
});

router.get('/total-requests/state/:state', async (req, res) => {
    const state = req.params.state; // Get the state from the URL parameter

    try {
        const count = await User.aggregate([
            {
                $project: {
                    totalRequests: {
                        $sum: [
                            { $cond: [{ $eq: ["$casteApplication.state", state] }, 1, 0] },
                            { $cond: [{ $eq: ["$incomeApplication.state", state] }, 1, 0] },
                            { $cond: [{ $eq: ["$ewsApplication.state", state] }, 1, 0] }
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: null, // We don't need to group by anything specific; summing across all documents
                    totalRequests: { $sum: "$totalRequests" }
                }
            }
        ]);

        const result = count.length > 0 ? count[0].totalRequests : 0;

        res.json({ state, totalRequests: result });
    } catch (error) {
        console.error('Error fetching total requests by state:', error);
        res.status(500).json({ message: 'Error fetching total requests by state' });
    }
});

router.get('/total-requests/state/:state', async (req, res) => {
    const state = req.params.state; // Get the state from the URL parameter

    try {
        // Aggregate all applications (Caste, Income, EWS) for the given state, grouped by district
        const counts = await User.aggregate([
            {
                $match: {
                    $or: [  // Match if any of these applications have the state
                        { "casteApplication.state": state },
                        { "incomeApplication.state": state },
                        { "ewsApplication.state": state }
                    ]
                }
            },
            {
                $project: {
                    casteApplication: 1,
                    incomeApplication: 1,
                    ewsApplication: 1
                }
            },
            {
                $unwind: {
                    path: "$casteApplication",
                    preserveNullAndEmptyArrays: true  // Keep users without caste applications
                }
            },
            {
                $unwind: {
                    path: "$incomeApplication",
                    preserveNullAndEmptyArrays: true  // Keep users without income applications
                }
            },
            {
                $unwind: {
                    path: "$ewsApplication",
                    preserveNullAndEmptyArrays: true  // Keep users without EWS applications
                }
            },
            {
                $match: {
                    $or: [  // Match if any of these applications have the state
                        { "casteApplication.state": state },
                        { "incomeApplication.state": state },
                        { "ewsApplication.state": state }
                    ]
                }
            },
            {
                $group: {
                    _id: "$casteApplication.district",  // Group by district
                    totalRequests: { $sum: 1 }  // Count total requests for each district
                }
            },
            {
                $sort: { totalRequests: -1 }  // Sort districts by total request count (descending)
            }
        ]);

        // If no documents are found, return empty array
        const result = counts.length > 0 ? counts : [];

        res.json({ state, districts: result });
    } catch (error) {
        console.error('Error fetching total requests by state:', error);
        res.status(500).json({ message: 'Error fetching total requests by state' });
    }
});

router.get('/total-requests/district/:district', async (req, res) => {
    const district = req.params.district; // Get the district from the URL parameter

    try {
        // Aggregate all applications (Caste, Income, EWS) for the given district, grouped by mandal
        const counts = await User.aggregate([
            {
                $match: {
                    $or: [  // Match if any of these applications have the district
                        { "casteApplication.district": district },
                        { "incomeApplication.district": district },
                        { "ewsApplication.district": district }
                    ]
                }
            },
            {
                $project: {
                    casteApplication: 1,
                    incomeApplication: 1,
                    ewsApplication: 1
                }
            },
            {
                $unwind: {
                    path: "$casteApplication",
                    preserveNullAndEmptyArrays: true  // Keep users without caste applications
                }
            },
            {
                $unwind: {
                    path: "$incomeApplication",
                    preserveNullAndEmptyArrays: true  // Keep users without income applications
                }
            },
            {
                $unwind: {
                    path: "$ewsApplication",
                    preserveNullAndEmptyArrays: true  // Keep users without EWS applications
                }
            },
            {
                $match: {
                    $or: [  // Match if any of these applications have the district
                        { "casteApplication.district": district },
                        { "incomeApplication.district": district },
                        { "ewsApplication.district": district }
                    ]
                }
            },
            {
                $group: {
                    _id: "$casteApplication.mandal",  // Group by mandal
                    totalRequests: { $sum: 1 }  // Count total requests for each mandal
                }
            },
            {
                $sort: { totalRequests: -1 }  // Sort mandals by total request count (descending)
            }
        ]);

        // If no documents are found, return empty array
        const result = counts.length > 0 ? counts : [];

        res.json({ district, mandals: result });
    } catch (error) {
        console.error('Error fetching total requests by district:', error);
        res.status(500).json({ message: 'Error fetching total requests by district' });
    }
});
router.post('/state-progress', async (req, res) => {
    const { email, officerId, state, district, mandal, village } = req.body;

    try {
        // Validate the officerId and corresponding field
        if (officerId === 'state' && state) {
            // Render the monitoring space page for state officers
            return res.render('monitoring-space', { title: 'Monitoring Space', level: 'State', state });
        } else if (officerId === 'district' && district) {
            // Render the monitoring space page for district officers
            return res.render('monitoring-space', { title: 'Monitoring Space', level: 'District', district });
        } else if (officerId === 'mandal' && mandal) {
            // Render the monitoring space page for mandal officers
            return res.render('monitoring-space', { title: 'Monitoring Space', level: 'Mandal', mandal });
        } else if (officerId === 'village' && village) {
            // Render the monitoring space page for village officers
            return res.render('monitoring-space', { title: 'Monitoring Space', level: 'Village', village });
        } else {
            // If validation fails, reload the login page with an error message
            return res.status(400).render('officialLogin', { error: 'Invalid Officer ID or missing details', state: '' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Sample route for monitoring-space
router.get('/monitoring-space', (req, res) => {
    res.render('monitoring-space', { title: 'Monitoring Space' });
});
// const CasteApplicationStatus = require('../models/schemas/CasteApplicationStatus');

// Add a new application status
router.post('/status/caste/add', async (req, res) => {
    try {
        const { userId, applicationDate } = req.body;
        await addCasteApplicationStatus(userId, applicationDate);
        res.status(201).json({ message: 'Caste application status added' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update application status
router.post('/status/caste/update', async (req, res) => {
    try {
        const { userId, newStatus } = req.body;
        await updateCasteApplicationStatus(userId, newStatus);
        res.status(200).json({ message: 'Caste application status updated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Fetch all application statuses
router.get('/status/caste', async (req, res) => {
    try {
        const statuses = await getCasteApplicationStatuses();
        res.status(200).json(statuses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to track status for a particular user
// router.get('/user-status', verifyToken, async (req, res) => {
//     try {
//         const userId = req.user.id;  // Get the user ID from the JWT token
//         const user = await User.findById(userId);  // Fetch user from DB using the ID

//         // If user not found, send an error
//         if (!user) {
//             return res.status(404).send('User not found');
//         }

//         // Render the track status page for this specific user
//         res.render('user-certificatestatus', { user });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Error fetching user status');
//     }
// });
 // Ensure you're using the verifyToken middleware

// Route to track status for a particular user
router.get('/user-status', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;  // Get the user ID from the JWT token
        const user = await User.findById(userId);  // Fetch user from DB using the ID

        // If user not found, send an error
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Render the track status page for this specific user
        res.render('track-status', { user });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching user status');
    }
});
// router.get('/track-status', verifyToken, async (req, res) => {
//     try {
//         // Get the user from the token (assumed to be attached to `req.user`)
//         const user = await User.findById(req.user.id);  // Assuming `User` is the model

//         // If no user is found, handle the error
//         if (!user) {
//             return res.status(404).send('User not found');
//         }

//         // Pass user data to the EJS template
//         res.render('track-status', { user });
//     } catch (error) {
//         console.error('Error fetching user:', error);
//         res.status(500).send('Error fetching user data');
//     }
// });
router.get('/track-status', async (req, res) => {
    try {
      // Get the logged-in user ID from the session
      const userId = req.session.userId;
  
      if (!userId) {
        return res.status(401).send('User not logged in');
      }
  
      // Fetch the user data from the database
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).send('User not found');
      }
  
      // Collect data for the frontend
      const statusData = {
        name: user.name,
        casteApplication: user.casteApplication || null,
        incomeApplication: user.incomeApplication || null,
        ewsApplication: user.ewsApplication || null,
      };
  
      res.render('track-status', { statusData });
    } catch (error) {
      res.status(500).send('Server error: ' + error.message);
    }
  });
  const calculateExpectedDate = (requestDate, processingDays) => {
    const date = new Date(requestDate);
    date.setDate(date.getDate() + processingDays);
    return date;
  };
  
  router.get('/track-status', async (req, res) => {
    try {
      // Fetch logged-in user ID from session
      const userId = req.session.userId;
      if (!userId) return res.status(401).send('User not logged in.');
  
      // Retrieve user data from the database
      const user = await User.findById(userId);
      if (!user) return res.status(404).send('User not found.');
  
      // Prepare status data for each certificate application
      const statusData = [];
      const applications = [
        { type: 'Caste', app: user.casteApplication, days: 5 },
        { type: 'Income', app: user.incomeApplication, days: 6 },
        { type: 'EWS', app: user.ewsApplication, days: 3 },
      ];
  
      applications.forEach(({ type, app, days }) => {
        if (app) {
          const backlog = app.actualDate ? user.calculateBacklog(type.toLowerCase()) : null;
          statusData.push({
            type,
            requestDate: app.requestDate,
            expectedDate: app.expectedDate || calculateExpectedDate(app.requestDate, days),
            actualDate: app.actualDate || null,
            status: app.status,
            backlog,
          });
        }
      });
  
      // Render the track-status template
      res.render('track-status', {
        name: user.name,
        statusData,
      });
    } catch (error) {
      console.error('Error fetching track status:', error);
      res.status(500).send('Internal Server Error');
    }
  });
// Fetch users with Pending status
router.get('/pending-users', async (req, res) => {
    try {
        const users = await User.find({
            $or: [
                { 'casteApplication.status': 'Pending' },
                { 'incomeApplication.status': 'Pending' },
                { 'ewsApplication.status': 'Pending' }
            ]
        });

        res.render('pending-users', { users });
    } catch (error) {
        console.error('Error fetching pending users:', error.message);
        res.status(500).json({ message: 'Error fetching pending users' });
    }
});
// Update status and actual date
router.post('/update-status/:id', async (req, res) => {
    const { id } = req.params;
    const { type } = req.body; // type: 'caste', 'income', or 'ews'

    try {
        const today = new Date();
        const updateFields = {
            [`${type}Application.status`]: 'Accepted',
            [`${type}Application.actualDate`]: today,
        };

        const updatedUser = await User.findByIdAndUpdate(id, { $set: updateFields }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Status updated successfully!' });
    } catch (error) {
        console.error('Error updating status:', error.message);
        res.status(500).json({ message: 'Error updating status' });
    }
});
router.get('/download/:type', async (req, res) => {
    const { type } = req.params;
    const userId = req.session.userId;
  
    if (!userId) return res.status(401).send('User not logged in');
  
    const user = await User.findById(userId);
    if (!user) return res.status(404).send('User not found');
  
    let certificateImage;
    if (type === 'caste' && user.casteApplication?.status === 'Accepted') {
      certificateImage = 'path/to/caste_certificate_image.png';
    } else if (type === 'income' && user.incomeApplication?.status === 'Accepted') {
      certificateImage = 'path/to/income_certificate_image.png';
    } else if (type === 'ews' && user.ewsApplication?.status === 'Accepted') {
      certificateImage = 'path/to/ews_certificate_image.png';
    } else {
      return res.status(400).send('Invalid request');
    }
  
    res.sendFile(certificateImage);
  });
  router.post('/api/users/verify/caste', async (req, res) => {
    const { aadhaar, fatherCaste, motherCaste, caste } = req.body;

    try {
        // Perform verification logic (e.g., check Aadhaar and caste details)
        if (!aadhaar || !fatherCaste || !motherCaste || !caste) {
            return res.status(400).send('All fields are required.');
        }

        // Example validation (replace with your own logic)
        if (fatherCaste !== motherCaste || caste !== fatherCaste) {
            return res.status(400).send('Caste verification failed.');
        }

        // Respond with success
        res.status(200).send('Verified successfully');
    } catch (error) {
        console.error('Error verifying caste:', error);
        res.status(500).send('Server error');
    }
});

module.exports = router;
