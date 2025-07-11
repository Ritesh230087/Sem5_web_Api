require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')
const userRoutes=require('./routes/userRoute')
const categoryRouteAdmin= require('./routes/admin/categoryRouteAdmin')
const productRouteAdmin = require("./routes/admin/productRouteAdmin");
const userRoutesAdmin = require('./routes/admin/userRouteAdmin');
const ribbonRouteAdmin=require('./routes/admin/ribbonRouteAdmin')
const app = express();
const path = require("path") 
const PORT = process.env.PORT || 5050;



connectDB();

app.use(cors());
app.use(express.json());


app.use("/api/auth",userRoutes)
app.use("/api/admin/category", categoryRouteAdmin)
app.use("/api/admin/ribbon", ribbonRouteAdmin)
app.use("/api/admin/product", productRouteAdmin);
app.use("/api/admin/user", userRoutesAdmin);
app.use("/api/admin/user", require("./routes/admin/userRouteAdmin"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")))
console.log("Serving static files from:", path.join(__dirname, "uploads"));

app.get('/hey', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Server running on port number ${PORT}`);
});