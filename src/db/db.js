const mongoose = require('mongoose')

function connectDB(){
    mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log('Database connected successfully'))
    .catch((error) => console.error('Database connection failed:', error))
}

module.exports = connectDB