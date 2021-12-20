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

  //POST
  app.post("/addFood", (req, res) => {
    const foods = req.body;
    foodsCollection.insertMany(foods, (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send({ message: err });
      } else {
        res.send(result.ops[0]);
      }
    });
  });

  //GET
  app.get("/foods", (req, res) => {
    foodsCollection.find({}).toArray((err, documents) => {
      if (err) {
        console.log(err);
        res.status(500).send({ message: err });
      } else {
        res.send(documents);
      }
    });
  });

  app.get("/foods/:key", (req, res) => {
    foodsCollection.find({ key: req.params.key }).toArray((err, documents) => {
      if (err) {
        console.log(err);
        res.status(500).send({ message: err });
      } else {
        res.send(documents[0]);
      }
    });
  });

  console.log(err);
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
