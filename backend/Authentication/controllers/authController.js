const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//data entry; user enters details
//react sends info to server, server hashes password, and ensures it matches in mongodb
//if password matches, server creates jwt 
//server sends token back to react, react stores it in localstorage
//when logging out the token is removed from local storage

const Pokemon = require('../../models/pokemon');
//only signup can create accounts with these roles or both (hybrid)
//no admin passkey or anything in register anymore
const accountRoles = ['buyer', 'seller'];

exports.register = async (req, res) => {
    try {
        const { firstName, lastName, email, password, authPattern, dob, roles } = req.body;

        if (!firstName || !lastName || !email || !password || !authPattern) {
            return res.status(400).json({ message: 'Please fill in all fields' });
        }

        const requestedRoles = Array.isArray(roles) ? roles : [];
        if (requestedRoles.some(role => !accountRoles.includes(role))) {
            return res.status(403).json({ message: 'That account type cannot be created through sign up.' });
        }
        const safeRoles = requestedRoles.length ? [...new Set(requestedRoles)] : ['buyer'];


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
            dob,
            roles : safeRoles,
            password: hashedPassword,
            authPattern: hashedAuthPattern,
        });

        res.status(201).json({ message: 'Account created successfully!' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong. Please try again." });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password, authPattern, adminPasskey} = req.body;

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

        if (user.roles.includes('admin')) {
            if (!adminPasskey) {
                return res.status(202).json({ 
                    message: 'welcome god, enter password to prove youre a god',
                    requiresAdminPasskey: true
                    });
            }

            const isPasskeyMatch = await bcrypt.compare(adminPasskey, user.adminPasskey);
            if (!isPasskeyMatch) {
                return res.status(401).json({ message: 'Invalid Admin Passkey' });
            }
        }

        const token = jwt.sign(
            { id: user._id, firstName: user.firstName, roles: user.roles },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1d' }
        );

        res.status(200).json({ 
            token, 
            firstName: user.firstName, 
            roles: user.roles 
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong. Please try again." });
    }
};

const { streakLimit } = require('../../config/streaks');

exports.reviewPost = async (req, res) => {
    try {
        const { postId, action, adminNotes } = req.body;
        if (action !== 'approve' && action !== 'reject') {
            return res.status(400).json({ message: "Action must be approve or reject." });
        }
        const approved = action === 'approve';

    
        const before = await Pokemon.findOneAndUpdate(
            { _id: postId, status: { $ne: 'sold' } },
            {
                status: approved ? 'approved' : 'rejected',
                adminNotes: approved ? "" : (adminNotes || "No feedback provided by admin."),
            }
        );
        if (!before) {
            return res.status(404).json({ message: "Post not found" });
        }

    
        if (before.status === 'pending') {
            const seller = await User.findById(before.sellerId);
            if (seller) {
                if (approved) {
                    seller.approvalStreak += 1;
                    seller.denyStreak = 0;
                } else {
                    seller.denyStreak += 1;
                    seller.approvalStreak = 0;
                    if (seller.denyStreak >= streakLimit) seller.isDeniedFromPosting = true;
                }
                await seller.save();
            }
        }

        res.status(200).json({ message: `Post successfully ${action}d!` });
    } catch (error) {
        console.error("Review error:", error);
        res.status(500).json({ message: "Server error during review." });
    }
};
      