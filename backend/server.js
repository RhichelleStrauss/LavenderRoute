const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require('./Authentication/routes/authRoutes');
const pokemonRoutes = require("./routes/pokemon"); 
const verifyToken = require('./Authentication/middleware/verifyToken');

const app = express();

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
    res.send("API is running");
});


app.use("/api/pokemon", pokemonRoutes);
app.use('/api/auth', authRoutes);


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.listen(5000, () => {
    console.log("Server running on port 5000");
});