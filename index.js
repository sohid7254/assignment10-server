const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express()
const port = process.env.PORT || 3000


app.use(cors())
app.use(express.json())


const uri = "mongodb+srv://DB_USER:DB_PASS@cluster0.fdcjmvl.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});


app.get('/',(req,res)=>{
    res.send('hello world')
})

async function run() {
    try {
        await client.connect();

        await client.db("admin").command({ping: 1})
        console.log("Pinged your deployment. You successfully connected to MongoDb")
    }
    finally{

    }
}

run().catch(console.dir)

app.listen(port, () => {
    console.log(`Example Listening port is running here ${port}`);
})