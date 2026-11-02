import "../css/CartPage.css";
import "bootstrap/dist/css/bootstrap.min.css";

import crossIcon from "../assets/icons/CrossIcon.png";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Navbar from "../components/navbar";
import Footer from "../components/Footer.jsx";
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

  let cartArray = (JSON.parse(localStorage.getItem("cart") || "[]") || []).filter(Boolean); //drop empty entries.
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

  // each Pokémon is bought through POST /:id/purchase, which marks it sold for this user;
  // anything someone else bought first comes back 409 and is dropped from the cart
  const CheckOut = async () => {
    let currentCart = JSON.parse(localStorage.getItem("cart") || "[]").filter(Boolean);

    if (!token) {
      toast.error("Log in to check out.");
      navigate("/login");
      return;
    }

    try {
      const results = await Promise.all(
        currentCart.map(async (pokemon) => {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/pokemon/${pokemon._id}/purchase`,
            {
              method: "POST",
              headers: { Authorization: `Bearer ${token}` },
            },
          );
          return { pokemon, status: response.status };
        }),
      );

      if (results.some((r) => r.status === 401)) {
        toast.error("Your session expired. Please log in again.");
        navigate("/login");
        return;
      }

      const bought = results.filter((r) => r.status === 200);
      const unavailable = results.filter((r) => r.status === 409 || r.status === 404);
      const failed = results.filter((r) => ![200, 401, 404, 409].includes(r.status));

      unavailable.forEach((r) => toast.error(`${r.pokemon.name} is no longer available.`));
      if (failed.length > 0) {
        toast.error("Some Pokémon couldn't be bought. They're still in your cart.");
      }

      // keep only the ones that failed for another reason, so the buyer can try again
      const remaining = failed.map((r) => r.pokemon);
      localStorage.setItem("cart", JSON.stringify(remaining));
      setCartValue(remaining.reduce((total, pokemon) => total + pokemon.price, 0));

      if (bought.length > 0) {
        handleShow();
      }
    } catch (error) {
      console.error("Error in checkout:", error);
      toast.error("Checkout failed. Please try again.");
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
                    className="col-8 font-vt"
                    onClick={() => navigate("/login")}
                  >
                    Log in
                  </Button>
                ) : (
                  <Button
                    id="check-out-btn"
                    className="col-8 font-vt"
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
                className="font-vt"
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

      <div className="page-footer">
        <Footer glitch />
      </div>

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
