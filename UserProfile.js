// models/UserProfile.js
const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    photograph: { type: String },  // Path to the photo file
    casteDocument: { type: String }, // Path to caste document
    incomeDocument: { type: String }, // Path to income document
    ewsDocument: { type: String }, // Path to EWS document
    aadhaarDocument: { type: String }, // Path to Aadhaar document
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UserProfile', userProfileSchema);
