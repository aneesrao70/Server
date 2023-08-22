const express = require('express');
const router = express.Router();
const authenticatedMiddleware = require('../Middlewares/authenticatedMiddleware.js');
const enterInventory = require('../Models/EnterInventoryModel.js');


router.post('/inventory' , authenticatedMiddleware , async (req, res) => {
    const newData = req.body;
    const userId = req.user._id;
    try {
        data = new enterInventory({user: userId , ...newData});
        const result = await data.save();
        console.log("data is saved to  inventory", result);
        res.status(201).json(result);
    } catch (err) {
        console.log('error saving invertory to db', err);
        res.status(500).json({message: err});

    }
})

router.get('/inventory' , authenticatedMiddleware , async (req, res) => {
    const userId = req.user._id;
    try {
        const SubString = req.query.prodName || '';
        const filters = {user: req.user._id};
        let sorter = '';
        const SortString = req.query.filterParam;
        if (SortString === '') {
          sorter = '-createdAt'
        }
        if (SortString === 'AscendingLetter') {
          sorter = 'ProductName'
        }
        if (SortString === 'DescendingLetter') {
          sorter = '-ProductName'
        }
        if (SortString === 'NewestOnTop') {
          sorter = '-createdAt'
        }
        if (SortString === 'OldestOnTop') {
          sorter = 'createdAt'
        }
  
        // Check if product name query parameter is provided
        if (req.query.prodName) {
          filters.ProductName = { $regex: `^${SubString}`, $options: 'i' };
        }
        if (req.query.startDate && req.query.endDate) {
          filters.Timestamp = {
            $gte: req.query.startDate,
            $lte: req.query.endDate,
          };
        }
        inventoryAddData = await enterInventory.find(filters).collation({ locale: 'en', strength: 1 }).sort(sorter);
        console.log("Inventory Added Data is", inventoryAddData);
        res.status(200).json(inventoryAddData);
    } catch (err) {
        console.log('error fetching the inventory added data', err);
        res.status(500).json({message: err});

    }
})

  router.delete('/Inventory', authenticatedMiddleware , async (req, res) => {
    const userId = req.user._id;
    const saleId = req.query.saleId;
    try {
      const deleted = await enterInventory.findOneAndDelete({user: userId, _id: saleId})
      console.log('Inventory deleted:' , deleted)
      res.status(201).json({message: "selected sale is deleted successfully"})
    } catch (err) {
      console.log('Error while deleting', err);
      res.status(500).json({ error: 'An error occurred.' });
    }
});

module.exports = router;
