const mongoose=require("mongoose")

//create database and connecting database
mongoose.set('strictQuery',true)
mongoose.connect("mongodb://localhost:27017/Click-Buy")
mongoose.connection.on("connected",(err)=>{
    if(err){
        console.log(err);
    }else{
        console.log("Mongoose connected successfully");
    }
})