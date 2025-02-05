const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    name: String,
    email: String,
    state: String,
    casteApplication: {
        state: String,
        district: String,
        mandal: String,
        village: String,
        caste: String,
        dob: Date,
        address: String,
        requestDate: Date,
        actualDate: Date,
        status: { type: String, default: 'Pending' }
    },
    incomeApplication: {
        // Similar structure as casteApplication
        state: String,
        requestDate: Date,
        actualDate: Date,
        status: { type: String, default: 'Pending' }
    },
    ewsApplication: {
        // Similar structure as casteApplication
        state: String,
        requestDate: Date,
        actualDate: Date,
        status: { type: String, default: 'Pending' }
    }
});

const User = mongoose.model('User', applicationSchema);
module.exports = User;
