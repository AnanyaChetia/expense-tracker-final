// const model= require('../models/model');

// //get categories
// //post:http://localhost:8080/api/categories
// function create_categories(req,res){
//     const Create= new model.Categories({
//         type:"Savings",
//         color:'#1F3B5C'
//     })

//     Create.save(function(err){
//         if(!err) return res.json(Create);
//         return res.status(400).json({message:`Error while creating categories${err} `})

//     })
//     //res.json("Get Request from Categories")
// }

// module.exports={
//     create_categories
// }


const { Aggregate } = require('mongoose');
const model = require('../models/model');

//get categories
//post: http://localhost:8080/api/categories
async function create_categories(req, res) {
    try {
        const Create = new model.Categories({
            type: "Investment",
            color: '#FCBE44'
        });

        // Save the category using async/await
        const savedCategory = await Create.save();

        res.json(savedCategory);
    } catch (err) {
        console.error('Error while creating categories:', err);
        res.status(400).json({ message: `Error while creating categories: ${err}` });
    }
}

//get:http://localhost://8080/api/categories

async function get_Categories(req,res){

    // let data = await model.Categories.find({})
    // return res.json(data);
// if we want to ge only ythe filtered categories 
    let data = await model.Categories.find({})
    let filter = await data.map(v=>Object.assign({},{type:v.type,color:v.color}));
    return res.json(filter);
}
//post: http://localhost:8080/api/transaction
// async function create_transaction(req,res){
//     //get the data from the user
//     if(!req.body) return res.status(400).json("Post HTTP data not provided")
//     let{name,type,amount}=req.body;

//     const create = await new model.Transaction(
//         {
//          name,
//          //name 
//          type,
//          amount,
//          date:new Date()

//         }
//     );

//     create.save(function(err){
//         if(!err) return res.json(create);
//         return res.status(400).json({message:`Error while creating transactions ${err}`})
//     } )

// }


// Create a new transaction
// async function create_transaction(req, res) {
//     if (!req.body) return res.status(400).json({ message: "Post HTTP data not provided" });

//     const { name, type, amount } = req.body;

//     try {
//         const newTransaction = new model.Transaction({
//             name,
//             type,
//             amount,
//             date: new Date()
//         });

//         const savedTransaction = await newTransaction.save();
//         res.json(savedTransaction);
//     } catch (err) {
//         console.error('Error while creating transaction:', err);
//         res.status(400).json({ message: `Error while creating transaction: ${err}` });
//     }
// }


//post: http://localhost:8080/api/transaction
async function create_transaction(req, res) {
    if (!req.body) return res.status(400).json({ message: "Post HTTP data not provided" });

    const { name, type, amount } = req.body;

    try {
        const newTransaction = new model.Transaction({
            name,
            type,
            amount,
            date: new Date()
        });

        const savedTransaction = await newTransaction.save();
        res.json(savedTransaction);
    } catch (err) {
        console.error('Error while creating transaction:', err);
        res.status(400).json({ message: `Error while creating transaction: ${err}` });
    }
}

//get: http://localhost:8080/api/transaction
async function get_Transaction(req,res){
    let data= await model.Transaction.find({});
    return res.json(data);
}

//delete: http://localhost:8080/api/transaction
// async function delete_Transaction(req,res){
//     if(!req.body)res.status(400).json({message:"Request body not found"});
//     await model.Transaction.deleteOne(req.body,function(err){
//      if(!err)res.json("Record Deleted...!");   
//     }).clone().catch(function(err){res.json("Error while deleting Transaction Record")})
// }


async function delete_Transaction(req, res) {
    if (!req.body) {
        return res.status(400).json({ message: "Request body not found" });
    }

    try {
        const result = await model.Transaction.deleteOne(req.body);

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        res.json({ message: "Record Deleted...!" });
    } catch (err) {
        console.error('Error while deleting transaction:', err);
        res.status(400).json({ message: "Error while deleting Transaction Record" });
    }
}

//get: http://localhost:8080/api/labels
async function get_Labels(req,res){
    model.Transaction.aggregate([
        {
           $lookup: {
               from:"categories",
               localField:'type',// inside categories we have the type fields also under transactions we have type fields 
               foreignField:"type",
               as:"categories_info"//the name of the output array
           } 
        },
        {
            $unwind: "$categories_info"
        }
    ]).then(result=>{
        let data = result.map(v => Object.assign({}, { _id: v._id, name: v.name, type: v.type, amount: v.amount, color: v.categories_info['color']}));
        res.json(data);
    }).catch(error=>{
        res.status(400).json("Lookup collection error")
    })
}


module.exports = {
    create_categories,
    get_Categories,
    create_transaction,
    get_Transaction,
    delete_Transaction,
    get_Labels
};