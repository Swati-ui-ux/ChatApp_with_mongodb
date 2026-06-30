const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.CONNECTION_STRING, {
      serverSelectionTimeoutMS: 5000,
    })
    console.log('MongoDB connected successfully')
    return true
  } catch (error) {
    console.error('MongoDB connection failed:', error.message)
    return false
  }
}

module.exports = connectDB
