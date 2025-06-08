import express from "express";
import dotenv from "dotenv";
dotenv.config();
import dummy_data from "../src/data/products.js";

const port = process.env.PORT || 5000;

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.get("/api/products", (req, res) => {
  res.json(dummy_data);
});

app.get("/api/products/:id", (req, res) => {
  const product = dummy_data.products.find((p) => p.id === req.params.id);
  if (!product) {
    throw new Error("Todo not found!");
  }
  res.json(product);
});

app.listen(port, () => {
  console.log(`Server is running on port:${port}`);
});
