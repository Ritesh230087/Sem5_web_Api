require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const User = require('./models/UserModels');
const userRoutes=require('./routes/userRoute')
const app = express();
const PORT = process.env.PORT || 3000;



connectDB();
app.use(express.json());


app.use("/user",userRoutes)

app.get('/hey', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Server running on port number ${PORT}`);
});