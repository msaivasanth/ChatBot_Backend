const mongoose = require('mongoose');

const mongoURI = "mongodb://127.0.0.1:27017/hackathon"

connectToMongo = () => {
    mongoose.connect(mongoURI)
    console.log("conected to mongo sucessfully")
}

module.exports = connectToMongo;