const express = require('express');
const router = express.Router();
const authenticatedMiddleware = require('../Middlewares/authenticatedMiddleware.js');
const enterInventory = require('../Models/EnterInventoryModel.js');


router.post('/inventory' , authenticatedMiddleware , async (req, res) => {
    const {selectedProduct , numberOfItems} = req.body;
    const userId = req.user._id;
    try {
        data = new enterInventory({user: userId , ProductName : selectedProduct , NumberOfItems : numberOfItems});
        const result = await data.save();
        console.log("data is saved to  inventory", result);
        res.status(201).json(result);
    } catch (err) {
        console.log('error saving invertory to db', err);
        res.status(500).json({message: err});

    }
})

module.exports = router;
