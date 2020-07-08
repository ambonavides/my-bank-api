import express from "express";

import { accountRouter } from "./routes/accountRouter.js";
import mongoose from "mongoose";

(async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://admin:admin@bootcamp.qyj2l.mongodb.net/grades?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
  } catch (error) {
    console.log("Erro ao conectar no MongoDB");
  }
})();

const app = express();

app.use(express.json());
app.use(accountRouter);

app.listen(3000, () => console.log("API Iniciada"));
