const express = require('express');
const router = express.Router();
const addProduct = require('../Models/AddProduct.js');
const authenticateMiddleware = require('../Middlewares/authenticatedMiddleware.js');


router.delete('/product', authenticateMiddleware , async(req, res) => {
    const { ProductName } = req.body;
    try {
        const del = await addProduct.findOneAndDelete({user: req.user._id , ProductName: ProductName });
        console.log('product deleted', del);
        res.status(200).json({del: del});
    } catch (err) {
        console.log('Error while deleting', err);
        res.status(500).json({ error: 'An error occurred.' });
    }

  })


  router.get('/product', authenticateMiddleware , async (req, res) => {
    try {
        const ProductName = await addProduct.find({user : req.user._id});
        res.status(200).json(ProductName);
    }
    catch (err) {
        console.error('error while fetching products', err);
        res.status(500).json({ error: 'An error occurred.' });
    }
  })
 
  router.post('/product', authenticateMiddleware , async (req , res ) => {
    const {ProductName} = req.body;
    const userId = req.user._id;

        const ProductCheck = await addProduct.findOne({user: userId , ProductName: { $regex: new RegExp('^' + ProductName + '$', 'i') }});
        if (ProductCheck) {
            console.log(ProductCheck);
                return res.status(409).json({ product: ProductCheck });
              }
        else {
            try  {
                const data = new addProduct({user: userId, ProductName : ProductName});    
                result = await data.save() 
                console.log('Data saved to MongoDB:', result);
                res.status(201).json(result);
            } catch(err)  {
                console.error('Error saving data to MongoDB:', err);
                res.status(500).json({ message: err });
            }

        }
  });

  module.exports = router ;