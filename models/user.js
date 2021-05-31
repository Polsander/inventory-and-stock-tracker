const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const Log = require('./logs');

const UserSchema = new Schema ({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    isValidated: {type:Boolean, default: false, unique: false},
    isAdmin: {type:Boolean, default: false, unique: false},
    isSuperAdmin: {type:Boolean, default: false, unique: false},

    logs: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Log'
        }
    ]
});

UserSchema.plugin(passportLocalMongoose);

//mongoose middleware
UserSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Log.deleteMany({
            _id: {
                $in: doc.logs
            }

        })
    }
});

module.exports = mongoose.model('User', UserSchema);