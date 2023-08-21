const mongoose = require('mongoose');

const enterInventorySchema = new mongoose.Schema({
    ProductName : {
        type : String,
        required : true,
    },
    NumberOfItems : {
        type: Number,
        required : true,
    }
});

const enterInventory = mongoose.model("Inventories" , enterInventorySchema);

module.exports = enterInventory ;