const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ✅ MongoDB URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fdcjmvl.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

// ✅ Root route
app.get("/", (req, res) => {
    res.send("Hello World! Server is running...");
});

async function run() {
    try {
        await client.connect();

        const db = client.db("billmateDB");
        // const billsCollection = db.collection("bills");
        // const paymentsCollection = db.collection("payments");
        const usersCollection = db.collection("users");

        // USERS APIs
        app.post("/users", async (req, res) => {
            const newUser = req.body;
            const email = req.body.email;
            const query = { email: email };
            const existingUser = await usersCollection.findOne(query);

            if (existingUser) {
                res.send({ message: "user already exits. do not need to insert again" });
            } else {
                const result = await usersCollection.insertOne(newUser);
                res.send(result);
            }
        });

        // ✅ Get all bills (with optional category filter)
        // app.get("/bills", async (req, res) => {
        //     const category = req.query.category;
        //     const query = category ? { category } : {};
        //     const bills = await billsCollection.find(query).toArray();
        //     res.json(bills);
        // });

        // ✅ Get single bill
        // app.get("/bills/:id", async (req, res) => {
        //     const id = req.params.id;
        //     const bill = await billsCollection.findOne({ _id: new ObjectId(id) });
        //     res.json(bill);
        // });

        // ✅ Add payment
        // app.post("/payments", async (req, res) => {
        //     const payment = req.body;
        //     const result = await paymentsCollection.insertOne(payment);
        //     res.json({ message: "Payment successful", result });
        // });

        // ✅ Get payments by user email
        // app.get("/payments", async (req, res) => {
        //     const email = req.query.email;
        //     const query = email ? { email } : {};
        //     const payments = await paymentsCollection.find(query).toArray();
        //     res.json(payments);
        // });

        // ✅ Update payment
        // app.put("/payments/:id", async (req, res) => {
        //     const id = req.params.id;
        //     const updated = req.body;
        //     const result = await paymentsCollection.updateOne({ _id: new ObjectId(id) }, { $set: updated });
        //     res.json(result);
        // });

        // ✅ Delete payment
        // app.delete("/payments/:id", async (req, res) => {
        //     const id = req.params.id;
        //     const result = await paymentsCollection.deleteOne({ _id: new ObjectId(id) });
        //     res.json({ message: "Payment deleted", result });
        // });

        // ✅ Ping test
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // keep connection open for API usage
    }
}

run().catch(console.dir);

// ✅ Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
