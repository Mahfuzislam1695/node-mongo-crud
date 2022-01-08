const express = require('express');
const bodyParser = require('body-parser');
const object = require('mongodb').ObjectId;

const password = 'nf9i-ay3!btA9F3';


const { MongoClient, ObjectId } = require('mongodb');
const res = require('express/lib/response');
const req = require('express/lib/request');
const uri = "mongodb+srv://organicUser:nf9i-ay3!btA9F3@cluster0.5zsfm.mongodb.net/organicdb?retryWrites=true&w=majority";



const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.get('/',(req, res) => {
    res.sendFile(__dirname + '/index.html');
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productCollection = client.db("organicdb").collection("products");

  app.get("/products", (req, res) => {
    productCollection.find({})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })

  app.get('/product/:id', (req, res) => {
    productCollection.find({_id: ObjectId(req.params.id)})
    .toArray((err, documents) => {
      res.send(documents[0]);
    })
  })

  app.post("/addProduct", (req, res) => {
    const product = req.body;
    productCollection.insertOne(product)
    .then(result => {
      console.log('data added successfully');
      res.redirect('/')
    })
  })

  app.patch('/update/:id',(req, res) =>{
    productCollection.updateOne({_id: ObjectId(req.params.id)},
    {
      $set: {price: req.body.price, quantity: req.body.quantity}

    })
    .then (result => {
      res.send(result.modifiedCount > 0)
    })
  })

app.delete('/delete/:id', (req, res) =>{
  productCollection.deleteOne({_id: ObjectId(req.params.id) })
  .then(result => {
    res.send(result.deletedCount > 0);
  })
})

});  

app.listen(3000);