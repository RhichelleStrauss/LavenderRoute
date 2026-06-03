import "../css/WishlistPage.css";
import "bootstrap/dist/css/bootstrap.min.css";

import crossIcon from "../assets/icons/CrossIcon.png";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/navbar";
import LiquidEther from "../components/LiquidEther.jsx";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

const Wishlist = () => {
  const navigate = useNavigate();

  const CheckWish = () => {
    let token = localStorage.getItem("token");
    let wishArray = JSON.parse(localStorage.getItem("wishlist"));

    if (!token) {
      console.log("Not logged in");
    } else if (!wishArray) {
      console.log("ran");
      localStorage.setItem("wishlist", JSON.stringify(token.wishlist));
    }

    console.log(JSON.parse(localStorage.getItem("wishlist")));
  };

  const UpdateWishlist = async () => {
    let wishArray = JSON.parse(localStorage.getItem("wishlist") || "[]");
    let toAdd;

    if (!addedWish) {
      wishArray.push(pokemon);
      localStorage.setItem("wishlist", JSON.stringify(wishArray));
      console.log(localStorage.getItem("wishlist"));
      toAdd = true;
    } else {
      wishArray = wishArray.filter((pokemons) => pokemons._id !== pokemon._id);
      localStorage.setItem("wishlist", JSON.stringify(wishArray));
      console.log(localStorage.getItem("wishlist"));
      toAdd = false;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/users/${token.id}/wishlist`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pokemon: pokemon,
          }),
        },
      );

      const data = await response.json();
    } catch (error) {
      console.error("Error updating Pokémon:", error);
    } finally {
      setAddedWish(toAdd);
    }
  };

  useEffect(() => {
   CheckWish();
  }, []);

  return (
    <>
      <Navbar />

      <div id="liquid-ether">
        <LiquidEther
          mouseForce={10}
          cursorSize={100}
          isViscous
          viscous={30}
          colors={["#BA8CFF", "#BA8CFF", "#BA8CFF"]}
          autoDemo
          autoSpeed={0.5}
          autoIntensity={2.2}
          isBounce={false}
          resolution={0.5}
        />
      </div>
    </>
  );
};

export default Wishlist;
