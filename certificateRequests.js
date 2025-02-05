 
const express = require('express');
const router = express.Router();
const RequestModel = require('../models/RequestModel');

 
router.get('/certificate-requests', async (req, res) => {
    try {
        const requests = await RequestModel.find(); // Fetch all requests
        res.render('certificate-requests', { requests });
    } catch (err) {
        console.error('Error fetching requests:', err);
        res.status(500).send('Server Error');
    }
});

 
router.post('/update-status/:id', async (req, res) => {
    const { id } = req.params;
    const { action } = req.body; // The value from the button clicked (verify or reject)

    try {
        let updateData = {};
        if (action === 'verify') {
            updateData = { status: 'Verified', verified: true }; // Update to verified status
        } else if (action === 'reject') {
            updateData = { status: 'Rejected', feedback: 'Details incorrect' }; // Reject with a feedback
        }

        await RequestModel.findByIdAndUpdate(id, updateData); // Update the status
        res.redirect('/certificate-requests'); // Redirect back to the requests page
    } catch (err) {
        console.error('Error updating status:', err);
        res.status(500).send('Server Error');
    }
});

 
router.post('/issue-certificate/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const request = await RequestModel.findById(id);
        if (!request) return res.status(404).send('Request not found');
        
        
        request.status = 'Accepted';
        request.issuedDate = new Date();  
        await request.save();

        res.redirect('/certificate-requests');  
    } catch (err) {
        console.error('Error issuing certificate:', err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
