const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const registerData = require('../Models/registerData.js');



router.post('/register', async(req, res) => {
    const newData = req.body;
    // Create a new document and save it to MongoDB
    const validatePassword = (password) => {
      return password.length > 7  && /[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password);
    };

   
        // Check if email already exists
        const existingUser = await registerData.findOne({ email:newData.email });

        if (newData.agree !== true) {
          return res.status(403).json({message:'Agree with terms and conditions'})
        }
        else if (existingUser) {
          return res.status(409).json({message: 'Email already exists. Please sign in.' });
        }
        else if (newData.password !== newData.confirmpassword) {
          return res.status(403).json({message: "Password does not match."});
        }
        else if (!validatePassword(newData.password)) {
          return res.status(410);
        }
        else {
          try {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
            const data = new registerData({...newData , password:hashedPassword});
 
            data.save()
                .then((result) => {
                    console.log('Data saved to MongoDB:', result);
                    res.header("Access-Control-Allow-Origin" , "https://inventory-q6tk.onrender.com")
                    res.status(201).json(result);
                })
                .catch((error) => {
                    console.error('Error saving data to MongoDB:', error);
                    res.header("Access-Control-Allow-Origin" , "https://inventory-q6tk.onrender.com")
                    res.status(500).json({ message: error });
                });
        } catch (error) {
            console.error('Error hashing password:', error);
            res.header("Access-Control-Allow-Origin" , "https://inventory-q6tk.onrender.com")
            res.status(500).json({ message: error });
        }
    }
 
  });


  module.exports = router;