const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();
// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@cluster0.mtbweb5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

let MyCollection;

async function run() {
   try {
      await client.connect();
      const db = client.db("BudgetBankDB");
      MyCollection = db.collection("History");

      console.log("You successfully connected to MongoDB!");
   } catch (error) {
      console.error("Failed to connect to MongoDB", error);
   }
}

run().catch(console.log);

app.get('/', (req, res) => {
   res.send("server is running...");
});

app.get('/history', async (req, res) => {
   try {
      const history = await MyCollection.find({}).toArray();
      res.send(history);
   } catch (error) {
      console.log('find history error:::', error);
      res.status(500).send({ error: "Failed to fetch history" });
   }
});

app.post('/history', async (req, res) => {
   const historyData = req.body;
   try {
      const result = await MyCollection.insertOne(historyData);
      console.log('console show:::', result);
      res.status(201).send(result);
   } catch (error) {
      console.error("Error inserting document", error);
      res.status(500).send({ error: "Failed to insert document" });
   }
});
app.delete('/history/:id', async (req, res) => {
   const id = req.params.id;
   console.log('delete id', id);
   const query = { _id: new ObjectId(id) };  // Correctly create ObjectId
   try {
      const result = await MyCollection.deleteOne(query);
      res.send(result);
   } catch (error) {
      console.error("Error deleting document", error);
      res.status(500).send({ error: "Failed to delete document" });
   }
});


app.listen(port, () => {
   console.log(`http://localhost:${port}`);
});
