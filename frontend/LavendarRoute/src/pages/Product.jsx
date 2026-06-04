import "../css/ProductPage.css";
import "bootstrap/dist/css/bootstrap.min.css";

import LiquidEther from "../components/LiquidEther.jsx";
import StarRating from "../components/StarRating.jsx";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function Product() {
  const {id} = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log(id);

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

      setLoading(false);
    }

    getData();
  },[id]);

  if (loading) {
    return <h1>Loading...</h1>;
  } else {
    return (
      <>
        <Container id="product-content" className="text-white pt-5">
          <Row>
            <Col id="poke-card" className="col-5 d-grid row-gap-2">
              {/* <Row className="d-flex justify-content-between">
                <Col className="col-6">
                  <h4>{data.gender}</h4>
                </Col>
                {data.type.map((type, index) => (
                  <Col className="col-3" key={index}>
                    <h4>{type}</h4>
                  </Col>
                ))}
              </Row> */}

              <Row className="d-flex justify-content-center">
                <img className="pokemon-image" src={data?.imagePokemon}></img>
              </Row>

              {/* <Row>
                <h3>{data.name}</h3>
              </Row>

              <Row>
                <h4>Level {data.level}</h4>
              </Row>

              <Row>
                <Col>
                  <h4>Height: {data.height}cm</h4>
                </Col>
                <Col>
                  <h4>Weight: {data.weight}kg</h4>
                </Col>
              </Row> */}
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
                  <Row className="font-vt text-20">
                     <p>Sold by: {pokemon?.sellerId.firstName || "PokéCatcher"}</p>
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

              <Row id="pokemon-price" className="col-6">
                <Col id="price-tag" className="col-3">
                  <h2>P</h2>
                </Col>
                <Col className="col-3 p-0 font-vt">
                  {added ? (
                    <Button
                    className="text-32"
                    variant="primary"
                    id="cart-btn-disabled"
                    disabled
                  >
                    Added
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
                <p>Comments</p>
              </Row>
              <Row></Row>
            </Col>
          </Row>

          <Row className="ps-2 pe-2">
            <Col>
              {pokemon?.comments?.length > 0 ? (
      pokemon.comments.toReversed().map((comm) => (
        <Row key={comm._id} className="comment-container ps-2 pe-2">
          <p className="comment-username font-vt ps-2 pe-2">{comm.userName}</p>
          <p className="comment-text">{comm.text}</p>
        </Row>
      ))
    ) : (
      <div className="font-vt text-20 text-white mt-3 ps-2">
        No comments yet. Be the first to review this Pokémon!
      </div>
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

  // // opening modal with the correct data from card/backedn
  // //opens when card is clicked - modalopeem true
  // const handleEditClick = (pokemon) => {
  //   setSelectedPokemon(pokemon);
  //   setIsModalOpen(true);
  // };
  // // ᓚᘏᗢ

  // //put request handling ᓚᘏᗢ
  // const handleUpdatePokemon = async (updatedData) => {
  //   try {
  //     const response = await fetch(
  //       `http://localhost:5000/api/pokemon/${updatedData._id}`,
  //       {
  //         method: "PUT",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify(updatedData),
  //       },
  //     );

  //     if (response.ok) {
  //       setTeamPokemon((prev) =>
  //         prev.map((p) => (p._id === updatedData._id ? updatedData : p)),
  //       );
  //       setIsModalOpen(false);
  //       setSelectedPokemon(null);
  //     }
  //   } catch (error) {
  //     console.error("np updatey:", error);
  //   }
  // };
  // //put - updates
  // //map looks at data edited, looks through list - if matching what was uodated UI gets upated
  // //ᓚᘏᗢ

  // //handle delte post ᓚᘏᗢ
  // const handleDeletePokemon = async (id) => {
  //   if (!window.confirm("suresies you want to delete this cutie pokeman"))
  //     return;

  //   try {
  //     const response = await fetch(`http://localhost:5000/api/pokemon/${id}`, {
  //       method: "DELETE",
  //     });

  //     if (response.ok) {
  //       setTeamPokemon((prev) => prev.filter((p) => p._id !== id));
  //       setIsModalOpen(false);
  //       setSelectedPokemon(null);
  //     }
  //   } catch (error) {
  //     console.error("no delete:", error);
  //   }
  // };
  // //filter removes deleted pokemon, make new list wihgout the poor thing