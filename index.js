const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const backendPort = 5000;
const registerUser = require('./Routes/register.js');
const loginUser = require('./Routes/login.js');
const addProduct = require('./Routes/AddProduct.js');
const SaleDetail = require('./Routes/SaleDetailRoute.js');
const enterInventory = require('./Routes/EnterInventoryRoute.js');


app.use(cors(
  {origin: "https://inventory-q6tk.onrender.com"}
  /* {origin: "https://localhost:3000"} */
  
  ));

app.use(bodyParser.json());
app.use(express.json());

require('dotenv').config();
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const connectionURL = `mongodb+srv://${dbUser}:${dbPassword}@cluster.2hmcqsp.mongodb.net/?retryWrites=true&w=majority`;
// Connect to MongoDB
mongoose
  .connect(connectionURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

  app.use('/api/auth', registerUser);
  app.use('/api/auth', loginUser);
  app.use('/api/auth', addProduct);
  app.use('/api/auth', SaleDetail);
  app.use('/api/auth', enterInventory);



  app.listen(backendPort, () => {
    console.log(`Server listening on port ${backendPort}`);
  });