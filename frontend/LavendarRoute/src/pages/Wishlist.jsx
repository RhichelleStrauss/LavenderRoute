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

  let wishArray = JSON.parse(localStorage.getItem("wishlist") || "[]");
  let token = localStorage.getItem("token");
  let user = token ? JSON.parse(atob(token.split(".")[1])) : { firstName: "Guest" }

   const formatter = new Intl.NumberFormat("en-US", {
    //formats the price into an accounting format.
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const FetchWishlist = async (_userId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/users/${_userId}/wishlist`,
      );

      if (!response.ok) {
        throw new Error("No wishlist");
      }

      const data = await response.json();
      wishArray = data;
    } catch (error) {
      console.error(error);
    } finally {
      localStorage.setItem("wishlist", JSON.stringify(wishArray));
    }
  };

  const UpdateWishlist = async (_pokemonId) => {
    let wishArray = JSON.parse(localStorage.getItem("wishlist") || "[]");
    wishArray = wishArray.filter((pokemons) => pokemons._id !== _pokemonId);
    localStorage.setItem("wishlist", JSON.stringify(wishArray));

    try {
      const response = await fetch(
        `http://localhost:5000/api/users/${token.id}/wishlist`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pokemon: wishArray,
          }),
        },
      );

      const data = await response.json();
    } catch (error) {
      console.error("Error updating Pokémon:", error);
    } finally {
      window.location.reload();
    }
  };

  useEffect(() => {
    let token = localStorage.getItem("token");
    let wishArray = JSON.parse(localStorage.getItem("wishlist"));
    if (!token) {
      console.log("Not Logged in");
    } else if (!wishArray){
      token = JSON.parse(atob(localStorage.getItem("token").split(".")[1]));
      FetchWishlist(token.id);
    }
  }, []);

  return (
    <>
      <Navbar />

      {wishArray.length > 0 ? (
        <Container className="p-4">
          <div id="cart-content">
            <Row>
              <p id="wishlist-header" className="font-vt">{user.firstName}'s Wishlist</p>
            </Row>
            <Row>
              <Col
                id="cart-body"
                className="d-flex flex-column justify-content-center align-items-center"
              >
                {wishArray.map((pokemon, index) => (
                  <>
                    <Row className="cart-item col-12 d-flex justify-content-between">
                      <Col
                        className="image-container col-2 d-flex justify-content-center align-items-center"
                        onClick={() => navigate(`/pokemon/${pokemon._id}`)}
                      >
                        <img
                          className="cart-image"
                          src={pokemon.imagePokemon}
                        ></img>
                      </Col>
                      <Col
                        className="cart-info col-6 p-0 d-flex justify-content-center align-items-center"
                        onClick={() => navigate(`/pokemon/${pokemon._id}`)}
                      >
                        <Row className="col-12">
                          <Col className="d-flex justify-content-center align-items-center">
                            <p className="pokemon-name text-center font-vt text-36">
                              {pokemon.name}
                            </p>
                          </Col>
                          <Col className="d-flex justify-content-center align-items-center">
                            <p className="text-center font-vt text-36">
                              Level: {pokemon.level}
                            </p>
                          </Col>
                          <Col className="d-flex justify-content-center align-items-center">
                            <p className="text-center font-vt text-36">
                              {pokemon.shiny ? "Shiny" : "Not Shiny"}
                            </p>
                            {/* {pokemon.shiny ? <p className="text-center font-vt text-36">Shiny</p> : <p className="text-center font-vt text-36">Not Shiny</p>} */}
                          </Col>
                        </Row>
                      </Col>
                      <Col
                        className="cart-price col-2 p-0 d-flex flex-column justify-content-around align-items-center"
                        onClick={() => navigate(`/pokemon/${pokemon._id}`)}
                      >
                        <Row className="col-12">
                          <p className="text-center font-vt text-42">
                            ₽ {formatter.format(pokemon.price)}
                          </p>
                        </Row>
                      </Col>
                      <Col className="col-1">
                        <Row
                          className="mt-2 d-flex flex-column justify-content-lg-end just-content-sm-center align-items-center"
                          onClick={() => UpdateWishlist(pokemon._id)}
                        >
                          <img src={crossIcon} className="cross-icon p-0"></img>
                        </Row>
                      </Col>
                    </Row>
                  </>
                ))}
              </Col>
            </Row>
            </div>
        </Container>
      ) : (
        <Container>
          <Row className="text-center">
            <h1 id="cart-empty" className="font-vt">
              Nothing's catch your eye yet...
            </h1>
          </Row>
        </Container>
      )}

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
