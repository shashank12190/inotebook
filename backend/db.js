const mongoose = require('mongoose')
const mongoURI = 'mongodb://localhost:27017/inotebook?readPreference=primary&appname=MongoDB%20Compass&ssl=false'

const connectToMango = () => {
    mongoose.connect(mongoURI, () => {
        console.log('connected to Mongo successfully');

    })
}

module.exports = connectToMango;