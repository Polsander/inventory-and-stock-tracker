const mongoose = require('mongoose');
const Schema = mongoose.Schema

const UnitSchema = new Schema({
    name: String,
    //Langley is the number of units located in langley
    langley: Number,
    
});

module.exports = mongoose.model('Unit', UnitSchema);