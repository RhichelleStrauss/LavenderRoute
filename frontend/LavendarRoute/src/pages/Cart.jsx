import "../css/CartPage.css";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const Cart = ({ _cartContent }) => {
  console.log(_cartContent);

  return (
    <>
      {_cartContent.length > 0 ? (
        <Container>
             {_cartContent.map((pokemon) => (
                <Row> 
                    <h3>{pokemon.data.name}</h3>
                    <h4>{pokemon.data.price}</h4>
                </Row>

          ))}

        </Container> 
      ) : (
        <div>
          <h1>Cart is empty...</h1>
        </div>
      )}
    </>
  );
};

export default Cart;
