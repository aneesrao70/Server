const mongoose = require('mongoose');


const addProductSchema = new mongoose.Schema({
    ProductName: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'registerData' // Reference to the User schema
      }
  });


  const addProduct = mongoose.model('Product', addProductSchema);

  module.exports = addProduct;