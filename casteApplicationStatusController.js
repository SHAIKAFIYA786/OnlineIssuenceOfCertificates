const addCasteApplicationStatus = async (userId, applicationDate) => {
    const deadline = new Date(applicationDate);
    deadline.setDate(deadline.getDate() + 2); // 2 days deadline

    const status = new CasteApplicationStatus({
        userId,
        applicationDate,
        deadline,
        expectedIssueDate: deadline
    });

    await status.save();
};
const updateCasteApplicationStatus = async (userId, newStatus) => {
    const status = await CasteApplicationStatus.findOne({ userId });

    if (!status) {
        throw new Error('Application status not found');
    }

    status.status = newStatus;

    if (newStatus === 'Accepted') {
        status.actualIssueDate = new Date();
    }

    await status.save();
};
const getCasteApplicationStatuses = async () => {
    return await CasteApplicationStatus.find().populate('userId', 'name email');
};
const CasteApplicationStatus = require('../models/CasteApplicationStatus');
const User = require('../models/User');

// Create or Update Caste Application Status
exports.updateCasteStatus = async (req, res) => {
    const { userId, status } = req.body;

    try {
        // Fetch or create a status entry for the user
        let applicationStatus = await CasteApplicationStatus.findOne({ userId });

        if (!applicationStatus) {
            // Create a new status record if it doesn't exist
            applicationStatus = new CasteApplicationStatus({
                userId,
                deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Deadline 2 days from now
                expectedDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
            });
        }

        // Update the status and set the actual issue date if accepted
        applicationStatus.status = status;

        if (status === 'Accepted' && !applicationStatus.actualDateIssued) {
            applicationStatus.actualDateIssued = new Date();
        }

        await applicationStatus.save();
        res.status(200).json({ message: 'Status updated successfully', applicationStatus });
    } catch (error) {
        console.error('Error updating caste application status:', error);
        res.status(500).json({ message: 'Error updating status', error: error.message });
    }
};

// Get All Caste Application Statuses
exports.getAllCasteStatuses = async (req, res) => {
    try {
        const statuses = await CasteApplicationStatus.find().populate('userId', 'name email');
        res.status(200).json({ statuses });
    } catch (error) {
        console.error('Error fetching caste application statuses:', error);
        res.status(500).json({ message: 'Error fetching statuses', error: error.message });
    }
};

// Get Status by User ID
exports.getCasteStatusByUserId = async (req, res) => {
    const { userId } = req.params;

    try {
        const status = await CasteApplicationStatus.findOne({ userId }).populate('userId', 'name email');

        if (!status) {
            return res.status(404).json({ message: 'Status not found for this user' });
        }

        res.status(200).json({ status });
    } catch (error) {
        console.error('Error fetching caste application status by user ID:', error);
        res.status(500).json({ message: 'Error fetching status', error: error.message });
    }
};

