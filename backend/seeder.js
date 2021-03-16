

const mongoose = require('mongoose')
const dotenv = require('dotenv')
const colors = require('colors')
const connectDB = require('./config/db')
const Products = require('./Models/Products')
const  products  = require('./data/products')

dotenv.config()

connectDB()

const importData = async () => {
  try {
    await Products.deleteMany()
    console.log('Data Deleted!'.red.inverse)
    await Products.insertMany(products)
    console.log('Data Imported!'.green.inverse)
    process.exit()
  } catch (error) {
    console.error(`${error}`.red.inverse)
    process.exit(1)
  }
}

const destroyData = async () => {
  try {

    await Products.deleteMany()
    console.log('Data Destroyed!'.red.inverse)
    process.exit()
  } catch (error) {
    console.error(`${error}`.red.inverse)
    process.exit(1)
  }
}

if (process.argv[2] === '-d') {
  destroyData()
} else {
  importData()
}




