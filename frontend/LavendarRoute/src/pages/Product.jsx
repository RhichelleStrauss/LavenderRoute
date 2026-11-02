import "../css/ProductPage.css";
import "../css/reflectiveCard.css"; // card tag colours + shine keyframes
import "bootstrap/dist/css/bootstrap.min.css";
import heartIcon from "../assets/icons/HeartNotFilledIcon.png";
import heartIconFilled from "../assets/icons/HeartIcon.png";
import BinIcon from '../assets/icons/BinIcon.png';
import CrossIcon from '../assets/icons/CrossIcon.png';
import PencilIcon from '../assets/icons/PencilIcon.png';
import LiquidEther from "../components/LiquidEther.jsx";
import Navbar from "../components/navbar.jsx";
import Footer from "../components/Footer.jsx";
import CartAddModal from "../components/CartAddModal.jsx";
import MagicBento from "../components/MagicBento.jsx";
import PokemonAddForm from '../components/PokemonAddForm.jsx';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import toast from 'react-hot-toast';

const timeAgo = (objectId) => {
  if (!objectId || objectId.length < 8) return "";
  const seconds = Math.floor((Date.now() - parseInt(objectId.substring(0, 8), 16) * 1000) / 1000);
  if (seconds < 60) return "just now";
  const units = [["y", 31536000], ["mo", 2592000], ["d", 86400], ["h", 3600], ["m", 60]];
  for (const [label, size] of units) {
    if (seconds >= size) return `${Math.floor(seconds / size)}${label} ago`;
  }
  return "";
};

const BENTO_GLOW = "#7c3aed";
const Bento = ({ children, className = "", fill = false, glow = BENTO_GLOW }) => (
  <MagicBento
    items={[{ content: children }]}
    columns={1}
    glowColor={glow}
    className={`product-bento ${className}`}
    style={{ gridAutoRows: fill ? "1fr" : "auto" }}
  />
);

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
  // only the seller who listed it (or an admin) gets the edit pencil
  const listingSellerId = pokemon?.sellerId?._id ?? pokemon?.sellerId;
  const isOwner = !!token?.id && String(listingSellerId) === String(token.id);
  const canEdit = userRoles.includes('admin') || isOwner;

  const formatter = new Intl.NumberFormat("en-US", {
    //formats the price into an accounting format.
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const AddToCart = (_pokemon) => {
    if (!_pokemon) return; //don't store an empty entry if the Pokemon failed to load.
    let cartArray = JSON.parse(localStorage.getItem("cart") || "[]");
    cartArray.push(_pokemon);
    localStorage.setItem("cart", JSON.stringify(cartArray));
    console.log(localStorage.getItem("cart"));
  };

  const RemoveFromCart = (_pokemonId) => {
    let cartArray = JSON.parse(localStorage.getItem("cart") || "[]");
    cartArray = cartArray.filter((pokemon) => pokemon?._id !== _pokemonId);
    localStorage.setItem("cart", JSON.stringify(cartArray));
    setAdded(false);
    toast.success("Removed from cart");
  };

  const CheckCart = (_pokemonId) => {
    let cartArray = JSON.parse(localStorage.getItem("cart"));

    if (!cartArray) {
      localStorage.setItem("cart", JSON.stringify([]));
    }

    if (!added) {
      let cartArray = JSON.parse(localStorage.getItem("cart") || "[]");
      let pokemonMatch = cartArray.some((pokemon) => pokemon?._id == _pokemonId);
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
      let pokemonMatch = wishArray.some((p) => p?._id === _pokemonId);
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
      const url = `${import.meta.env.VITE_API_URL}/api/pokemon/${id}`;

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
         `${import.meta.env.VITE_API_URL}/api/pokemon/${id}/comments`,
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
      wishArray = wishArray.filter((pokemons) => pokemons && pokemons._id !== pokemon._id);
      localStorage.setItem("wishlist", JSON.stringify(wishArray));
      console.log(localStorage.getItem("wishlist"));
      toAdd = false;
    }

    try {
      const response = await fetch(
       `${import.meta.env.VITE_API_URL}/api/users/${token.id}/wishlist`,
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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/pokemon/${updatedData._id}`,  {
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
     const response = await fetch(`${import.meta.env.VITE_API_URL}/api/pokemon/${deleteId}`, {
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
          <div className="product-layout">

                       <Bento fill>
            <div className={`product-image-panel ${pokemon?.shiny ? "panel-shiny" : "panel-basic"}`}>
              {pokemon?.shiny && <div className="panel-foil" />}
              <div className="holo-shimmer-layer" />

              {canEdit && (
                <button
                  className="edit-pencil-btn"
                  title="Edit listing"
                  onClick={() => {
                    setSelectedPokemon(pokemon);
                    setIsModalOpen(true);
                  }}
                >
                  <img src={PencilIcon} alt="Edit" />
                </button>
              )}

              <img
                className="pokemon-image"
                src={pokemon?.imagePokemon}
                alt={pokemon?.name}
              />
            </div>
            </Bento>

            {/* details */}
            <div className="product-info">
              <Bento glow="#C4FF4D">
              <div className="product-panel">
                <div className="product-title-row">
                  <h1 className="product-name font-vt">{pokemon?.name}</h1>
                  {token && (
                    <button
                      className="wishlist-btn"
                      title={addedWish ? "Remove from wishlist" : "Add to wishlist"}
                      onClick={UpdateWishlist}
                    >
                      <img src={addedWish ? heartIconFilled : heartIcon} alt="Wishlist" />
                    </button>
                  )}
                </div>

                          <div className="pokemon-tags product-tags">
                  {pokemon?.shiny && <span className="tag tag-shiny">Shiny</span>}
                  {pokemon?.type?.map((type) => (
                    <span key={type} className={`tag type-${type.toLowerCase()}`}>
                      {type}
                    </span>
                  ))}
                </div>

                <p className="product-seller font-vt">
                  Sold by <span className="text-purple">{pokemon?.sellerId?.firstName || "PokéCatcher"}</span>
                </p>

                <p className="product-description">{pokemon?.description}</p>
              </div>
              </Bento>

              <div className="product-stats">
                <div className="stat-tile">
                  <span className="stat-label font-vt">Level</span>
                  <span className="stat-value font-vt">{pokemon?.level}</span>
                </div>
                <div className="stat-tile">
                  <span className="stat-label font-vt">Gender</span>
                  <span className="stat-value font-vt">{pokemon?.gender}</span>
                </div>
                <div className="stat-tile">
                  <span className="stat-label font-vt">Weight</span>
                  <span className="stat-value font-vt">{pokemon?.weight} kg</span>
                </div>
                <div className="stat-tile">
                  <span className="stat-label font-vt">Height</span>
                  <span className="stat-value font-vt">{pokemon?.height} m</span>
                </div>
              </div>

              <div className="product-buy">
                <div className="product-price">
                  <span className="stat-label font-vt">Price</span>
                       <div className="price-field font-vt">
                    <span className="price-symbol">₽</span>
                    <span className="price-amount">{formatter.format(pokemon?.price)}</span>
                  </div>
                </div>

                  {pokemon?.status && pokemon.status !== 'approved' ? (
                  <Button id="cart-btn" className="font-vt" disabled>
                    {pokemon.status === 'sold' ? 'Sold' : 'Unavailable'}
                  </Button>
                ) : isOwner ? (
                  <Button id="cart-btn" className="font-vt" disabled>
                    Your listing
                  </Button>
                ) : added ? (
                  <Button
                    id="cart-btn-remove"
                    className="font-vt"
                    title="Remove from cart"
                    onClick={() => RemoveFromCart(pokemon._id)}
                  >
                    {/* label swaps to "Remove" on hover */}
                    <span className="cart-label-default">In cart</span>
                    <span className="cart-label-hover">Remove</span>
                  </Button>
                ) : (
                  <Button
                    id="cart-btn"
                    className="font-vt"
                    onClick={() => {
                      setShowModal(true);
                      AddToCart(pokemon);
                      setAdded(true);
                    }}
                  >
                    Add to cart
                  </Button>
                )}
              </div>
            </div>
          </div>

          <Row className="text-left pt-5">
            <Col>
              <div className="comments-heading font-vt">
                <span className="text-green">Comments</span>
                <span className="comments-count">{pokemon?.comments?.length || 0}</span>
              </div>
              {!token ? (
                <p className="comments-login-hint font-vt">
                  <span className="text-green">{'>'}</span> Log in to leave a review.
                </p>
              ) : (
                <Bento className="comment-bento">
                <div id="create-comment-section">
                  <div className="comment-avatar comment-avatar-self font-vt">
                    {(token.firstName || "?").charAt(0).toUpperCase()}
                  </div>
                  <div className="comment-composer">
                    <textarea
                      className="comment-input"
                      rows={3}
                      maxLength={500}
                      placeholder="Leave a review..."
                      value={comment || ""}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <div className="comment-composer-footer">
                      <span className="comment-char-count font-vt">{(comment || "").length}/500</span>
                      <Button
                        id="comment-btn"
                        className="font-vt"
                        onClick={PostComment}
                        disabled={!comment?.trim()}
                      >
                        Post
                      </Button>
                    </div>
                  </div>
                </div>
                </Bento>
              )}
            </Col>
          </Row>

          <Row>
            <Col className="comments-list">
              {pokemon?.comments?.length > 0 ? (
      <MagicBento
        className="product-bento comment-bento"
        columns={1}
        gap={12}
        glowColor="#C4FF4D" // matches the green commenter avatars
        style={{ gridAutoRows: "auto" }}
        items={pokemon.comments.toReversed().map((comm) => ({
          id: comm._id,
          content: (
        <div className="comment-container">
          <div className="comment-avatar font-vt">
            {(comm.userName || "?").charAt(0).toUpperCase()}
          </div>
          <div className="comment-body">
            <div className="comment-meta">
              <span className="comment-username font-vt">{comm.userName || "Anonymous"}</span>
              <span className="comment-time font-vt">{timeAgo(comm._id)}</span>
            </div>
            <p className="comment-text">{comm.text}</p>
          </div>
        </div>
          ),
        }))}
      />
    ) : (
      <div className="comments-empty font-vt">
        No comments yet. Be the first to review this Pokémon!
      </div>
    )}
  </Col>
                      
          </Row>
        </Container>

        <div className="page-footer">
          <Footer glitch />
        </div>

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
