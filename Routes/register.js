const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const registerData = require('../Models/registerData.js');
const sendEmail = require('../NodeMailer/nodemailer.js');
const crypto = require('crypto');
const resetToken = require('../Models/resetpasswordModel.js')

/* const site = "http://localhost:3000/"; */
const site = "https://inventory-q6tk.onrender.com/";


router.post('/reset' , async (req, res) => {
  const token = req.body.resettoken;
  const password = req.body.password;

  try {
    const user = await resetToken.findOne({resetToken: token})
    if (!user) {
      res.status(404).json({message: "User not found"});
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const updated = await registerData.findOneAndUpdate({email: user.email} , {password: hashedPassword} , {new : true});
    res.status(200).json({message: 'Password updated successfully, please login.'})

  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }


});

router.post('/resetpassword' , async (req, res) => {
  const email = req.body.email;
  console.log(email);
  try {
    const user = await registerData.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ message: 'User not found, Please register' });
    }

    const resettoken = crypto.randomBytes(16).toString('hex'); // Implement your token generation logic
    const resetInfo = new resetToken({resetToken: resettoken , email: email});
    await resetInfo.save();
    const resetpasswordlink = `${site}verify/?reset=${resettoken}`
    const text = `Click on the ${resetpasswordlink} to verify your Email and then reset your password.`;
    sendEmail(email , text)

    // Send reset email with the reset link containing resetToken
    // ...

    res.status(200).json({ message: 'Reset email sent' });
  } catch (error) {
    console.error('Error sending reset email:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
})


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
            const verificationToken = crypto.randomBytes(16).toString('hex');
            console.log('verificationToken is :' , verificationToken);

            const data = new registerData({...newData , password:hashedPassword , verificationtoken: verificationToken});
 
            data.save()
                .then((result) => {
                    console.log('Data saved to MongoDB:', result);
                    /* res.header("Access-Control-Allow-Origin" , "https://inventory-q6tk.onrender.com") */
                    res.status(201).json(result);
                })
                .catch((error) => {
                    console.error('Error saving data to MongoDB:', error);
                    /* res.header("Access-Control-Allow-Origin" , "https://inventory-q6tk.onrender.com") */
                    res.status(500).json({ message: error });
                });
                const verificationlink = `${site}verify/${verificationToken}`;
                const text = `Welcome to our app! Your account has been created. Please click the following link to verify your email: ${verificationlink}`;
                sendEmail(data.email , text)
        } catch (error) {
            console.error('Error hashing password:', error);
/*             res.header("Access-Control-Allow-Origin" , "https://inventory-q6tk.onrender.com") */
            res.status(500).json({ message: error });

        }


    }
 
  });

  router.get('/verify', async (req, res) => {
    const verificationtoken = req.query.verificationtoken;

  
    try {
      const user = await registerData.findOne({ verificationtoken: verificationtoken});
  
      if (!user) {
        return res.status(404).json({ message: 'Invalid token' });
      }


      const userId = user._id;
      const result = await registerData.findOneAndUpdate({_id: userId}, {verified: true} , {new : true});
      console.log('updated user is:' ,result);
  
      res.status(200).json({ message: 'Email verified successfully, Please login.' });
    } catch (error) {
      console.error('Error verifying email:', error);
      res.status(500).json({ message: error });
    }
  });


  module.exports = router;