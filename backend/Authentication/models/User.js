const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength: [6]
    },
    authPattern: {
        type: String,
        required: true
    },
    roles: {
        type: [String], 
        required: true,
        enum: ['buyer', 'seller', 'admin'],
        default: ['buyer']
    },
    dob: {
    type: String,
    required: true
  },

  adminPasskey: {
    type: String,
    required: false
  },

  approvalStreak: { type: Number,
    default: 0
  },

  denyStreak: {type: Number,
    default: 0
  },

  isDeniedFromPosting: {
    type: Boolean,
    default: false
  },
  
},
{ timestamps: true }
);

module.exports = mongoose.models.User || mongoose.model("User", UserSchema);