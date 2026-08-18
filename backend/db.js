const mongoose = require('mongoose')
const mongoURI = process.env.MONGO_URI

const connectToMongo = async ()=>{
    try{
        await mongoose.connect(mongoURI)
        console.log("Connected to mongo succesfully")
    }
    catch(err){
        console.log(err)
    }
}
module.exports = connectToMongo