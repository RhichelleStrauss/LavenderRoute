import "../css/CartPage.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/navbar";
import LiquidEther from "../components/LiquidEther.jsx";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

const Cart = () => {
  const navigate = useNavigate();

  const [cartValue, setCartValue] = useState(0);

  let cartArray = JSON.parse(localStorage.getItem("Cart") || []);
  console.log(cartArray);

  const formatter = new Intl.NumberFormat("en-US", {
    //formats the price into an accounting format.
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const CheckAndSetCartValue = () => {
    console.log("Ran");
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
    } else {
      cartArray = cartArray.filter((pokemon) => pokemon._id !== _id);
      localStorage.setItem("Cart", JSON.stringify(cartArray));
      CheckAndSetCartValue();
    }
  };

  useEffect(() => {
    // Put the function you want to run once here
    CheckAndSetCartValue();
  }, []); // <-- Empty array ensures this only runs once on load

  return (
    <>
      <Navbar />

      <Container id="cart-content" className="p-4">
        <Row id="cart-header" className="mb-4">
          <Col className="p-0 d-flex align-items-center">
            <p className="text-36">Guest's cart</p>
          </Col>
          <Col className="p-0 d-flex flex-row justify-content-center align-items-center">
            <p className="text-center text-36">
              Total: ₽ {formatter.format(cartValue)}
            </p>
          </Col>
          <Col className="p-0 d-flex justify-content-end align-items-center">
            <Button className="col-8 p-1 text-36">Check Out</Button>
          </Col>
        </Row>
        <Row>
          <Col id="cart-body">
            {cartArray.map((pokemon, index) => (
              <>
                <Row className="cart-item d-flex justify-content-between">
                  <Col className="image-container col-2 d-flex justify-content-center align-items-center">
                    <img
                      className="cart-image"
                      src={pokemon.imagePokemon}
                      onClick={() => navigate(`/pokemon/${pokemon._id}`)}
                    ></img>
                  </Col>
                  <Col className="col-6 p-0 d-flex justify-content-center align-items-center">
                    <Row className="col-12">
                      <Col className="d-flex align-items-center">
                        <p className="pokemon-name text-center text-24">
                          {pokemon.name}
                        </p>
                      </Col>
                      <Col className="d-flex align-items-center">
                        <p className="text-center text-24">
                          Level: {pokemon.level}
                        </p>
                      </Col>
                      <Col className="d-flex align-items-center">
                        <p className="text-center text-24">
                          {pokemon.shiny ? "Shiny" : "Not Shiny"}
                        </p>
                        {/* {pokemon.shiny ? <p className="text-center text-24">Shiny</p> : <p className="text-center text-24">Not Shiny</p>} */}
                      </Col>
                    </Row>
                  </Col>
                  <Col className="col-3 p-0 d-flex flex-column justify-content-around align-items-center">
                    <Row className="col-12">
                      <p className="text-center text-32">
                        ₽{formatter.format(pokemon.price)}
                      </p>
                    </Row>
                    <Row className="col-12">
                      <Button
                        className="remove-item-btn"
                        onClick={() => UpdateCart(pokemon._id)}
                      >
                        Remove
                      </Button>
                    </Row>
                  </Col>
                </Row>
            
              </>
            ))}
          </Col>
        </Row>
      </Container>

      {/* <div id="liquid-ether">
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
        </div> */}
    </>
  );
};

export default Cart;
