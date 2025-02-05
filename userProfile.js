// routes/userProfile.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const UserProfile = require('../models/UserProfile');
const router = express.Router();

// Set up multer for file storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Route to upload user profile details
router.post('/upload', upload.fields([
    { name: 'photograph' },
    { name: 'casteDocument' },
    { name: 'incomeDocument' },
    { name: 'ewsDocument' },
    { name: 'aadhaarDocument' }
]), async (req, res) => {
    const { name, email, address } = req.body;
    const photograph = req.files.photograph ? req.files.photograph[0].path : null;
    const casteDocument = req.files.casteDocument ? req.files.casteDocument[0].path : null;
    const incomeDocument = req.files.incomeDocument ? req.files.incomeDocument[0].path : null;
    const ewsDocument = req.files.ewsDocument ? req.files.ewsDocument[0].path : null;
    const aadhaarDocument = req.files.aadhaarDocument ? req.files.aadhaarDocument[0].path : null;

    const newUserProfile = new UserProfile({
        name,
        email,
        address,
        photograph,
        casteDocument,
        incomeDocument,
        ewsDocument,
        aadhaarDocument
    });

    try {
        await newUserProfile.save();
        res.redirect(`/user/profile/${newUserProfile._id}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error saving profile.');
    }
});

// Route to view user profile
router.get('/profile/:id', async (req, res) => {
    try {
        const user = await UserProfile.findById(req.params.id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.render('userProfile', { user });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching profile.');
    }
});

module.exports = router;
