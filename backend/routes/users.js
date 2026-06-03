const express = require("express");
const router = express.Router();
const User = require("../Authentication/models/User");

router.put("/:id/wishlist", async (req, res) => { //calls to put wishlist array to the user model.
  try {

    const { pokemon } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        wishlist: pokemon,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user);

  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

router.get("/:id/wishlist", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("wishlist");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user.wishlist);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

module.exports = router;