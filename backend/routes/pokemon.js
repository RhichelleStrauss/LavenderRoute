const express = require("express");
const router = express.Router();
const Pokemon = require("../models/pokemon");
const verifyToken = require('../Authentication/middleware/verifyToken');

router.post("/", verifyToken, async (req, res) => {
  try {

    const pokemonData = {
      ...req.body,
      sellerId: req.user.id
      };

   const newPokemon = new Pokemon(pokemonData);
    const saved = await newPokemon.save();

    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const pokemon = await Pokemon.find()
    .populate("sellerId", "firstName");
    res.status(200).json(pokemon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/pending", async (req, res) => {
  try {
    const pendingPokemon = await Pokemon.find({ status: 'pending' })
      .populate("sellerId", "firstName");
    res.status(200).json(pendingPokemon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const pokemon = await Pokemon.findById(req.params.id)
      .populate("sellerId", "firstName");
    if (!pokemon) {
      return res.status(404).json({ message: "pokemon not found" });
    }

    res.status(200).json(pokemon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedPokemon = await Pokemon.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedPokemon) {
      res.status(404).json({ message: "Pokemon not found" });
    }

    res.status(200).json(updatedPokemon);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletePokemon = await Pokemon.findByIdAndDelete(req.params.id);

    if (!deletePokemon) {
      res.status(404).json({ message: "Pokemon not found" });
    }

    res.status(200).json({ message: "Pokemon deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
