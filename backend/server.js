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


mongoose.connect(process.env.MONGO_URI, { dbName: "lavenderroute" })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});