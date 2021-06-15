const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user');

const LogSchema = new Schema ({
    message: String,
    changedName: String,
    changedLangley: String,
    changedNakusp: String,
    changedCabinet: String,
    date: Date,

    users: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
        }
    ]
});

module.exports = mongoose.model('Log', LogSchema);