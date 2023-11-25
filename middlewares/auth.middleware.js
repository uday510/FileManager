const jwt = require("jsonwebtoken");

// To Validate whether the sign in request contains name and password
validateSigninRequest = (req, res, next) => {
    // check for the name in body
    if (!req.body.username) {
        return res.status(400).send({
            message: "Failed ! name is not provided",
        });
    }
    // check for the password in body
    if (!req.body.password) {
        return res.status(400).send({
            message: "Failed ! password is not provided",
        });
    }
    next();
};
// To Validate whether the sign up request contains name and password
validateSignupRequest = async (req, res, next) => {
    // Validate if fields that are required are provided
    if (!req.body.username) {
        return res.status(400).send({
            message: "Failed ! username is not provided",
        });
    }
    if (!req.body.email) {
        return res.status(400).send({
            message: "Failed ! Email is not provided",
        });
    }
    if (!req.body.password) {
        return res.status(400).send({
            message: "Failed ! Password is not provided",
        });
    }
    next();

};

// Verify the Provided Token
verifyToken = (req, res, next) => {
    // Read the token from the header

    const token = req.headers["x-access-token"];

    if (!token) {
        return res.status(401).send({
            message: "No token provided",
        });
    }

    jwt.verify(token, 'SECRET', (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Forbidden: Invalid token' });
        }
        req.userId = decoded.id; // Set the decoded user information in the request object
        next(); // Move to the next middleware or route handler
    });
};

// Exposing the functions to outside of this file
const authUser = {
    validateSignupRequest: validateSignupRequest,
    validateSigninRequest: validateSigninRequest,
    verifyToken: verifyToken,
};

module.exports = authUser;
