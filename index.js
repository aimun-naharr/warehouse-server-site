const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000
require('dotenv').config()

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
            console.log(product)
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
    }
    finally{

    }
}
run().catch(console.dir)
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})