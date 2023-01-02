// const mongoose= require('mongoose');
const mongoose = require('mongoose');

const DB= process.env.databaseurl;

mongoose.set('strictQuery', false);

mongoose.connect(DB ,{
    useNewUrlParser:true,
    // useCreateIndex:true,
    useUnifiedTopology:true,
    // useFindAndModify:false
}).then(()=>{
    console.log("Connection Successfull")
}).catch((err)=>{
    console.log(err ,"No Connection")
})
