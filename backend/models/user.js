const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        name: {type: String, required: true, trim: true},
        surname: {type: String, required: true, trim: true},
        email: {type: String, required: true, trim: true},
        age: {type: Number, required: true, min: 18, max: 100},
        products: {type: Array},
        type: {type: String, enum: ['Buyer', 'Seller', 'Hybrid'], default: 'Buyer'},
        rating: {type: Number, min: 0, max: 5},
        reputation: {type: String, enum: ['Trustworthy', 'Under Review', 'UnTrustworthy'], default: 'Under Review'},
    },
    {timestamps : true}
);

const User = mongoose.model("User", UserSchema);
module.exports = User;