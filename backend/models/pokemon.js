const mongoose = require("mongoose");

const PokemonSchema = new mongoose.Schema(
    {
        name: {type: String, 
                required: true, 
                trim: true },

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
                min: 1,
                max: 100,
                default: 1},
        
        gender: {type: String,
                required: true,
                enum: ['Male', 'Female', 'Genderless'],
                default: 'Genderless' },
        
        type:{

         type: [{
                type: String,
                enum: ['Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice', 'Fighting', 'Poison', 'Ground', 'Flying',
                        'Psychic', 'Bug', 'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel', 'Fairy'],
                        }],
                required: true,
                validate: [
                        (val) => val.length > 0 && val.length <= 2,
                //pokemon can have more than 1 type, validate allows for max two to be chosen
                ],
                default: 'Normal',
                trim: true},

        imagePokemon: {type: String,
                        required: true,
                        trim: true
        },

        status: {type: String,
                enum: ['pending', 'approved', 'rejected'],
                default: 'pending'
        },

        adminNotes: {type: String,
                required: false
        },

        sellerId: { type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
        },
        
    },
    {timestamps : true}
);

const Pokemon = mongoose.model("Pokemon", PokemonSchema);
module.exports = Pokemon;
