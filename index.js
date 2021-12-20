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
  res.send("Hello world! <a href='/foods'>Foods Data</a>");
});

const uri = `mongodb+srv://restaurant:${process.env.DB_PASS}@cluster0.tfkl8.mongodb.net/foodsStore?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const foodsCollection = client.db("foodsStore").collection("foods");
  const ordersCollection = client.db("foodsStore").collection("orders");

  //GET
  app.get("/foods", (req, res) => {
    foodsCollection.find({}).toArray((err, result) => {
      if (err) {
        res.status(500).send({ message: err });
      } else {
        res.send(result);
      }
    });
  });

  app.get("/foods/:key", (req, res) => {
    foodsCollection.find({ key: req.params.key }).toArray((err, result) => {
      if (err) {
        res.status(500).send({ message: err });
      } else {
        res.send(result[0]);
      }
    });
  });

  //POST
  app.post("/addFood", (req, res) => {
    const foods = req.body;
    foodsCollection.insertOne(foods, (err, result) => {
      if (err) {
        res.status(500).send({ message: err });
      } else {
        res.send(result.insertedCount);
      }
    });
  });

  app.post("/getFoodsByKey", (req, res) => {
    const keys = req.body;

    foodsCollection.find({ key: { $in: keys } }).toArray((err, result) => {
      if (err) {
        res.status(500).send({ message: err });
      } else {
        res.send(result);
      }
    });
  });

  app.post("/placeOrder", (req, res) => {
    const orderDetails = req.body;
    orderDetails.orderTime = new Date();

    ordersCollection.insertOne(orderDetails, (err, result) => {
      if (err) {
        res.status(500).send({ message: err });
      } else {
        res.send(result.ops[0]);
      }
    });
  });

  console.log(err);
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Running on port ${port}`));
