// utils/validation.js

// Function to validate Aadhaar Number (12 digits)
const checkAadhaar = (aadhaar) => {
    const aadhaarRegex = /^[2-9]{1}[0-9]{11}$/; // Aadhaar should start with a digit between 2-9, followed by 11 digits
    return aadhaarRegex.test(aadhaar);
};

module.exports = { checkAadhaar };
