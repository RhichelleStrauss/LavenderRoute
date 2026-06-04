import "../css/CartPage.css";
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
import Modal from "react-bootstrap/Modal";

const Cart = () => {
  const navigate = useNavigate();

  const [cartValue, setCartValue] = useState(0);
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    navigate("/");
  };

  const handleShow = () => setShow(true);

  let cartArray = JSON.parse(localStorage.getItem("cart") || "[]");
  let token = localStorage.getItem("token");
  let user = token ? JSON.parse(atob(token.split(".")[1])) : { firstName: "Guest" };

  console.log(user);

  const formatter = new Intl.NumberFormat("en-US", {
    //formats the price into an accounting format.
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const CheckAndSetCartValue = () => {
    if (!cartArray) {
      setCartValue(0);
    } else {
      let totalValue = cartArray.reduce(
        (total, pokemon) => total + pokemon.price,
        0,
      );
      setCartValue(totalValue);
    }
  };

  const UpdateCart = (_id) => {
    if (!_id) {
      console.log("Error: no Id");
    } else if (_id === "ALL") {
      localStorage.setItem("cart", JSON.stringify([]));
      setCartValue(0);
    } else {
      cartArray = cartArray.filter((pokemon) => pokemon._id !== _id);
      localStorage.setItem("cart", JSON.stringify(cartArray));
      CheckAndSetCartValue();
    }
  };

  const CheckOut = async () => {
    let currentCart = JSON.parse(localStorage.getItem("cart") || "[]");

    try {
      await Promise.all(
        currentCart.map(async (pokemon) => {
          const response = await fetch(
            `http://localhost:5000/api/pokemon/${pokemon._id}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
            },
          );

          const data = await response.json();
          console.log(data);
        }),
      );

      localStorage.setItem("cart", JSON.stringify([]));
      setCartValue(0);
      handleShow();

      console.log("All Pokémon deleted!");
    } catch (error) {
      console.error("Error in checkout:", error);
    }
  };

  useEffect(() => {
    CheckAndSetCartValue();
  }, []);

  return (
    <>
      <Navbar />

      <Modal id="cart-modal" show={show} onHide={handleClose}>
        <Modal.Header closeButton data-bs-theme="dark"></Modal.Header>
        <Modal.Body>
          <p className="mb-3 font-vt text-36">Your Pokémon are on their way!</p>
          <Button
            id="cart-modal-btn"
            className="font-vt"
            variant="primary"
            onClick={handleClose}
          >
            Home
          </Button>
        </Modal.Body>
      </Modal>

      {cartArray.length > 0 ? (
        <Container className="p-4">
          <div id="cart-content">
            <Row id="cart-header" className="mb-4">
              <Col className="p-0 d-flex align-items-center">
                <p className="font-vt text-42">{user.firstName}'s cart</p>
              </Col>
              <Col className="p-0 d-flex flex-row justify-content-center align-items-center">
                <p className="font-vt text-center text-42">
                  Total: ₽ {formatter.format(cartValue)}
                </p>
              </Col>
              <Col className="p-0 d-flex justify-content-end align-items-center">
                {!token ? (
                  <Button
                    id="check-out-btn"
                    className="col-8 p-1 font-vt text-42"
                    onClick={() => navigate("/login")}
                  >
                    Log in
                  </Button>
                ) : (
                  <Button
                    id="check-out-btn"
                    className="col-8 p-1 font-vt text-42"
                    onClick={CheckOut}
                  >
                    Checkout
                  </Button>
                )}
              </Col>
            </Row>
            <Row>
              <Col
                id="cart-body"
                className="d-flex flex-column justify-content-center align-items-center"
              >
                {cartArray.map((pokemon, index) => (
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
                          onClick={() => UpdateCart(pokemon._id)}
                        >
                          <img src={crossIcon} className="cross-icon p-0"></img>
                        </Row>
                      </Col>
                    </Row>
                  </>
                ))}
              </Col>
            </Row>
            <Row className="mt-5 col-md-2 col-3">
              <Button
                id="empty-cart-btn"
                className="p-2 font-vt text-24"
                onClick={() => UpdateCart("ALL")}
              >
                Empty cart
              </Button>
            </Row>
          </div>
        </Container>
      ) : (
        <Container>
          <Row className="text-center">
            <h1 id="cart-empty" className="font-vt">
              No Pokémon yet in these tall grasses...
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

export default Cart;
