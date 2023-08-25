  const mongoose = require('mongoose');

  const SaleDetailSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'registerData' // Reference to the User schema
      },
    ProductName: {
      type: String,
      required: true,
    },
    NumberOfItem: {
      type: Number,
      required: true,
      min: 1,
    },
    PricePerItem: {
      type: Number,
      required: true,
      min: 1,
    },
    discount:{
      type: Number,
      required: true,
    },
    TotalPrice : {
      type: Number,
      required: true,
    },
    Timestamp: {
      type: String,
      required: true,
    },
    createdAt: { 
      type: Date, 
      default: Date.now },
    ClientName : {
      type: String,
    },
    ClientPhone : {
      type: String,
    },
    PaymentCheck : {
      type: Number,
      required: true,
    }

  })

  const SaleDetail = mongoose.model('Sale', SaleDetailSchema);

  module.exports = SaleDetail;