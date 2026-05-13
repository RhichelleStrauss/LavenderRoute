//base ui imports------
'use client';
import * as React from 'react';
import { ChevronDown, ChevronsUpDown, Check, Plus, Minus } from 'lucide-react';
import { Button } from './button';
import { CheckboxGroup } from './checkbox-group';
import { Form } from './form';
import { RadioGroup } from './radio-group';
import { ToastProvider, useToastManager } from './toast';
import * as Autocomplete from './autocomplete';
import * as Checkbox from './checkbox';
import * as Combobox from './combobox';
import * as Field from './field';
import * as Fieldset from './fieldset';
import * as NumberField from './number-field';
import * as Radio from './radio';
import * as Select from './select';
import * as Slider from './slider';
import * as Switch from './switch';
//-------

import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';

const API = "http://localhost:5000/api/pokemon";

const pokemonTypes = [
    'Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice', 'Fighting', 'Poison', 'Ground', 'Flying',
    'Psychic', 'Bug', 'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel', 'Fairy'
]; 

const emptyForm = {
    name: "", description: "", type: "", gender: "", height: "", weight: "", level: "",
    shiny: "", price: "", imagePokemon: ""
};

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







// 'use client';
// import * as React from 'react';
// import { ChevronDown, ChevronsUpDown, Check, Plus, Minus } from 'lucide-react';
// import { Button } from './button';
// import { CheckboxGroup } from './checkbox-group';
// import { Form } from './form';
// import { RadioGroup } from './radio-group';
// import { ToastProvider, useToastManager } from './toast';
// import * as Autocomplete from './autocomplete';
// import * as Checkbox from './checkbox';
// import * as Combobox from './combobox';
// import * as Field from './field';
// import * as Fieldset from './fieldset';
// import * as NumberField from './number-field';
// import * as Radio from './radio';
// import * as Select from './select';
// import * as Slider from './slider';
// import * as Switch from './switch';

// function ExampleForm() {
//   const toastManager = useToastManager();
//   return (
//     <Form
//       aria-label="Launch new cloud server"
//       onFormSubmit={(formValues) => {
//         toastManager.add({
//           title: 'Form submitted',
//           description: 'The form contains these values:',
//           data: formValues,
//         });
//       }}
//     >
//       <Field.Root name="serverName">
//         <Field.Label>Server name</Field.Label>
//         <Field.Control
//           defaultValue=""
//           placeholder="e.g. api-server-01"
//           required
//           minLength={3}
//           pattern=".*[A-Za-z].*"
//         />
//         <Field.Description>Must be 3 or more characters long</Field.Description>
//         <Field.Error />
//       </Field.Root>

//       <Field.Root name="region">
//         <Combobox.Root items={REGIONS} required>
//           <div className="relative flex flex-col gap-1 text-sm leading-5 text-gray-900">
//             <Field.Label>Region</Field.Label>
//             <Combobox.Input placeholder="e.g. eu-central-1" />
//             <div className="absolute right-2 bottom-0 flex h-10 items-center justify-center text-gray-600">
//               <Combobox.Clear />
//               <Combobox.Trigger>
//                 <ChevronDown className="size-4" />
//               </Combobox.Trigger>
//             </div>
//           </div>
//           <Combobox.Portal>
//             <Combobox.Positioner>
//               <Combobox.Popup>
//                 <Combobox.Empty>No matches</Combobox.Empty>
//                 <Combobox.List>
//                   {(region: string) => {
//                     return (
//                       <Combobox.Item key={region} value={region}>
//                         <Combobox.ItemIndicator>
//                           <Check className="size-4" />
//                         </Combobox.ItemIndicator>
//                         <span className="col-start-2">{region}</span>
//                       </Combobox.Item>
//                     );
//                   }}
//                 </Combobox.List>
//               </Combobox.Popup>
//             </Combobox.Positioner>
//           </Combobox.Portal>
//         </Combobox.Root>
//         <Field.Error />
//       </Field.Root>

//       <Field.Root name="containerImage">
//         <Autocomplete.Root
//           items={IMAGES}
//           mode="both"
//           itemToStringValue={(itemValue: Image) => itemValue.url}
//           required
//         >
//           <Field.Label>Container image</Field.Label>
//           <Autocomplete.Input placeholder="e.g. docker.io/library/node:latest" />
//           <Field.Description>Enter a registry URL with optional tags</Field.Description>
//           <Autocomplete.Portal>
//             <Autocomplete.Positioner>
//               <Autocomplete.Popup>
//                 <Autocomplete.List>
//                   {(image: Image) => {
//                     return (
//                       <Autocomplete.Item key={image.url} value={image}>
//                         <span className="text-base leading-6">{image.name}</span>
//                         <span className="font-mono whitespace-nowrap text-xs leading-4 opacity-80">
//                           {image.url}
//                         </span>
//                       </Autocomplete.Item>
//                     );
//                   }}
//                 </Autocomplete.List>
//               </Autocomplete.Popup>
//             </Autocomplete.Positioner>
//           </Autocomplete.Portal>
//         </Autocomplete.Root>
//         <Field.Error />
//       </Field.Root>

//       <Field.Root name="serverType">
//         <Select.Root items={SERVER_TYPES} required>
//           <div className="flex flex-col items-start gap-1">
//             <Select.Label>Server type</Select.Label>
//             <Select.Trigger className="w-48">
//               <Select.Value />
//               <Select.Icon>
//                 <ChevronsUpDown className="size-4" />
//               </Select.Icon>
//             </Select.Trigger>
//           </div>
//           <Select.Portal>
//             <Select.Positioner>
//               <Select.Popup>
//                 <Select.ScrollUpArrow />
//                 <Select.List>
//                   {SERVER_TYPES.map(({ label, value }) => {
//                     return (
//                       <Select.Item key={value} value={value}>
//                         <Select.ItemIndicator>
//                           <Check className="size-4" />
//                         </Select.ItemIndicator>
//                         <Select.ItemText>{label}</Select.ItemText>
//                       </Select.Item>
//                     );
//                   })}
//                 </Select.List>
//                 <Select.ScrollDownArrow />
//               </Select.Popup>
//             </Select.Positioner>
//           </Select.Portal>
//         </Select.Root>
//         <Field.Error />
//       </Field.Root>

//       <Field.Root name="numOfInstances">
//         <NumberField.Root defaultValue={undefined} min={1} max={64} required>
//           <Field.Label>Number of instances</Field.Label>
//           <NumberField.Group>
//             <NumberField.Decrement>
//               <Minus className="size-4" />
//             </NumberField.Decrement>
//             <NumberField.Input className="!w-16" />
//             <NumberField.Increment>
//               <Plus className="size-4" />
//             </NumberField.Increment>
//           </NumberField.Group>
//         </NumberField.Root>
//         <Field.Error />
//       </Field.Root>

//       <Field.Root name="scalingThreshold">
//         <Fieldset.Root
//           render={
//             <Slider.Root
//               defaultValue={[0.2, 0.8]}
//               thumbAlignment="edge"
//               min={0}
//               max={1}
//               step={0.01}
//               format={{
//                 style: 'percent',
//                 minimumFractionDigits: 0,
//                 maximumFractionDigits: 0,
//               }}
//               className="w-98/100 gap-y-2"
//             />
//           }
//         >
//           <Fieldset.Legend>Scaling threshold</Fieldset.Legend>
//           <Slider.Value className="col-start-2 text-end" />
//           <Slider.Control>
//             <Slider.Track>
//               <Slider.Indicator />
//               <Slider.Thumb index={0} aria-label="Minimum threshold" />
//               <Slider.Thumb index={1} aria-label="Maximum threshold" />
//             </Slider.Track>
//           </Slider.Control>
//         </Fieldset.Root>
//       </Field.Root>

//       <Field.Root name="storageType">
//         <Fieldset.Root render={<RadioGroup<'ssd' | 'hdd'> className="gap-4" defaultValue="ssd" />}>
//           <Fieldset.Legend className="-mt-px">Storage type</Fieldset.Legend>
//           <Field.Item>
//             <Field.Label>
//               <Radio.Root value="ssd">
//                 <Radio.Indicator />
//               </Radio.Root>
//               SSD
//             </Field.Label>
//           </Field.Item>
//           <Field.Item>
//             <Field.Label>
//               <Radio.Root value="hdd">
//                 <Radio.Indicator />
//               </Radio.Root>
//               HDD
//             </Field.Label>
//           </Field.Item>
//         </Fieldset.Root>
//       </Field.Root>

//       <Field.Root name="restartOnFailure">
//         <Field.Label className="gap-4">
//           Restart on failure
//           <Switch.Root defaultChecked>
//             <Switch.Thumb />
//           </Switch.Root>
//         </Field.Label>
//       </Field.Root>

//       <Field.Root name="allowedNetworkProtocols">
//         <Fieldset.Root render={<CheckboxGroup defaultValue={[]} />}>
//           <Fieldset.Legend className="mb-2">Allowed network protocols</Fieldset.Legend>
//           <div className="flex gap-4">
//             {['http', 'https', 'ssh'].map((val) => {
//               return (
//                 <Field.Item key={val}>
//                   <Field.Label className="uppercase">
//                     <Checkbox.Root value={val}>
//                       <Checkbox.Indicator>
//                         <Check className="size-3" />
//                       </Checkbox.Indicator>
//                     </Checkbox.Root>
//                     {val}
//                   </Field.Label>
//                 </Field.Item>
//               );
//             })}
//           </div>
//         </Fieldset.Root>
//       </Field.Root>

//       <Button type="submit" className="mt-3">
//         Launch server
//       </Button>
//     </Form>
//   );
// }

// export default function App() {
//   return (
//     <ToastProvider>
//       <ExampleForm />
//     </ToastProvider>
//   );
// }

// function cartesian<T extends string[][]>(...arrays: T): string[][] {
//   return arrays.reduce<string[][]>(
//     (acc, curr) => acc.flatMap((a) => curr.map((b) => [...a, b])),
//     [[]],
//   );
// }

// const REGIONS = cartesian(['us', 'eu', 'ap'], ['central', 'east', 'west'], ['1', '2', '3']).map(
//   (part) => part.join('-'),
// );

// interface Image {
//   url: string;
//   name: string;
// }
// const IMAGES: Image[] = ['nginx:1.29-alpine', 'node:22-slim', 'postgres:18', 'redis:8.2.2-alpine'].map((name) => ({
//   url: `docker.io/library/${name}`,
//   name,
// }));

// const SERVER_TYPES = [
//   { label: 'Select server type', value: null },
//   ...cartesian(['t', 'm'], ['1', '2'], ['small', 'medium', 'large']).map((part) => {
//     const value = part.join('.').replace('.', '');
//     return { label: value, value };
//   }),
// ];
