const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
    try {
        const { firstName, lastName, email, password, authPattern } = req.body;

        if (!firstName || !lastName || !email || !password || !authPattern) {
            return res.status(400).json({ message: 'Please fill in all fields' });
        }

        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const hashedAuthPattern = await bcrypt.hash(authPattern, 12);

        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            authPattern: hashedAuthPattern
        });

        res.status(201).json({ message: 'Account created successfully!' });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password, authPattern } = req.body;

        if (!email || !password || !authPattern) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isPatternMatch = await bcrypt.compare(authPattern, user.authPattern);

        if (!isPatternMatch) {

            return res.status(401).json({ message: 'Invalid credentials' });

        }

        const token = jwt.sign(
            { id: user._id, firstName: user.firstName },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            token,
            firstName: user.firstName,
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};