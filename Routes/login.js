const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const registerData = require('../Models/registerData.js');
const secretKey = 'umerjavaid12@';

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await registerData.findOne({ email });

        if (!user) {
            
            return res.status(401).json({ message: 'User does not exist.' });
        }

        // Compare the entered password with the stored hashed password
        const passwordMatches = await bcrypt.compare(password, user.password);

        if (passwordMatches) {
            console.log("login successful");
            const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1000m' });
            res.status(200).json({userId : user._id , token , message: 'Authentication successful' });
        } else {
            res.status(401).json({ message: 'Password is not correct.' });
        }
    } catch (error) {
        console.error('Error authenticating user', error);
        res.status(500).json({ message: 'Error authenticating user' });
    }
});

module.exports =  router;