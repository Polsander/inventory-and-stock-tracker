const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema ({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    isValidated: {type:Boolean, default: false, unique: false},
    isAdmin: {type:Boolean, default: false, unique: false},
    isSuperAdmin: {type:Boolean, default: false, unique: false},
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);