import "../css/ProductPage.css";
import "bootstrap/dist/css/bootstrap.min.css";

import LiquidEther from "../components/LiquidEther.jsx";
import StarRating from "../components/StarRating.jsx";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { useState, useEffect } from "react";

function Product() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getData() {
      const url = "http://localhost:5000/api/pokemon";

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }

        const pokemons = await response.json();
        console.log(pokemons);

        let num = Math.floor(Math.random() * (pokemons.length - 0 + 1)) + 0;
        let pokemon = pokemons[num];

        setData(pokemon);
      } catch (error) {
        console.error(error.message);
      }

      setLoading(false);
    }

    getData();
  }, []);

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
                <img className="pokemon-image" src={data.imagePokemon}></img>
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
                      <h3>{data.name}</h3>
                    </Col>
                    <Col className="d-flex justify-content-end">
                      <StarRating></StarRating>
                    </Col>
                  </Row>
                  <Row>
                    <p>Sold by: PokeCatcher69</p>
                  </Row>
                  <Row>
                    <p>{data.description}</p>
                  </Row>
                </Col>
              </Row>

              <Row id="pokemon-info" className="text-left">
                <Col className="d-grid row-gap-2">
                  <Row>
                    <h4>
                      <span className="text-purple">Shiny: </span>
                      {String(data.shiny)}
                    </h4>
                  </Row>
                  <Row>
                    <h4>
                      <span className="text-purple">Level: </span>
                      {data.level}
                    </h4>
                  </Row>
                  <Row>
                    <h4>
                      <span className="text-purple">Gender: </span>
                      {data.gender}
                    </h4>
                  </Row>
                </Col>
                <Col className="d-grid row-gap-2">
                  <Row>
                    <h4>
                      <span className="text-purple">Weight: </span>
                      {data.weight}kg
                    </h4>
                  </Row>
                  <Row>
                    <h4>
                      <span className="text-purple">Height: </span>
                      {data.height}cm
                    </h4>
                  </Row>
                  <Row>
                    <h4 className="text-purple d-flex flex-row">
                      <span className="me-1">Type(s):</span>
                      <span className="text-white">
                        {data.type.map((type, index) => (
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
                <Col id="price">
                  <h2>{data.price}</h2>
                </Col>
              </Row>
            </Col>
          </Row>

          <Row className="text-left pt-5">
            <Col>
              <Row className="text-green">
                <h2>Comments</h2>
              </Row>
              <Row></Row>
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
