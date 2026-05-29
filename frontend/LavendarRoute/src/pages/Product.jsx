import "../css/ProductPage.css";
import "bootstrap/dist/css/bootstrap.min.css";

import LiquidEther from "../components/LiquidEther.jsx";
import StarRating from "../components/StarRating.jsx";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import TextField from "@mui/material/TextField";
import Modal from "react-bootstrap/Modal";

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const displayModal = () => {
  setShow(true);
};

function Product({_setCartContent}) {
  const navigate = useNavigate();

  const { id } = useParams(); //id of Pokemon to display.
  const [data, setData] = useState(null); //data fetched from server.
  const [loading, setLoading] = useState(true); //variable controls when to display the finished loaded page.
  const [comment, setComment] = useState(null); //saves the current typed comment.

  const [show, setShow] = useState(false);
  const [added, setAdded] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const formatter = new Intl.NumberFormat("en-US", {
    //formats the price into an accounting format.
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const CartUpdate = () =>{
    handleShow();
    setAdded(true);
    _setCartContent(prevItems => [...prevItems, {data}]);
  }

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

        setData(pokemons);
      } catch (error) {
        console.error(error.message);
      }

      setLoading(false); //let the page know it has completed in fetching the Pokemon's data.
    }

    getData();
  }, [id]);

  const PostComment = async () => {
    //Posts a new comment to teh server.
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
              userName: "PokeCatcher69",
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

  if (loading) {
    return <h1>Loading...</h1>;
  } else {
    console.log(data.comments);
    return (
      <>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Pokémon added to cart</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="d-flex flex-row">
              <div>
                <img id="modal-image" src={data?.imagePokemon}></img>
              </div>
              <div>
                <h1 id="modal-item-name">{data?.name}</h1>
                <p>Level: {data?.level}</p>
                <p>Shiny: {String(data?.shiny)}</p>
              </div>
            </div>

            <Button onClick={() => navigate('/cart')}>View Cart</Button>
          </Modal.Body>
        </Modal>

        <Container id="product-content" className="text-white pt-5">
          <Row>
            <Col id="poke-card" className="col-5 d-grid row-gap-2">
              <Row className="d-flex justify-content-center">
                <img className="pokemon-image" src={data?.imagePokemon}></img>
              </Row>
            </Col>

            <Col className="d-grid row-gap-3">
              <Row id="pokemon-details" className="text-left">
                <Col className="d-grid row-gap-2">
                  <Row className="text-green">
                    <Col>
                      <h3>{data?.name}</h3>
                    </Col>
                    <Col className="d-flex justify-content-end">
                      <StarRating></StarRating>
                    </Col>
                  </Row>
                  <Row>
                    <p>Sold by: PokeCatcher69</p>
                  </Row>
                  <Row>
                    <p>{data?.description}</p>
                  </Row>
                </Col>
              </Row>

              <Row id="pokemon-info" className="text-left">
                <Col className="d-grid row-gap-2">
                  <Row>
                    <h4>
                      <span className="text-purple">Shiny: </span>
                      {String(data?.shiny)}
                    </h4>
                  </Row>
                  <Row>
                    <h4>
                      <span className="text-purple">Level: </span>
                      {data?.level}
                    </h4>
                  </Row>
                  <Row>
                    <h4>
                      <span className="text-purple">Gender: </span>
                      {data?.gender}
                    </h4>
                  </Row>
                </Col>
                <Col className="d-grid row-gap-2">
                  <Row>
                    <h4>
                      <span className="text-purple">Weight: </span>
                      {data?.weight}kg
                    </h4>
                  </Row>
                  <Row>
                    <h4>
                      <span className="text-purple">Height: </span>
                      {data?.height}cm
                    </h4>
                  </Row>
                  <Row>
                    <h4 className="text-purple d-flex flex-row">
                      <span className="me-1">Type(s):</span>
                      <span className="text-white">
                        {data?.type.map((type, index) => (
                          <span key={index}>
                            {type}
                            {index < data.type.length - 1 ? " | " : ""}
                          </span>
                        ))}
                      </span>
                    </h4>
                  </Row>
                </Col>
              </Row>

              <Row className="d-flex flex-row justify-content-between">
                <Col className="col-5">
                  <Row id="pokemon-price">
                    <Col
                      id="price-tag"
                      className="col-3 d-flex flex-row justify-content-center align-items-center"
                    >
                      <h2>₽</h2>
                    </Col>
                    <Col
                      id="price"
                      className="d-flex flex-row justify-content-center align-items-center"
                    >
                      <h2 id="price-num">{formatter.format(data?.price)}</h2>
                    </Col>
                  </Row>
                </Col>
                <Col className="col-4 p-0">
                  {added ? (
                    <Button
                      variant="primary"
                      id="cart-btn-disabled"
                      disabled 
                    >
                      Added!
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      id="cart-btn"
                      onClick={CartUpdate}
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
              <Row className="text-green">
                <h2>Reviews</h2>
              </Row>
              <Row className="mt-3">
                <Col
                  id="create-comment-section"
                  className="d-flex flex-row p-3 align-items-center"
                >
                  <TextField
                    id="outlined-multiline-static"
                    multiline
                    rows={3}
                    placeholder="Leave a review"
                    className="col-11"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />

                  <Button
                    id="comment-btn"
                    className="m-2 p-2"
                    onClick={PostComment}
                  >
                    Post
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>

          <Row>
            <Col>
              {data?.comments.length > 0 ? (
                data?.comments.toReversed().map((comm) => (
                  <Row key={comm._id} className="comment-container">
                    <p className="comment-username">{comm.userName}</p>
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
