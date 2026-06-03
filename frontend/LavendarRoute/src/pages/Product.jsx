import "../css/ProductPage.css";
import "bootstrap/dist/css/bootstrap.min.css";

import heartIcon from "../assets/icons/HeartNotFilledIcon.png";
import heartIconFilled from "../assets/icons/HeartIcon.png";

import LiquidEther from "../components/LiquidEther.jsx";
import StarRating from "../components/StarRating.jsx";
import Navbar from "../components/navbar.jsx";
import CartAddModal from "../components/CartAddModal.jsx";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import TextField from "@mui/material/TextField";
import Modal from "react-bootstrap/Modal";

import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

function Product() {
  const navigate = useNavigate();

  let token = localStorage.getItem("token")
    ? JSON.parse(atob(localStorage.getItem("token").split(".")[1]))
    : null;
  console.log(token);
  // let token = null;

  const { id } = useParams(); //id of Pokemon to display.
  const [pokemon, setPokemon] = useState(null); //data fetched from server.
  const [loading, setLoading] = useState(true); //variable controls when to display the finished loaded page.
  const [comment, setComment] = useState(null); //saves the current typed comment.

  const [showModal, setShowModal] = useState(false);
  const [added, setAdded] = useState(false);
  const [addedWish, setAddedWish] = useState(false);

  const formatter = new Intl.NumberFormat("en-US", {
    //formats the price into an accounting format.
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const AddToCart = (_pokemon) => {
    let cartArray = JSON.parse(localStorage.getItem("cart") || "[]");
    cartArray.push(_pokemon);
    localStorage.setItem("cart", JSON.stringify(cartArray));
    console.log(localStorage.getItem("cart"));
  };

  const CheckCart = (_pokemonId) => {
    let cartArray = JSON.parse(localStorage.getItem("cart"));

    if (!cartArray) {
      localStorage.setItem("cart", JSON.stringify([]));
    }

    if (!added) {
      let cartArray = JSON.parse(localStorage.getItem("cart") || "[]");
      let pokemonMatch = cartArray.some((pokemon) => pokemon._id == _pokemonId);
      if (pokemonMatch) setAdded(true);
    }
  };

  const CheckWish = (_pokemonId) => {
    let wishArray = JSON.parse(localStorage.getItem("wishlist"));
    console.log(wishArray);

    if (!token) {
      console.log("Not logged in");
    } else if (!wishArray) {
      console.log("ran");
      localStorage.setItem("wishlist", JSON.stringify(token.wishlist));
    }

    if (!addedWish) {
      let wishArray = JSON.parse(localStorage.getItem("wishlist") || "[]");
      console.log(wishArray);
      let pokemonMatch = wishArray.some((pokemon) => pokemon._id == _pokemonId);
      if (pokemonMatch) setAddedWish(true);
    }
  };

  //Fetched the selected Pokemon's details.
  useEffect(() => {
    async function getData() {
      const url = `http://localhost:5000/api/pokemon/${id}`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }

        const pokemons = await response.json();
        console.log(pokemons);

        setPokemon(pokemons);
      } catch (error) {
        console.error(error.message);
      }

      setLoading(false); //let the page know it has completed in fetching the Pokemon's data.
    }

    getData();
  }, [id]);

  const PostComment = async () => {
    //Posts a new comment to the server.
    if (!comment) {
      console.log("Is empty"); //Checks if a comment has been made.
    } else {
      //Posts the new comment.
      try {
        const response = await fetch(
          `http://localhost:5000/api/pokemon/${id}/comments`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              text: comment,
              userName: token.firstName,
            }),
          },
        );

        const data = await response.json();

        console.log(data);
      } catch (error) {
        console.error("Error updating Pokémon:", error);
      } finally {
        window.location.reload();
      }
    }
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

  if (loading) {
    return (
      <>
        <Navbar />

        <Container>
          <Row
            id="loading-text"
            className="d-flex flex-column justify-content-center"
          >
            <p className="font-vt text-42 text-center">
              Catching that Pokémon...
            </p>
          </Row>
        </Container>
      </>
    );
  } else {
    console.log(pokemon.comments);

    CheckCart(pokemon._id);
    CheckWish(pokemon._id);

    return (
      <>
        <Navbar />

        <CartAddModal
          show={showModal}
          handleClose={() => setShowModal(false)}
          _data={pokemon}
        />

        <Container id="product-content" className="text-white pt-5">
          <Row className="justify-content-md-start justify-content-center">
            <Col
              id="poke-card"
              className="col-md-4 col-6 d-grid row-gap-2 mb-md-0 mb-3"
            >
              <Row className="d-flex justify-content-center align-items-center">
                <img
                  className="pokemon-image"
                  src={pokemon?.imagePokemon}
                ></img>
              </Row>
            </Col>

            <Col className=" col-md-8 col-11 d-grid row-gap-3">
              <Row id="pokemon-details" className="text-left">
                <Col className="d-grid row-gap-2">
                  <Row className="text-green d-flex justify-content-between">
                    <Col className="col-4">
                      <p className="font-vt text-36">{pokemon?.name}</p>
                    </Col>
                    {/* <Col className="col-4">
                      <StarRating></StarRating>
                    </Col> */}
                    <Col className="col-4 d-flex justify-content-end">
                      {!token ? (
                        <></>
                      ) : addedWish ? (
                        <img
                          id="wishlist-icon"
                          src={heartIconFilled}
                          onClick={UpdateWishlist}
                        ></img>
                      ) : (
                        <img
                          id="wishlist-icon"
                          src={heartIcon}
                          onClick={UpdateWishlist}
                        ></img>
                      )}
                    </Col>
                  </Row>
                  <Row className="font-vt text-20">
                    <p>Sold by: PokeCatcher69</p>
                  </Row>
                  <Row>
                    <p>{pokemon?.description}</p>
                  </Row>
                </Col>
              </Row>

              <Row id="pokemon-info" className="text-left">
                <Col className="d-grid row-gap-2 text-20">
                  <Row>
                    <p>
                      <span className="text-purple">Shiny: &ensp;</span>
                      {String(pokemon?.shiny)}
                    </p>
                  </Row>
                  <Row>
                    <p>
                      <span className="text-purple">Level: &ensp;</span>
                      {pokemon?.level}
                    </p>
                  </Row>
                  <Row>
                    <p>
                      <span className="text-purple">Gender: &ensp;</span>
                      {pokemon?.gender}
                    </p>
                  </Row>
                </Col>
                <Col className="d-grid row-gap-2 text-20">
                  <Row>
                    <p>
                      <span className="text-purple">Weight: &ensp;</span>
                      {pokemon?.weight}kg
                    </p>
                  </Row>
                  <Row>
                    <p>
                      <span className="text-purple">Height: &ensp;</span>
                      {pokemon?.height}cm
                    </p>
                  </Row>
                  <Row>
                    <p className="text-purple d-flex flex-row">
                      <span className="me-1">Type(s):&ensp;</span>
                      <span className="text-white">
                        {pokemon?.type.map((type, index) => (
                          <span key={index}>
                            {type}
                            {index < pokemon.type.length - 1 ? " | " : ""}
                          </span>
                        ))}
                      </span>
                    </p>
                  </Row>
                </Col>
              </Row>

              <Row className="d-flex flex-row justify-content-between">
                <Col className="col-4">
                  <Row id="pokemon-price" className="font-vt text-42">
                    <Col
                      id="price-tag"
                      className="col-3 d-flex flex-row justify-content-center align-items-center"
                    >
                      <p>₽</p>
                    </Col>
                    <Col
                      id="price"
                      className="d-flex flex-row justify-content-center align-items-center"
                    >
                      <p id="price-num">{formatter.format(pokemon?.price)}</p>
                    </Col>
                  </Row>
                </Col>
                <Col className="col-3 p-0 font-vt">
                  {added ? (
                    <Button
                      className="text-32"
                      variant="primary"
                      id="cart-btn-disabled"
                      disabled
                    >
                      Added!
                    </Button>
                  ) : (
                    <Button
                      className="text-32"
                      variant="primary"
                      id="cart-btn"
                      onClick={() => {
                        setShowModal(true);
                        AddToCart(pokemon);
                        setAdded(true);
                      }}
                    >
                      Add to cart
                    </Button>
                  )}
                </Col>
              </Row>
            </Col>
          </Row>

          <Row className="text-left pt-5">
            <Col>
              <Row className="text-green font-vt text-36">
                <p>Reviews</p>
              </Row>
              {!token ? (
                <></>
              ) : (
                <Row className="mt-3 ps-2 pe-2">
                  <Col
                    id="create-comment-section"
                    className="d-flex flex-lg-row flex-column p-3 align-items-center"
                  >
                    <TextField
                      id="outlined-multiline-static"
                      multiline
                      rows={3}
                      placeholder="Leave a review"
                      className="col-lg-11 col-12"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />

                    <Button
                      id="comment-btn"
                      className="mt-lg-0 mt-3 mb-0 m-2 p-0 font-vt text-24"
                      onClick={PostComment}
                    >
                      Post
                    </Button>
                  </Col>
                </Row>
              )}
            </Col>
          </Row>

          <Row className="ps-2 pe-2">
            <Col>
              {pokemon?.comments.length > 0 ? (
                pokemon?.comments.toReversed().map((comm) => (
                  <Row key={comm._id} className="comment-container ps-2 pe-2">
                    <p className="comment-username font-vt ps-2 pe-2">
                      {comm.userName}
                    </p>
                    <p className="comment-text">{comm.text}</p>
                  </Row>
                ))
              ) : (
                <div></div>
              )}
            </Col>
          </Row>
        </Container>

        <div id="liquid-ether">
          <LiquidEther
            mouseForce={10}
            cursorSize={100}
            isViscous
            viscous={30}
            colors={["#C4FF4D", "#C4FF4D", "#C4FF4D"]}
            autoDemo
            autoSpeed={0.5}
            autoIntensity={2.2}
            isBounce={false}
            resolution={0.5}
          />
        </div>
      </>
    );
  }
}

export default Product;
