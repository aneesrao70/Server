const mongoose = require('mongoose');

const enterInventorySchema = new mongoose.Schema({
    ProductName : {
        type : String,
        required : true,
    },
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'registerData' // Reference to the User schema
      },
    Timestamp : {
        type: String,
        required: true,
      },
    NumberOfItem : {
        type: Number,
        required : true,
    },
    createdAt: { 
      type: Date, 
      default: Date.now }
});

const enterInventory = mongoose.model("Inventories" , enterInventorySchema);

module.exports = enterInventory ;