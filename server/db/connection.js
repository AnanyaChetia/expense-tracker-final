const mongoose= require('mongoose');
const conn = mongoose.connect(process.env.ATLAS_URI)
    .then(db=>{
        console.log("database Connected");
        return db;
    }).catch(err=>{
        console.log("Connection Error");
    })
    module.exports=conn;