const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const authRoutes = require('./Authentication/routes/authRoutes');
const pokemonRoutes = require("./routes/pokemon");
const userRoutes = require("./routes/users");
const verifyToken = require('./Authentication/middleware/verifyToken');

const app = express();


const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:5173")
    .split(",").map(origin => origin.trim());

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());


const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    skipSuccessfulRequests: true,
    keyGenerator: (req) => String(req.body?.email || "").toLowerCase(),
    message: { message: "Too many login attempts. Try again in 15 minutes." },
});


app.use("/api/auth/login", loginLimiter);


app.get("/", (req, res) => {
    res.send("API is running");
});


app.use("/api/pokemon", pokemonRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);


mongoose.connect(process.env.MONGO_URI, { dbName: "lavenderroute" })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});