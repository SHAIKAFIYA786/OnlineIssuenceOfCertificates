const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

    // Define the User Schema
    const UserSchema = new mongoose.Schema({
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        phone: { type: String, required: true, unique: true },
        password: { type: String, required: true },

        // Caste Certificate Application Data
        casteApplication: {
            state: String,
            district: String,
            mandal: String,
            village: String,
            caste: String,
            dob: Date,
            address: String,
            requestDate: { type: Date, default: Date.now },
            expectedDate: { type: Date },
            actualDate: { type: Date },
            scanned: Boolean,
            status: { type: String, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending' },
        },

        // Income Certificate Application Data
        incomeApplication: {
            state: String,
            district: String,
            mandal: String,
            village: String,
            income: Number,
            dob: Date,
            address: String,
            requestDate: { type: Date, default: Date.now },
            expectedDate: { type: Date },
            actualDate: { type: Date },
            scanned: Boolean,
            status: { type: String, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending' },
        },

        // EWS Certificate Application Data
        ewsApplication: {
            state: String,
            district: String,
            mandal: String,
            village: String,
            income: Number,
            address: String,
            requestDate: { type: Date, default: Date.now },
            expectedDate: { type: Date },
            actualDate: { type: Date },
            scanned: Boolean,
            status: { type: String, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending' },
        },
    });

    // Calculate backlog for each certificate (Caste, Income, EWS)
UserSchema.methods.calculateBacklog = function (certificateType) {
    let backlog = 0;
    let certificate = this[`${certificateType}Application`];
    
    if (certificate && certificate.expectedDate && certificate.actualDate) {
        // Calculate the backlog as the difference between expected date and actual date
        const expected = new Date(certificate.expectedDate);
        const actual = new Date(certificate.actualDate);
        
        // If actual date is later than expected date, calculate backlog (difference in days)
        if (actual > expected) {
            const timeDiff = actual - expected;
            backlog = timeDiff / (1000 * 3600 * 24); // Convert to days
        }
    }

    return backlog;
};

UserSchema.methods.getCertificateBacklogs = function () {
    const casteBacklog = this.calculateBacklog('caste');
    const incomeBacklog = this.calculateBacklog('income');
    const ewsBacklog = this.calculateBacklog('ews');
    
    return {
        casteBacklog,
        incomeBacklog,
        ewsBacklog
    };
};
// Method to calculate backlog for Caste, Income, EWS certificates
UserSchema.methods.getCertificateBacklogs = function () {
    const casteBacklog = this.calculateBacklog('caste');
    const incomeBacklog = this.calculateBacklog('income');
    const ewsBacklog = this.calculateBacklog('ews');
    
    return {
        casteBacklog,
        incomeBacklog,
        ewsBacklog
    };
};
    // Hash the password before saving
    UserSchema.pre('save', async function (next) {
        if (!this.isModified('password')) return next();
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    });

    // Compare password
    UserSchema.methods.matchPassword = async function (enteredPassword) {
        return await bcrypt.compare(enteredPassword, this.password);
    };
    

    // Export the model (use existing model if already registered)
    module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
