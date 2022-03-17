const express=require('express');
const { MongoClient } = require('mongodb');
const cors=require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const ObjectId=require("mongodb").ObjectId;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.klk0u.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        const database=client.db('food_order');
        const foodCollection=database.collection('foods');
        const orderCollection=database.collection('orders');


        //Food POST API
        app.post('/foods',async(req,res)=>{
            // console.log(req.body);
            const newFood=req.body;
            console.log('hit the post api',newFood);
            const result= await foodCollection.insertOne(newFood);
            res.json(result);
            
        })

        // Order post API
        app.post('/orders', async(req,res)=>{
            console.log(req.body);
            const order=req.body;
            const result= await orderCollection.insertOne(order);
            res.json(result);
        })

        // Get Food API
        app.get('/foods',async(req,res)=>{
            const cursor=foodCollection.find({});
            const foods= await cursor.toArray();
            res.send(foods);
            //  console.log(foods);
        })

        // Get Order API
        app.get('/orders',async(req,res)=>{
            const cursor= orderCollection.find({});
            const order = await cursor.toArray();
            res.send(order);
        })

        // Get Single API
        app.get('/foods/:id',async(req,res)=>{
            const id=req.params.id;
            const query={_id: ObjectId(id)};
            const foods= await foodCollection.findOne(query);
            res.json(foods);
        })

        // Order delete API
        app.delete('/order/:id',async(req,res)=>{
            const id=req.params.id;
            const query={_id: ObjectId(id)};
            const result=await orderCollection.deleteOne(query);
            res.json(result);
        })
        // app.put('/order/:id',async(req,res)=>{
        //     const id=req.params.id;
        //     const filter={_id: ObjectId(id)};
        //     console.log(filter);
        //     console.log('use id is' ,req);
        // })
    }
    finally{
        // await client.close();
    }
}

run().catch(console.dir);



app.get('/',(req,res)=>{
    res.send("The server is ruuning and its also loading");
})

app.listen(port ,()=>{
    console.log('this is from port',port);
})