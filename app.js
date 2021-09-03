
const express = require('express');
var router = express.Router();
const engines = require('consolidate');
const app = express();

var bodyParser = require("body-parser");
const { Router } = require('express');
app.use(bodyParser.urlencoded({ extended: false }));

var publicDir = require('path').join(__dirname,'/public');
app.use(express.static(publicDir));

//npm i handlebars consolidate --save
app.engine('hbs',engines.handlebars);
app.set('views','./admin');
app.set('view engine','hbs');

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb+srv://quangnhgch190628:quang1409@cluster0.c1irk.mongodb.net/test';

app.get('/all',async function(req,res){
    let client= await MongoClient.connect(url);
    let dbo = client.db("DOBCyber");
    let results = await dbo.collection("product").find({}).toArray();
    res.render('indexadmin',{products:results});
})

app.get('/insert',async function(req,res){
    res.render('insertproducts');
})

app.post('/doInsert',async function (req,res){
    let client= await MongoClient.connect(url);
    let dbo = client.db("DOBCyber");
    let name = req.body.txtName;
    let price = req.body.txtPrice;
    // if(price >=1000){
    //     console.log("không được nhập giá trị lớn hơn 1000");
    //     res.render("insert", {errorMsg: 'Giá phải nhỏ hơn 1000'})
    //     return;
    // }
    let amount = req.body.txtAmount;
    let description = req.body.txtDescription;
    let newProduct = {name : name, price : price, description:description,amount:amount};
    await dbo.collection("product").insertOne(newProduct);
    console.log(newProduct);
    
    res.redirect('/all');
});

app.get('/edit',async (req,res)=>{
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;

    let client = await MongoClient.connect(url);
    let dbo = client.db("DOBCyber");
    let results = await dbo.collection("product").findOne({_id : ObjectID(id)});
    res.render('updateproducts', {ProductDB:results});
})
app.post('/doUpdate', async (req, res)=>{
    let id =req.body.id;
    let name = req.body.txtName;
    let price = req.body.txtPrice;
    let amount = req.body.txtAmount;
    let description = req.body.txtDescription;

    let newValue = {$set : {name: name, price: price, amount : amount, description : description}};
    var ObjectID = require('mongodb').ObjectID;
    let condition = {"_id" : ObjectID(id)};

    let client = await MongoClient.connect(url);
    let dbo = client.db("DOBCyber");
    await dbo.collection("product").updateOne(condition,newValue)

    res.redirect('index');
})

app.get('/delete',async function(req,res){
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;
    let condition = {"_id" : ObjectID(id)};

    let client= await MongoClient.connect(url);
    let dbo = client.db("DOBCyber");
    await dbo.collection("product").deleteOne(condition);
    res.redirect('/all');
})





var server = app.listen(process.env.PORT||5000,function(){
    console.log("Server is running...");
})