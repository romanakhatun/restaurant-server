import express from "express";

const app = express();

app.get("/", (request, response) => {
  response.send("thank you very much");
});

app.get("/foods", (request, response) => {
  response.send("this is food page");
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
