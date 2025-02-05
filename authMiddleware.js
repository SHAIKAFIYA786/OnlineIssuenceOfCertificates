const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    const token = req.cookies?.token; // Extract token from cookies

    if (!token) {
        return res.status(401).send('No token provided');
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).send('Failed to authenticate token');
        }
        req.user = decoded; // Attach decoded user info (like `id`) to the request
        next();
    });
}

module.exports = verifyToken;
// const jwt = require('jsonwebtoken');

// function verifyToken(req, res, next) {
//     const token = req.cookies?.token; // Extract token from cookies

//     if (!token) {
//         return res.status(401).send('No token provided');
//     }

//     jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//         if (err) {
//             return res.status(403).send('Failed to authenticate token');
//         }
//         req.user = decoded; // Attach decoded user info (like `id`) to the request
//         next();
//     });
// }