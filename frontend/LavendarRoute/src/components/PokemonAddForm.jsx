import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';

function PokemonAddForm() {
  const [validated, setValidated] = useState(false);

  //setting all form data using pokemon models created
  const [formData, setFormData] = useState({

    name: '',
    description: '',
    type: '',
    gender: '',
    height: '',
    weight: '',
    level: '',
    shiny: '',
    price: '',
    imagePokemon: '',

  });

  const handleChange = (event) => {

    const {name, value, type, checked } = event.target;

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });

  };



  const handleSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();

    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();

    } else {

      console.log("got le data:", formData);

    }
    setValidated(true);
  };

  return (
  <Card style={{backgroundColor: '#1a1a1a80', color: 'var(--purple)', border: '1px solid var(--yellow)' }}>
    <Card.Body className='py-4'>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>


  {/* ---------------------------------------------- */}
        {/* POKEMAN NAME */}
        {/* SHOULD MADE ADD AN AUTO CAPITALIZE OR SOMETHING? IF POSSIBE?? */}
        <Row className='mb-3'>
          <Form.Group as={Col} md='6'>

            <Form.Label style={{backgroundColor: '#1a1a1a80', color: 'var(--purple)', border: '1px solid var(--yellow)'}}>Pokemon name:</Form.Label>

            <Form.Control required name="name" type='text' placeholder='eg. gengar' value={formData.name} onChange={handleChange}></Form.Control>

          </Form.Group>
        </Row>


  {/* ---------------------------------------------- */}
        {/* DESCRIPTION ROWWWWWWWW */}
        {/* THIS FIELD NEEDS TO BE BIG*/}
         <Row className='mb-3'>
          <Form.Group as={Col} md='6'>

            <Form.Label style={{backgroundColor: '#1a1a1a80', color: 'var(--purple)', border: '1px solid var(--yellow)'}}>Description:</Form.Label>

            <Form.Control required as='textarea' name="description" type='text' rows={2} value={formData.description} onChange={handleChange}></Form.Control>

          </Form.Group>
        </Row>


    {/* ---------------------------------------------- */}
        {/*TYPE AND GENMER ROW */}
        {/* BOTH NEED TO BE DROPDOWNS */}
        <Row className='mb-3'>
          <Form.Group as={Col} md='6'>

            <Form.Label style={{backgroundColor: '#1a1a1a80', color: 'var(--purple)', border: '1px solid var(--yellow)'}}>Type:</Form.Label>

            <Form.Control required name="type" value={formData.type} onChange={handleChange}></Form.Control>

          </Form.Group>

          <Form.Group as={Col} md='6'>

            <Form.Label style={{backgroundColor: '#1a1a1a80', color: 'var(--purple)', border: '1px solid var(--yellow)'}}>Gender:</Form.Label>

            <Form.Control required name="gender" value={formData.gender} onChange={handleChange}></Form.Control>

          </Form.Group>
        </Row>

        {/* ---------------------------------------------- */}
        {/* HEIGHT AND WEIGHT ROWWWWWWWW */}
        {/* HEIGHT IN INCHES?? WEIGHT IN GRAMS OR POUNDS?? */}
         <Row className='mb-3'>
          <Form.Group as={Col} md='6'>

            <Form.Label style={{backgroundColor: '#1a1a1a80', color: 'var(--purple)', border: '1px solid var(--yellow)'}}>heigt:</Form.Label>

            <Form.Control required name="height" type='number' step='0.1' value={formData.height} onChange={handleChange}></Form.Control>

          </Form.Group>

          <Form.Group as={Col} md='6'>

            <Form.Label style={{backgroundColor: '#1a1a1a80', color: 'var(--purple)', border: '1px solid var(--yellow)'}}>Weight:</Form.Label>

            <Form.Control required name="weight" type='number' step='0.1' value={formData.weight} onChange={handleChange}></Form.Control>

          </Form.Group>
        </Row>

        {/* ---------------------------------------------- */}
        {/* LEVEL AND SSHONY OR NO SHINY*/}
        {/* TOGGLE FOR SHINY? */}
         <Row className='mb-3'>
          <Form.Group as={Col} md='6'>

            <Form.Label style={{backgroundColor: '#1a1a1a80', color: 'var(--purple)', border: '1px solid var(--yellow)'}}>Price(₽)</Form.Label>

            <Form.Control required name="type" type='number' value={formData.price} onChange={handleChange}></Form.Control>

          </Form.Group>

          <Form.Group as={Col} md='6'>

            <Form.Label style={{backgroundColor: '#1a1a1a80', color: 'var(--purple)', border: '1px solid var(--yellow)'}}>Gender:</Form.Label>

            <Form.Control required name="gender" type='text' value={formData.gender} onChange={handleChange}></Form.Control>

          </Form.Group>
        </Row>

        {/* ---------------------------------------------- */}
        {/* ROW FOR IMG URRL */}
        {/* this will change to img upload */}
         <Row className='mb-3'>
          <Form.Group as={Col} md='6'>

            <Form.Label style={{backgroundColor: '#1a1a1a80', color: 'var(--purple)', border: '1px solid var(--yellow)'}}>Image:</Form.Label>

            <Form.Control required name="type" type='url' value={formData.height} onChange={handleChange}></Form.Control>

          </Form.Group>
        </Row>


      </Form>


    </Card.Body>
</Card>
   
  
  );
}

export default PokemonAddForm;