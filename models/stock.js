const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Unit = require('./units');
const Cabinet = require('./cabinets');

const StockSchema = new Schema({
    outData: Array,
    totalMonthData: Array,
    average: Number,
    message: String,
    date: Date,

    unit: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Unit'
        }
    ],

    cabinet : [
        {
            type: Schema.Types.ObjectId,
            ref: 'Cabinet'
        }
    ]
})

module.exports = mongoose.model('Stock', StockSchema);