const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
const objectID = mongodb.ObjectID;

const dbURL="mongodb://127.0.0.1:27017/";
 let c=0;
const app = express();
app.use(bodyParser.json());
app.use(cors());
const port = process.env.PORT || 4000;
app.listen(port, () => console.log("your app is running in", port));
// app.post("/admin",(req,res)=>{
//     mongoClient.connect(dbURL,(err,client)=>{
// if(err) throw err;
// let db=client.db("SHACRM");
// if(c<1){ 
//     c=c+1;
// db.collection("details").insertOne(req.body,(err,data)=>{
//     if(err) throw err;
//      res.json({message:"Admin  Created"}) 

//     client.close();
// })
// }
// else{

//     console.log("Admin cannot be Created");
//     res.json({message:"Admin cannot be Created"})
// }
// });
//     });

app.get("/getadmin",(req,res)=>{
    mongoClient.connect(dbURL,(err,client)=>{
        if(err) throw err;
        let db=client.db("SHACRM");
        db.collection("details")
        .find()
        .toArray()
        .then((data)=>{
            res.json(data);
        })
        .catch((err)=>{
            res.json({message:"no data found",
        error:err});
        });
    });
});


app.put("/users/:employee", (req, res) => {
    mongoClient.connect(dbURL, (err, client) => {
      if (err) throw err;
      client
        .db("studentDetail")
        .collection("users")
        .findOneAndUpdate({ _id: objectID(req.params.id) }, { $set: req.body })
        .then((data) => {
          console.log("User data update successfully..!!");
          client.close();
          res.status(200).json({
            message: "User data updated..!!",
          });
        });
    });
  });



  app.post("/manager/:email", (req, res) => {
    mongoClient.connect(dbURL, (err, client) => {
      if (err) throw err;
      client
      client
      .db("SHACRM")
      .collection("details")
      .findOne({email:req.params.email},(err,data)=>{
          console.log(data)
          if(err) throw err;
          if(data.type==="manager" && data.rights==="true")
          {
            client.db("SHACRM").collection("clients").insertOne(req.body)
              res.json({message:"clients are created"})
              client.close();
          } 
          else{
              res.json(
                  {message:"i am not a manager"}
              )
          }
      })
      
       
    });
  });

app.post("/add/:email",(req,res)=>{
    mongoClient.connect(dbURL,(err,client)=>{
        if(err) throw err;
        client
        .db("SHACRM")
        .collection("details")
        .findOne({email:req.params.email},(err,data)=>{
            console.log(data)
            if(err) throw err;
            if(data.type==="admin" && data.rights==="true")
            {
              client.db("SHACRM").collection("details").insertOne(req.body)
                res.json({message:"employee and managers are created"})
                client.close();
            } 
            else{
                res.json(
                    {message:"i am not admin"}
                )
            }
        })
        
    });
});


 
app.put("/deebika/:email",(req,res)=>{
    mongoClient.connect(dbURL,(err,client)=>{
        if(err) throw err;
        client.db("SHACRM").collection("details").findOne({email:req.params.email},(err,data)=>{
            if(err) throw err;
            console.log(data)
            if(data.rights==="true/edit" || data.type==="employee"){
              client.db("SHACRM").collection("clients").findOneAndUpdate({
                  name:req.body.name},
                  {$set:req.body}

                  )
                  console.log("hai")
                  res.json({message:"i am updated"})
                }
                else{
                    let db=client.db("SHACRM");
        db.collection("details")
        .find()
        .toArray()
        .then((data)=>{
            res.json(data);
        })
        .catch((err)=>{
            res.json({message:"no data found",
        error:err});
        });
                }
        })
    })
})