// models/RequestModel.js
const mongoose = require('mongoose');

// Define the schema for a certificate request
const requestSchema = new mongoose.Schema({
    applicantName: {
        type: String,
        required: true
    },
    certificateType: {
        type: String,
        required: true, // e.g., 'Caste', 'Income', 'EWS'
    },
    state: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'Pending', // Pending, Verified, Rejected, Accepted
    },
    feedback: {
        type: String, // Reason for rejection
        default: ''
    },
    appliedDate: {
        type: Date,
        default: Date.now // Date the user applied for the certificate
    },
    issuedDate: {
        type: Date, // Actual issued date, if available
        default: null
    },
    verified: {
        type: Boolean,
        default: false // Whether the request has been verified
    }
});

// Create and export the model
const RequestModel = mongoose.model('Request', requestSchema);
module.exports = RequestModel;
