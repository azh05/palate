const express = require('express');  
const cors = require('cors');  
const bodyParser = require('body-parser');  
require('dotenv').config();  

const app = express();  
const PORT = process.env.PORT || 9000;  

// Middleware  
app.use(cors());  
app.use(bodyParser.json());  

// Test route  
app.get('/', (req, res) => {  
  res.send('Palate Backend is running!');  
});  

// Start server  
app.listen(PORT, () => {  
  console.log(`Server is running on port ${PORT}`);  
});  