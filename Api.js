const dotenv =require('dotenv') 
const express = require("express")

const app = express()

dotenv.config({path:'./.env'})

const PORT =process.env.PORT
require('./db/conn')

app.use(require('./router/auth'))

app.listen(PORT, ()=>{
    console.log(`server is runing port ON ${PORT}`)
})