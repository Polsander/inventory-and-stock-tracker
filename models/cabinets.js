const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Unit = require('./units')
const Stock = require('./stock');

const CabinetSchema = new Schema({
    name: String,
    // langley is the quantity of cabinets that are located in langley
    langley: Number,
    // nakusp is the quantity of cabinets that are located in nakusp
    nakusp: Number,
    leeway: Number, //number of days for receiving incoming shipments
    units: [
        {
            type: Schema.Types.ObjectId,
            ref: "Unit"
        }
    ]
});


//Below is a mongoose query middleware
CabinetSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Unit.deleteMany({
            _id: {
                $in: doc.units
            }

        })
    }
})


module.exports = mongoose.model('Cabinet', CabinetSchema);
