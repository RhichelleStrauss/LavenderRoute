const mongoose = require("mongoose");

const PokemonSchema = new mongoose.Schema(
    {
        name: {type: String, 
                required: true, 
                trim: true },

        breed: {type: String, 
                required: true, 
                trim: true},

        age: {type: Number, 
                required: true, 
                min: 0 },

        colour: {type: String, 
                default: 'Unkown', 
                trim: true},

        shiny: {type: Boolean, 
                default: false },

        description: {type: String, 
                        required: true, 
                        trim: true},

        height: {type: Number, 
                required: true, 
                min: 0},

        weight: {type: Number, 
                required: true,
                min: 0},

        price: {type: Number,
                required: true,
                min: 0},

        level: {type: Number,
                required: true,
                min: 0,
                max: 100,
                default: 1},
        
        gender: {type: String,
                required: true,
                enum: ['Male', 'Female', 'Genderless'],
                default: 'Genderless' },
        
        type: {type: String,
                required: true,
                trim: true
        }

    },
    {timestamps : true}
);

const PokemonSchema = mongoose.model("Pokemon", PokemonSchema);
module.exports = Pokemon;