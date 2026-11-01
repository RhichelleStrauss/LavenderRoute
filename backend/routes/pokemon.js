const express = require("express");
const router = express.Router();
const Pokemon = require("../models/pokemon");
const verifyToken = require('../Authentication/middleware/verifyToken');
const { streakLimit } = require('../config/streaks');
const requireRole = require('../Authentication/middleware/authRoles');

//things a seller is allowed to set, cant set staus or like admin notes
const pokemonEditable = ['name', 'shiny', 'description', 'height', 'weight', 'price', 'level', 'gender', 'type', 'imagePokemon'];

router.post("/", verifyToken, async (req, res) => {
  try {
    if (req.user.isDeniedFromPosting) {
      return res.status(403).json({ message: "You've been blocked from posting after too many denied listings. Contact an admin." });
    }

    //can edit same fields
    const pokemonData = {};
    pokemonEditable.forEach(field => {
      if (req.body[field] !== undefined) pokemonData[field] = req.body[field];
    });
    pokemonData.sellerId = req.user._id;
    //if approved 4 times it skips pending
    pokemonData.status = req.user.approvalStreak >= streakLimit ? 'approved' : 'pending';

    const saved = await Pokemon.create(pokemonData);
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//doesnt show admin feedback if lvie
router.get("/", async (req, res) => {
  try {
    const pokemon = await Pokemon.find({ status: 'approved' })
      .select('-adminNotes')
      .populate("sellerId", "firstName");
    res.status(200).json(pokemon);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
});

//logged iun persons stuff like live pending or denied
router.get("/mine", verifyToken, async (req, res) => {
  try {
    const pokemon = await Pokemon.find({ sellerId: req.user._id })
      .populate("sellerId", "firstName");
    res.status(200).json(pokemon);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
});

//admin dahs, all listings and status they have
router.get("/all", verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const pokemon = await Pokemon.find()
      .populate("sellerId", "firstName");
    res.status(200).json(pokemon);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const pokemon = await Pokemon.findById(req.params.id)
      .select('-adminNotes')
      .populate("sellerId", "firstName");
    if (!pokemon) {
      return res.status(404).json({ message: "pokemon not found" });
    }

    res.status(200).json(pokemon);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
});

router.put("/:id", verifyToken, async (req, res) => {
  try {
    const pokemon = await Pokemon.findById(req.params.id);
    if (!pokemon) {
      return res.status(404).json({ message: "Pokemon not found" });
    }

    //seller who posted pokemon or admin can edit listing
    const isOwner = String(pokemon.sellerId) === String(req.user._id);
    if (!isOwner && !req.user.roles.includes('admin')) {
      return res.status(403).json({ message: "You can only edit your own listings." });
    }

    const updates = {};
    pokemonEditable.forEach(field => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    //instead of never fixing post after denial, user can fix and it goes back to admin
    if (pokemon.status === 'rejected') {
      updates.status = 'pending';
    }

    const updatedPokemon = await Pokemon.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    res.status(200).json(updatedPokemon);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/:id/comments", async (req, res) => { 
  
  try {

    const pokemon = await Pokemon.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          comments: req.body,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!pokemon) {
      return res.status(404).json({
        message: "Pokemon not found",
      });
    }

    res.status(200).json(pokemon);

  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

//buying marks the listing sold instead of deleting it
router.post("/:id/purchase", verifyToken, async (req, res) => {
  try {
    const sold = await Pokemon.findOneAndUpdate(
      { _id: req.params.id, status: 'approved', sellerId: { $ne: req.user._id } },
      { status: 'sold', buyerId: req.user._id, soldAt: new Date() },
      { new: true }
    );

    if (!sold) {
      return res.status(409).json({ message: "This Pokémon is no longer available." });
    }

    res.status(200).json(sold);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const pokemon = await Pokemon.findById(req.params.id);
    if (!pokemon) {
      return res.status(404).json({ message: "Pokemon not found" });
    }

    //only the seller or an admin can remove a listing
    //delete from db
    const isOwner = String(pokemon.sellerId) === String(req.user._id);
    if (!isOwner && !req.user.roles.includes('admin')) {
      return res.status(403).json({ message: "You can only delete your own listings." });
    }

    await pokemon.deleteOne();
    res.status(200).json({ message: "Pokemon deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


module.exports = router;
