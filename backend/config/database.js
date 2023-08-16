const mongoose = require("mongoose");

const connectDatabase = ()=>{
    mongoose.connect(process.env.DB_URI,{useNewUrlParser:true}).then((data)=>{
        console.log(`connected to the database ${data}`)
    })
}

module.exports=connectDatabase;