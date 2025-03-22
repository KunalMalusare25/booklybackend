const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const AuthRouter = require("./Routes/Routers");

require("dotenv").config();
require("./Models/db");
const PORT = process.env.PORT || 8080;

//middlewware
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());
app.use("/bookly", AuthRouter);

app.get("/ping", (req, res) => {
  res.send("Pong");
});

app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
