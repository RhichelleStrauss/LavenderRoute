const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//data entry; user enters details
//react sends info to server, server hashes password, and ensures it matches in mongodb
//if password matches, server creates jwt 
//server sends token back to react, react stores it in localstorage
//when logging out the token is removed from local storage

const Pokemon = require('../../models/pokemon');

exports.register = async (req, res) => {
    try {
        const { firstName, lastName, email, password, authPattern, dob, roles, adminPasskey } = req.body;

        if (!firstName || !lastName || !email || !password || !authPattern) {
            return res.status(400).json({ message: 'Please fill in all fields' });
        }

        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const hashedAuthPattern = await bcrypt.hash(authPattern, 12);
        let hashedAdminPasskey = undefined;
        if (adminPasskey) {
            hashedAdminPasskey = await bcrypt.hash(adminPasskey, 12);
        }

        const user = await User.create({
            firstName,
            lastName,
            email,
            dob,
            roles,
            password: hashedPassword,
            authPattern: hashedAuthPattern,
            adminPasskey: hashedAdminPasskey
        });

        res.status(201).json({ message: 'Account created successfully!' });

    } catch (err) {
        res.status(500).json({ message: err.message });
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
        res.status(500).json({ message: err.message });
    }
};

exports.reviewPost = async (req, res) => {
    try {
        const { postId, action, adminNotes } = req.body;

        const newStatus = action === 'approve' ? 'approved' : 'rejected';
      const newNotes = action === 'reject' ? (adminNotes || "No feedback provided by admin.") : "";

      const post = await Pokemon.findByIdAndUpdate(
        postId, 
        { 
            status: newStatus, 
            adminNotes: newNotes 
        },
        { new: true }
        );
  
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
  
      res.status(200).json({ message: `Post successfully ${action}d!` });
    } catch (error) {
      console.error("Review error:", error);
      res.status(500).json({ message: "Server error during review." });
    }
};

      