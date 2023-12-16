const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT || 5000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.Db_User}:${process.env.Db_Pass}@cluster0.0bsejvl.mongodb.net/?retryWrites=true&w=majority`;

console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const coffeeCollection = client.db("coffeeDB").collection("coffees");
    const userCollection=client.db('coffeeDB').collection("users")

    //   <------userCollection------->

    // post method
    app.post('/user',async(req,res)=>{
      const user=req.body;
      console.log(user);
      const result=await userCollection.insertOne(user);
      res.send(result)
    })

    // get method

    app.get('/user',async(req,res)=>{
      const result=await userCollection.find().toArray()
      res.send(result)
    })
   // delete method
   
   app.delete("/user/:id",async(req,res)=>{
     const id=req.params.id
     console.log(id);
     const query={_id:new ObjectId(id)}
     const result=await userCollection.deleteOne(query)
     res.send(result)
   })

   // patch method

   app.patch('/user',async(req,res)=>{
       const updateUser=req.body;
       const filter = { email: updateUser.email }
       const updatedDoc={
        $set:{
          lastSignInTime:updateUser.lastSignInTime
        }
       }

       const result=await userCollection.updateOne(filter,updatedDoc)
       res.send(result)
   })


    //   <------coffeeCollection------>

    // post coffee

    app.post("/coffee", async (req, res) => {
      const newCoffee = req.body;
      console.log(newCoffee);
      const result = await coffeeCollection.insertOne(newCoffee);
      res.send(result);
    });

    app.get("/coffee", async (req, res) => {
      const result = await coffeeCollection.find().toArray();
      res.send(result);
    });

    app.get("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.findOne(query);
      res.send(result);
    });

    app.delete("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.deleteOne(query);
      res.send(result);
    });
    // update coffee
    app.put("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const updateCoffee = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          name: updateCoffee.name,
          quantity: updateCoffee.quantity,
          supplier: updateCoffee.supplier,
          taste: updateCoffee.taste,
          category: updateCoffee.category,
          photo: updateCoffee.photo,
          details: updateCoffee.details,
        },
      };
      const result = await coffeeCollection.updateOne(filter,updatedDoc,options);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Coffee server is running");
});

app.listen(port, () => {
  console.log(`Coffee server is running on port ${port}`);
});
