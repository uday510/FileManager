const UserModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const SECRET = require('../config/db.config');
const userModel = new UserModel();

exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const userExists = await userModel.getUserByEmail(email);
        if (userExists) {
            return res.status(400).send({ msg: "User Already Exists" })
        }
        const user = await userModel.createUser(username, email, password);
        res.status(201).json({ user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userModel.getUserByEmail(email);
        if (!user || !userModel.comparePassword(password, user.password)) {
            res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id }, SECRET, {
            expiresIn: 600, // Expires 10 Minutes
        });

        // Send the response
        res.status(200).send({
            message: "Token sent successfully",
            name: user.username,
            userId: user.id,
            email: user.email,
            accessToken: token,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

}

