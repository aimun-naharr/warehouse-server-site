const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000
require('dotenv').config()
const jwt = require('jsonwebtoken');

app.use(cors())
app.use(express.json())
app.get('/', (req, res) => {
  res.send('Hello World!')
})

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.r0gzl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
    try{
        await client.connect()
        const productCollection=client.db('Bunch').collection('fruits')
        app.post('/uploadpd', async(req,res)=>{
            const product= req.body
            
            const result= await productCollection.insertOne(product)
            res.send({success: product})
        })
        app.get('/products', async(req, res)=>{
          const query={}
          const products= await productCollection.find(query).toArray()
          res.send(products)
        })
        app.get('/inventory/:id', async(req,res)=>{
          const id=req.params.id
          const query={_id:ObjectId(id)}
          const product= await productCollection.findOne(query)
          res.send({product})
        })
        app.delete('/product/:id', async(req,res)=>{
          const id =req.params.id
          const  query ={_id:ObjectId(id)}
          const result= await productCollection.deleteOne(query)
          res.send(result)
        })
        app.put('/quantity/:id', async(req,res)=>{
          const id =req.params.id
          let quantity=req.body.quantity
          
          const  query ={_id:ObjectId(id)}
          const options = { upsert: true }
          const updateDoc = {
            $set: {
             quantity: quantity-1
            }

          }
          const result=await productCollection.updateOne(query, updateDoc, options)
          res.send(result)
        })
        app.put('/addQuantity/:id', async(req,res)=>{
          const id =req.params.id
          const addQuantity= req.body.addQuantity
          const quantity=parseInt(req.body.quantity)
          
          const  query ={_id:ObjectId(id)}
          const options = { upsert: true }
          const sum= quantity+addQuantity
          const updateDoc = {
            $set: {
             quantity: sum
            }

          }
          const result=await productCollection.updateOne(query, updateDoc, options)
          res.send(result)
        })
        app.post('/login', async(req,res)=>{
          const email=req.body
          var token = jwt.sign(email, process.env.ACCESS_TOKEN);
         res.send({token})

        })
        app.post('/login', async(req,res)=>{
          const googleEmail=req.body
          console.log(googleEmail)
          var token = jwt.sign(email, process.env.ACCESS_TOKEN);
         res.send({token})

        })
    }
    finally{

    }
}
run().catch(console.dir)
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})