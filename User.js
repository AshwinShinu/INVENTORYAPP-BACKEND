const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: Number,
    location: String,
    password: String
});

const UserModel = mongoose.model('Users', UserSchema);
module.exports = UserModel;