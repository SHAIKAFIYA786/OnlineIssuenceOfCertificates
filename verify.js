router.post('/verify/adharr', async (req, res) => {
    const { aadhaar } = req.body;

    try {
        // Check if the Aadhaar number exists in the database
        const user = await User.findOne({ aadhaar });

        if (!user) {
            return res.status(404).json({ message: "Aadhaar number not found. Please check and try again." });
        }

        // If Aadhaar is found, verify and send a response
        res.status(200).json({ message: "Aadhaar number verified successfully. Documents are valid." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error while verifying Aadhaar." });
    }
});
