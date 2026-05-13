const express = require("express");
const router = express.Router();
const Pokemon = require("../models/pokemon");

router.post("/", async (req, res) => {
  try {
    const newPokemon = new Pokemon(req.body);
    const saved = await newPokemon.save();

    res.status(200).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const pokemon = await Pokemon.find();

    res.status(200).json(pokemon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const pokemon = await Pokemon.findById(req.params.id);

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
    const updatePokemon = await Pokemon.findByIdAndUpdate(
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

    res.status(200).json(updatePokemon);
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
