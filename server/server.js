const express = require('express');
const app = express();
const cors=require('cors');


require('dotenv').config({path:"./config.env"})
const port= process.env.PORT||5000;
//const port=5000;

//use middlewares
app.use(cors());
app.use(express.json());

//mongodb connect
const con=require('./db/connection.js')


//using roytes 
app.use(require('./routes/routes'));



con.then(db=>{
    if(!db) return process.exit(1);
    //listen to the http server only 
    app.listen(port,()=>{
        console.log(`Server is running on port:http://localhost:${port}`)
    })

    app.on('error',err=> console.log("Failed to connect with HTTP server "))
//if ther is an erro in mongo db connection


}).catch(error=>{
    console.log(`Connection Failed..! ${error}`)
})
