const express = require('express');
const router = express.Router();
const SaleDetail = require('../Models/SaleDetail.js')
const authenticateMiddleware = require('../Middlewares/authenticatedMiddleware.js');

router.post('/Sale', authenticateMiddleware , async (req, res) => {
    const newData = req.body;
    const userId = req.user._id;

    const data = new SaleDetail({user: userId , ...newData});
 
    data.save()
        .then((result) => {
            console.log('Data saved to MongoDB:', result);
            res.status(201).json(result);
        })
        .catch((error) => {
            console.error('Error saving data to MongoDB:', error);
            res.status(500).json({ message: error });
        })
  });

  router.put('/Sale', authenticateMiddleware , async (req, res) => {
    try {
      const PaymentCheck = req.body.PaymentCheck;
      const saleId = req.body._id;
     

      const updatedSale = await SaleDetail.findByIdAndUpdate(
        saleId,
        { PaymentCheck : PaymentCheck},
        { new: true } 
      );
  
      res.json({ success: true, sale: updatedSale });
    } catch (error) {
      console.error('Error updating payment check:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  });


  router.get('/Sale', authenticateMiddleware , async (req, res) => {
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
      const sales = await SaleDetail.find(filters).collation({ locale: 'en', strength: 1 }).sort(sorter);
      res.json( {sales} );
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  router.delete('/Sale', authenticateMiddleware , async (req, res) => {
    const userId = req.user._id;
    const saleId = req.query.saleId;
    try {
      const deletedSale = await SaleDetail.findOneAndDelete({user: userId, _id: saleId})
      console.log('Sale deleted:' , deletedSale)
      res.status(201).json({message: "selected sale is deleted successfully"})
    } catch (err) {
      console.log('Error while deleting', err);
      res.status(500).json({ error: 'An error occurred.' });
    }


  })

  module.exports = router;