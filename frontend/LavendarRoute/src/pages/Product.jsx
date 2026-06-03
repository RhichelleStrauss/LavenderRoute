import "../css/ProductPage.css";
import "bootstrap/dist/css/bootstrap.min.css";

import LiquidEther from "../components/LiquidEther.jsx";
import StarRating from "../components/StarRating.jsx";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Navbar from "../components/navbar.jsx"
import BinIcon from '../assets/icons/BinIcon.png';
import PokemonAddForm from '../components/PokemonAddForm.jsx'
import CrossIcon from '../assets/icons/CrossIcon.png'
import PencilIcon from '../assets/icons/PencilIcon.png'
import toast from 'react-hot-toast';

import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";


function Product() {
  const {id} = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  const userRoles = JSON.parse(localStorage.getItem('userRoles') || '[]');
  const canEdit = userRoles.includes('admin') || userRoles.includes('seller') || userRoles.includes('hybrid');


  useEffect(() => {
    async function getData() {
      if(!id){
        console.error(`Pokemon id is null`);
        return;
      }
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
        console.error("We have encountered a skibidi error")
        console.error(error.message);
      }

      setLoading(false);
    }

    getData();
  },[id]);


  // opening modal with the correct data from card/backedn
  //opens when card is clicked - modalopeem true
  const handleEditClick = (pokemon) => {
    setSelectedPokemon(pokemon);
    setIsModalOpen(true);
  };
  // ᓚᘏᗢ

  //put request handling ᓚᘏᗢ
  const handleUpdatePokemon = async (updatedData) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/pokemon/${updatedData._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
        },
      );

      if (response.ok) {
        setTeamPokemon((prev) =>
          prev.map((p) => (p._id === updatedData._id ? updatedData : p)),
        );
        setIsModalOpen(false);
        setSelectedPokemon(null);
      }
    } catch (error) {
      console.error("np updatey:", error);
    }
  };
  //put - updates
  //map looks at data edited, looks through list - if matching what was uodated UI gets upated
  //ᓚᘏᗢ

  //handle delte post ᓚᘏᗢ
  const handleDeletePokemon = async (id) => {
    
    if (!window.confirm("suresies you want to delete this cutie pokeman"))
      return;

    try {
      const response = await fetch(`http://localhost:5000/api/pokemon/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setTeamPokemon((prev) => prev.filter((p) => p._id !== id));
        setIsModalOpen(false);
        setSelectedPokemon(null);
        navigate('/catalog');
      }
    } catch (error) {
      console.error("no delete:", error);
    }
  };
  //filter removes deleted pokemon, make new list wihgout the poor thing

  if (loading) {
    return <h1>Loading...</h1>;
  } else {
    return (
      <>
        <Container id="product-content" className="text-white pt-5">
          <Row>
            <div style={{marginBottom: '10%'}}>
        <Navbar />
      </div>
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

              <Col className="d-grid row-gap-3" style={{ position: 'relative' }}>
 {canEdit && (
                <button
                  onClick={() => {
                    setSelectedPokemon(data);
                    setIsModalOpen(true);
                  }}
                  style={{
                    position: 'absolute',
                    top: '-24rem',
                    right: '20px',
                    zIndex: 10,
                    background: 'rgba(20, 20, 20, 0.8)',
                    border: '1px solid #BA8CFF',
                    borderRadius: '14px',
                    width: '45px',
                    height: '45px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                    fontSize: '20px',
                    transition: 'all 0.2s ease'
                  }}
                  className="edit-pencil-btn"
                >
                  <img 
                    src={PencilIcon} 
                    alt="Edit" 
                    style={{ width: '22px', height: '22px', objectFit: 'contain' }} 
                  />
                </button>
              )}
              </Col>

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

              <Row id="pokemon-price" className="col-6">
                <Col id="price-tag" className="col-3">
                  <h2>P</h2>
                </Col>
                <Col id="price">
                  <h2>{data?.price}</h2>
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

        <div id="liquid-ether"
          
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: -10,
        }}
      >
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

        {isModalOpen && (
          <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0, 0, 0, 0.8)", zIndex: 999, display: "flex", justifyContent: "center", alignItems: "center", backdropFilter: "blur(5px)", padding: "20px" }}>
            <div style={{ position: "relative", width: "100%", maxWidth: "800px" }}>
              <button onClick={() => setIsModalOpen(false)} style={{ position: "absolute", top: "20px", right: "20px", background: "transparent", border: "none", zIndex: 1000, cursor: "pointer" }}>
                <img src={CrossIcon} style={{ width: "30px", height: "30px" }} alt="Close" />
              </button>
              
              <PokemonAddForm 
                initialData={selectedPokemon} 
                isModal={true} 
                onSave={handleUpdatePokemon} 
                onDelete={handleDeletePokemon} 
              />
            </div>
          </div>
        )}
        
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