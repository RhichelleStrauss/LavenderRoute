import "../css/ProductPage.css";
import "bootstrap/dist/css/bootstrap.min.css";
import heartIcon from "../assets/icons/HeartNotFilledIcon.png";
import heartIconFilled from "../assets/icons/HeartIcon.png";
import BinIcon from '../assets/icons/BinIcon.png';
import CrossIcon from '../assets/icons/CrossIcon.png';
import PencilIcon from '../assets/icons/PencilIcon.png';
import LiquidEther from "../components/LiquidEther.jsx";
import Navbar from "../components/navbar.jsx";
import CartAddModal from "../components/CartAddModal.jsx";
import PokemonAddForm from '../components/PokemonAddForm.jsx';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import TextField from "@mui/material/TextField";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import toast from 'react-hot-toast';

function Product() {
  const navigate = useNavigate();

  
  let token = null;
  try {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      token = JSON.parse(atob(storedToken.split(".")[1]));
    }
  } catch (e) {
    console.error("Error parsing token", e);
  }

  const { id } = useParams(); //id of Pokemon to display.
  const [pokemon, setPokemon] = useState(null); //data fetched from server.
  const [loading, setLoading] = useState(true); //variable controls when to display the finished loaded page.
  const [comment, setComment] = useState(null); //saves the current typed comment.
const [showModal, setShowModal] = useState(false);
  const [added, setAdded] = useState(false);
  const [addedWish, setAddedWish] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  const userRoles = JSON.parse(localStorage.getItem('userRoles') || '[]');
  const canEdit = userRoles.includes('admin') || userRoles.includes('seller') || userRoles.includes('hybrid');

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
    if (!token) return;

    if (!addedWish) {
      let wishRaw = localStorage.getItem("wishlist");

      if (!wishRaw || wishRaw === "undefined") {
        wishRaw = JSON.stringify(token.wishlist || []);
        localStorage.setItem("wishlist", wishRaw);
      }
      let wishArray = JSON.parse(wishRaw); 
      let pokemonMatch = wishArray.some((p) => p._id === _pokemonId);
      if (pokemonMatch) setAddedWish(true);
    }
  };
    

  //Fetched the selected Pokemon's details.
  useEffect(() => {
    async function getData() {

      if (!id || id === 'undefined') {
        setLoading(false);
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

        setPokemon(pokemons);
      } catch (error) {
        console.error(error.message);
      }

      setLoading(false); //let the page know it has completed in fetching the Pokemon's data.
    }

    getData();
  }, [id]);

  useEffect(() => {
    if (pokemon) {
      CheckCart(pokemon._id);
      CheckWish(pokemon._id);
    }
  }, [pokemon, added, addedWish, token]);

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
            pokemon: wishArray,
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

 const handleUpdatePokemon = async (updatedData) => {
    try {
      const response = await fetch(`http://localhost:5000/api/pokemon/${updatedData._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        setPokemon(updatedData);
        setIsModalOpen(false);
        setSelectedPokemon(null);
        toast.success("Listing updated successfully!");
      }
    } catch (error) {
      toast.error("Update failed");
      console.error(error);
    }
  };

  const handleDeletePokemon = async (deleteId) => {
    if (!window.confirm("Are you sure you want to delete this Pokémon?")) return;
    try {
      const response = await fetch(`http://localhost:5000/api/pokemon/${deleteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      if (response.ok) {
        setIsModalOpen(false);
        toast.success("Listing deleted!");
        navigate('/catalog');
      }
    } catch (error) {
      toast.error("Delete failed");
      console.error(error);
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
           <Col id="poke-card" className="col-md-4 col-6 d-grid row-gap-2 mb-md-0 mb-3" style={{ position: 'relative' }}>
  
  {canEdit && (
    <button
      onClick={() => {
        setSelectedPokemon(pokemon);
        setIsModalOpen(true);
      }}
      style={{ position: 'absolute', top: '2px', right: '10px', zIndex: 10, background: 'rgba(20, 20, 20, 0.8)', border: '1px solid #BA8CFF', borderRadius: '14px', width: '45px', height: '45px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', transition: 'all 0.2s ease' }}
      className="edit-pencil-btn"
    >
      <img src={PencilIcon} alt="Edit" style={{ width: '22px', height: '22px', objectFit: 'contain' }} />
    </button>
  )}
                
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
                      {pokemon?.height}m
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
                    id="cart-btn"
                    onClick={() => {
                      setShowModal(true);
                      AddToCart(pokemon);
                      setAdded(true);
                    }}
                  >
                    Add to cart
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
              {pokemon?.comments?.length > 0 ? (
      pokemon.comments.toReversed().map((comm) => (
        <Row key={comm._id} className="comment-container ps-2 pe-2">
          <p className="comment-username font-vt ps-2 pe-2">{comm.userName}</p>
          <p className="comment-text">{comm.text}</p>
        </Row>
      ))
    ) : (
      <div className="font-vt text-20 text-white mt-3 ps-2">
        No reviews yet. Be the first to review this Pokémon!
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
