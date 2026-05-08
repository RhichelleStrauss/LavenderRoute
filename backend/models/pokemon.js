const mongoose = require("mongoose");

const PokemonSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        breed: { type: String, required: true, trim: true},
        age: { type: Number, required: true, min: 0 },
        colour: { type: String, default: 'Unkown', trim: true},
        vaccinated: { type: Boolean, default: false },
    },
    {timestamps : true}
);

const PokemonSchema = mongoose.model("Pokemon", PokemonSchema);
module.exports = Pokemon;