
import { useNavigate } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const CartAddModal = ({show, handleClose, _data }) => {

  const navigate = useNavigate();

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Pokémon added to cart</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="d-flex flex-row">
          <div>
            <img id="modal-image" src={_data?.imagePokemon} alt={_data?.name} />
          </div>

          <div>
            <h1 id="modal-item-name">{_data?.name}</h1>
            <p>Level: {_data?.level}</p>
            <p>Shiny: {String(_data?.shiny)}</p>
          </div>
        </div>

        <Button onClick={() => navigate("/cart")}>View Cart</Button>
      </Modal.Body>
    </Modal>
  );
};

export default CartAddModal;
