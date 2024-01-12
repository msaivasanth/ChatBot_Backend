const mongoose = require('mongoose');

const mongoURI = "mongodb+srv://saivasanth1718:..RN9hJVagCcWj9@inotebook-cloud.1ltb6hk.mongodb.net/hackathon"

connectToMongo = () => {
    mongoose.connect(mongoURI)
    console.log("conected to mongo sucessfully")
}

module.exports = connectToMongo;