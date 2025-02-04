const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../models/user');

const router = express.Router();


// Register
/**
 * @route POST api/auth/register
 * @description Register new user
 * @access Public
 */

router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);


        user = new User({ username, email, password: hashedPassword });
        await user.save();


        res.status(200).json({ msg: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// Login

/**
 * @route POST api/auth/login
 * @description Login user
 * @access Public
 */


router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) 
            return res.status(400).json({ msg: 'Invalid ' });

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch)
            return res.status(400).json({ msg: 'Invalid ' });



        const token = jwt.sign({ id: user._id }, config.get('jwtSecret'), { expiresIn: '1h' });
        res .status(200).json({ token, user: { id: user._id, username: user.username, email: user.email } });
    } catch (error) {   
        res.status(500).json({ msg: 'Server error' });
    }
});


module.exports = router;