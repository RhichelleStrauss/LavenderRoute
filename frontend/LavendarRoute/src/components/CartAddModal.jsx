import { useNavigate } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const CartAddModal = ({ show, handleClose, _data }) => {
  const navigate = useNavigate();

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton data-bs-theme="dark" style={{backgroundColor: "rgba(186, 140, 255, 0.08)"}}>
        <Modal.Title className="font-vt" style={{ fontSize: "28px" }}>
          Pokémon added to cart
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{backgroundColor: "rgba(186, 140, 255, 0.08)"}}>
        <Row>
          <Col className="d-flex justify-content-center">
            <img id="modal-image" src={_data?.imagePokemon} alt={_data?.name} />
          </Col>
          <Col className="d-flex flex-column justify-content-center">
            <Row>
              <h1
                id="modal-item-name"
                className="font-vt"
                style={{ fontSize: "32px" }}
              >
                {_data?.name}
              </h1>
            </Row>
            <Row>
              <p className="font-vt" style={{ fontSize: "28px" }}>
                Level: {_data?.level}
              </p>
            </Row>
            <Row>
              <p className="font-vt" style={{ fontSize: "28px" }}>
                Shiny: {String(_data?.shiny)}
              </p>
            </Row>
          </Col>
        </Row>
        <Row className="d-flex justify-content-center mt-2"> 
          <Button style={{ fontSize: "26px" }} id="product-modal-btn" className="col-4 font-vt" onClick={() => navigate("/cart")}>
            View Cart
          </Button>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default CartAddModal;
