import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongodb from "mongodb";
import dotenv from "dotenv";

const { MongoClient } = mongodb;
const app = express();
dotenv.config();

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("hello world");
});

const uri = `mongodb+srv://restaurant:${process.env.DB_PASS}@cluster0.tfkl8.mongodb.net/foodsStore?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const foodsCollection = client.db("foodsStore").collection("foods");
  console.log("database connected");

  // const food = { name: "kanana", price: 25 };
  // foodsCollection.insertOne(food, (err, res) => {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     console.log(res);
  //   }
  // });

  app.post("/addFood", (req, res) => {
    const foods = req.body;
    foodsCollection.insertMany(foods).then((result) => {
      console.log(result.insertedCount);
      res.send(result.insertedCount);
    });
  });

  app.get("/foods", (req, res) => {
    foodsCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  console.log(err);
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
