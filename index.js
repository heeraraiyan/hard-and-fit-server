const express = require('express');

const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');


// middleware 
app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fwkvcsa.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const featureCollection = client.db("hardDb").collection("features");
    const trainerCollection = client.db("hardDb").collection("trainers");
    const userCollection = client.db("hardDb").collection("users");
    const subscribeCollection = client.db("hardDb").collection("subscribes");
    const beTrainerCollection = client.db("hardDb").collection("betrainers");
    const postCollection = client.db("hardDb").collection("posts");


    app.get('/posts', async(req, res) =>{
      const result = await postCollection.find().toArray();
      res.send(result);
  })

    // betrainers 


    app.post('/betrainers',async(req,res)=>{
      const betrainer = req.body;
      const result = await beTrainerCollection.insertOne(betrainer);
      res.send(result);
    })



    // subscribes 

    app.post('/subscribes',async(req,res)=>{
      const subscriber = req.body;
      const result = await subscribeCollection.insertOne(subscriber);
      res.send(result);
    })

    app.get('/subscribes', async(req, res) =>{
        const result = await subscribeCollection.find().toArray();
        res.send(result);
    })

    app.get('/users',async(req,res)=>{
      const result =await userCollection.find().toArray();
      res.send(result)
    })

    app.get('/users/:email', async(req, res) =>{
      const email = req.params.email;
      const query = {email:email}
      const user =await userCollection.findOne(query);
        const result = {admin: user?.role === 'admin'}
        res.send(result);
    })


    // user related 

    app.post('/users', async (req,res) =>{
      const user =req.body;
      const query ={ email: user.email}
      const existingUser = await userCollection.findOne(query);
      if(existingUser){
        return res.send({ message: 'user already exist' , insertedId: null })
      }
      const result = await userCollection.insertOne(user);
      res.send(result);
    })

    app.get('/features', async(req, res) =>{
        const result = await featureCollection.find().toArray();
        res.send(result);
    })

    app.get('/trainers', async(req, res) =>{
        const result = await trainerCollection.find().toArray();
        res.send(result);
    })


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req, res) =>{
    res.send('hard working ')
})


app.listen(port,()=>{
    console.log(`hard is working on port ${port}`)
})