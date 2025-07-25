require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')
const userRoutes=require('./routes/userRoute')
const categoryRouteAdmin= require('./routes/admin/categoryRouteAdmin')
const productRouteAdmin = require("./routes/admin/productRouteAdmin");
const orderRouteAdmin=require("./routes/admin/orderRouteAdmin")
const shippingRoute = require('./routes/shippingRoute');
const payment= require("./routes/admin/payment") 
const notificationRoute = require('./routes/admin/notificationRoute');
const userRoutesAdmin = require('./routes/admin/userRouteAdmin');
const ribbonRouteAdmin=require('./routes/admin/ribbonRouteAdmin')
const orderRoutes = require('./routes/orderRoute');
const app = express();
const path = require("path") 
const PORT = process.env.PORT || 5050;


 
connectDB();

app.use(cors({
  origin: 'http://localhost:5173', // NOT "*"
  credentials: true               // Allow cookies/auth headers
}));
app.use(express.json());


app.use("/api/auth",userRoutes)
app.use('/api/orders', orderRoutes); 
app.use("/api/admin/category", categoryRouteAdmin)
app.use("/api/admin/ribbon", ribbonRouteAdmin)
app.use("/api/admin/product", productRouteAdmin);
app.use("/api/admin/order", orderRouteAdmin);
app.use('/api/shipping', shippingRoute);
app.use('/api/payments', payment);
app.use('/api/notifications', notificationRoute);
app.use("/api/admin/user", userRoutesAdmin);
app.use("/uploads", express.static(path.join(__dirname, "uploads")))
console.log("Serving static files from:", path.join(__dirname, "uploads"));

app.get('/hey', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Server running on port number ${PORT}`);
});



module.exports = app;