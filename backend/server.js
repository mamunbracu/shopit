
const express = require('express')
const dotenv = require('dotenv')
const colors = require('colors')
const connectDB = require('./config/db')
const cookieParser = require('cookie-parser') 
const bodyParser = require('body-parser')
const cloudinary = require('cloudinary')
const fileUpload = require('express-fileupload')

// Handle Uncaught exception

process.on("uncaughtException", (err) => {
  console.log(`Logged Error: ${err.message}`.red.bold);
  // console.log(`Logged Error: ${err.stack}`.red.bold);
  console.log(`Shutting down server due to uncaught exception`.green.bold);
  
  process.exit(1);
});

dotenv.config()
connectDB()



const app = express()
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(fileUpload());


// Setting up cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})


// import all routes
 const products = require('./Routes/productRoutes')
 const auth = require('./Routes/authRoutes')
 const order = require('./Routes/orderRoutes')
 const payment = require('./Routes/payment')



 //all the routes
app.use("/api/v1", products)
app.use("/api/v1", auth)
app.use("/api/v1", order)
app.use("/api/v1", payment)



app.get('/', (req, res) => {
    res.send('API is running....')
  })




const port = process.env.PORT || 5000

const server = app.listen(port, console.log(`Server is running on ${process.env.NODE_DEV} server at port ${process.env.PORT}`.rainbow.bold))

process.on("unhandledRejection", (err, promise) => {
    console.log(`Logged Error: ${err.message}`.red.bold);
    server.close(() => process.exit(1));
  });