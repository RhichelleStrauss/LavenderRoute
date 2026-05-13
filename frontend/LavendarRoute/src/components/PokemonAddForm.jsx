//base ui imports------
import { Field, Switch, NumberField } from '@base-ui/react';
//-------
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';  

const API = "http://localhost:5000/api/pokemon";

const POKEMON_TYPE = [
    'Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice', 'Fighting', 'Poison', 'Ground', 'Flying',
    'Psychic', 'Bug', 'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel', 'Fairy'
]; 


 function PokemonAddForm({ initialData, onSave, onDelete }) {
  const navigate = useNavigate();
  const [isTypeMenuOpen, setIsTypeMenuOpen] = useState(false);
  const typeRef = useRef(null);

  const [form, setForm] = useState(initialData || {
    name: "", level: "", price: "", height: "", weight: "", 
    description: "", imagePokemon: "", type: [], gender: "Genderless", shiny: false 
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (typeRef.current && !typeRef.current.contains(event.target)) {
        setIsTypeMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.type.length === 0) return alert("Select at least 1 type!");

    if (onSave) {
      onSave(form);
    } else {
      try {
        const payload = {
          ...form,
          price: Number(form.price),
          level: Number(form.level),
          height: Number(form.height),
          weight: Number(form.weight)
        };

        const response = await fetch("http://localhost:5000/api/pokemon", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          navigate('/catalog');
        } else {
          alert("Failed to save to database");
        }
      } catch (error) {
        alert("Error connecting to server");
      }
    }
  };

 const styles = {
    card: { width: "100%", maxWidth: 700, margin: "40px auto", border: "2px solid black", backgroundColor: "#1a1a1a81", padding: "32px", boxSizing: "border-box", fontFamily: "sans-serif", color: "black" },
    field: { display: "flex", flexDirection: "column", gap: "6px" },
    label: { fontSize: "14px", fontWeight: "bold", margin: 0, textTransform: "uppercase" },
    input: { width: "100%", boxSizing: "border-box", padding: "10px 14px", border: "2px solid black", backgroundColor: "white", color: "black", fontSize: "14px", outline: "none", borderRadius: "0" },
    error: { color: "black", fontSize: "12px", margin: 0, fontWeight: "bold" },
    numberGroup: { display: "flex", alignItems: "center", width: "100%", border: "2px solid black" },
    numberBtn: { background: "#f0f0f0", color: "black", width: "40px", height: "40px", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "18px", flexShrink: 0 },
    numberInput: { flex: 1, border: "none", borderLeft: "2px solid black", borderRight: "2px solid black", textAlign: "center", padding: "10px 0", outline: "none", fontSize: "14px", borderRadius: "0", margin: 0, appearance: "textfield" },
    typeContainer: { minHeight: "44px", display: "flex", flexWrap: "wrap", gap: "6px", alignItems: "center", cursor: "pointer", border: "2px solid black", padding: "6px", backgroundColor: "white", position: "relative" },
    tag: { background: "black", color: "white", padding: "4px 8px", fontSize: "12px", display: "flex", alignItems: "center", gap: "6px", fontWeight: "bold" },
    tagBtn: { background: "transparent", border: "none", color: "white", cursor: "pointer", fontSize: "10px", padding: 0 },
    priceWrapper: { display: "flex", border: "2px solid black", overflow: "hidden", backgroundColor: "white" },
    pricePrefix: { background: "#f0f0f0", padding: "10px 16px", borderRight: "2px solid black", color: "black", display: "flex", alignItems: "center", fontWeight: "bold" },
    priceInput: { flex: 1, background: "transparent", border: "none", color: "black", padding: "10px 14px", outline: "none", fontSize: "14px" },
    submitBtn: { background: "black", border: "2px solid black", color: "white", padding: "14px 24px", fontSize: "14px", fontWeight: "bold", cursor: "pointer", textTransform: "uppercase", letterSpacing: "1px", width: "100%", marginTop: "32px" },
    deleteBtn: { background: "white", border: "2px solid black", color: "black", padding: "14px 24px", fontSize: "14px", fontWeight: "bold", cursor: "pointer", textTransform: "uppercase", letterSpacing: "1px", width: "100%", marginTop: "12px" }
  };

 return (
    <div style={styles.card}>
      <h2 style={{ margin: "0 0 24px 0", fontSize: 24, fontWeight: 800, textTransform: "uppercase", borderBottom: "2px solid black", paddingBottom: "16px" }}>
        {initialData ? "Edit Pokémon" : "Register Pokémon"}
      </h2>

      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px 20px" }}>
          
          <Field.Root style={{ ...styles.field, gridColumn: "1 / -1" }}>
            <Field.Label style={styles.label}>Pokémon name</Field.Label>
            <Field.Control required style={styles.input} value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Charizard" />
            <Field.Error style={styles.error} match="valueMissing">Please enter a name.</Field.Error>
          </Field.Root>

          <Field.Root style={{ ...styles.field, gridColumn: "1 / -1" }}>
             <Field.Label style={styles.label}>Description</Field.Label>
             <Field.Control render={<textarea />} required style={{ ...styles.input, minHeight: '80px', resize: 'vertical' }} value={form.description} onChange={e => set("description", e.target.value)} placeholder="A brief lore description..." />
             <Field.Error style={styles.error} match="valueMissing">Description is required.</Field.Error>
          </Field.Root>

          <Field.Root style={{ ...styles.field, position: "relative" }} ref={typeRef}>
            <Field.Label style={styles.label}>Type (Max 2)</Field.Label>
            <div onClick={() => setIsTypeMenuOpen(!isTypeMenuOpen)} style={styles.typeContainer}>
              {form.type.length === 0 && <span style={{color: "#777", fontSize: "14px", paddingLeft: "4px"}}>Select types...</span>}
              {form.type.map(t => (
                <span key={t} style={styles.tag}>
                  {t}
                  <button type="button" onClick={(e) => { e.stopPropagation(); set("type", form.type.filter(type => type !== t)); }} style={styles.tagBtn}>✕</button>
                </span>
              ))}
            </div>
            
            {isTypeMenuOpen && form.type.length < 2 && (
              <div style={{ position: "absolute", top: "100%", left: 0, right: 0, zIndex: 50, marginTop: "4px", background: "white", border: "2px solid black", maxHeight: "180px", overflowY: "auto", padding: "4px", boxShadow: "4px 4px 0px rgba(0,0,0,1)" }}>
                {POKEMON_TYPE.filter(t => !form.type.includes(t)).map(t => (
                  <div key={t} onClick={() => { set("type", [...form.type, t]); setIsTypeMenuOpen(false); }} style={{ padding: "8px 12px", cursor: "pointer", fontSize: "14px", color: "black", fontWeight: "500", borderBottom: "1px solid #eee" }} onMouseOver={e => e.currentTarget.style.background = "#f0f0f0"} onMouseOut={e => e.currentTarget.style.background = "transparent"}>
                    {t}
                  </div>
                ))}
              </div>
            )}
          </Field.Root>
          
          <Field.Root style={styles.field}>
            <Field.Label style={styles.label}>Gender</Field.Label>
            <Field.Control render={<select />} required style={styles.input} value={form.gender} onChange={e => set("gender", e.target.value)}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Genderless">Genderless</option>
            </Field.Control>
          </Field.Root>

          <Field.Root style={styles.field}>
            <Field.Label style={styles.label}>Level (1-100)</Field.Label>
            <NumberField.Root value={form.level === "" ? null : Number(form.level)} onValueChange={v => set("level", v ?? "")} min={1} max={100} required>
              <NumberField.Group style={styles.numberGroup}>
                <NumberField.Decrement style={styles.numberBtn}>-</NumberField.Decrement>
                <NumberField.Input style={styles.numberInput} />
                <NumberField.Increment style={styles.numberBtn}>+</NumberField.Increment>
              </NumberField.Group>
            </NumberField.Root>
            <Field.Error style={styles.error} match="valueMissing">Required.</Field.Error>
          </Field.Root>

          <Field.Root style={styles.field}>
            <Field.Label style={styles.label}>Height (m)</Field.Label>
            <NumberField.Root value={form.height === "" ? null : Number(form.height)} onValueChange={v => set("height", v ?? "")} step={0.1} min={0} required>
              <NumberField.Group style={styles.numberGroup}>
                <NumberField.Decrement style={styles.numberBtn}>-</NumberField.Decrement>
                <NumberField.Input style={styles.numberInput} />
                <NumberField.Increment style={styles.numberBtn}>+</NumberField.Increment>
              </NumberField.Group>
            </NumberField.Root>
            <Field.Error style={styles.error} match="valueMissing">Required.</Field.Error>
          </Field.Root>

          <Field.Root style={styles.field}>
            <Field.Label style={styles.label}>Weight (kg)</Field.Label>
            <NumberField.Root value={form.weight === "" ? null : Number(form.weight)} onValueChange={v => set("weight", v ?? "")} step={0.1} min={0} required>
              <NumberField.Group style={styles.numberGroup}>
                <NumberField.Decrement style={styles.numberBtn}>-</NumberField.Decrement>
                <NumberField.Input style={styles.numberInput} />
                <NumberField.Increment style={styles.numberBtn}>+</NumberField.Increment>
              </NumberField.Group>
            </NumberField.Root>
            <Field.Error style={styles.error} match="valueMissing">Required.</Field.Error>
          </Field.Root>

          <Field.Root style={{ ...styles.field, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
            <Field.Label style={{ ...styles.label, cursor: 'pointer' }}>Shiny Variant</Field.Label>
            <Switch.Root checked={form.shiny} onCheckedChange={(c) => set("shiny", c)} style={{ width: '48px', height: '26px', backgroundColor: form.shiny ? 'black' : 'white', border: '2px solid black', borderRadius: '9999px', position: 'relative', cursor: 'pointer', padding: 0 }}>
              <Switch.Thumb style={{ display: 'block', width: '18px', height: '18px', backgroundColor: form.shiny ? 'white' : 'black', borderRadius: '9999px', transition: 'transform 0.2s', transform: `translateX(${form.shiny ? '24px' : '2px'})`, marginTop: '2px' }} />
            </Switch.Root>
          </Field.Root>

          <Field.Root style={{ ...styles.field, gridColumn: "1 / -1" }}>
            <Field.Label style={styles.label}>Price</Field.Label>
            <div style={styles.priceWrapper}>
              <div style={styles.pricePrefix}>₽</div>
              <Field.Control required type="number" step="any" min="0" value={form.price} onChange={e => set("price", e.target.value)} style={styles.priceInput} placeholder="0.00" />
            </div>
            <Field.Error style={styles.error} match="valueMissing">Price is required.</Field.Error>
          </Field.Root>

          <Field.Root style={{ ...styles.field, gridColumn: "1 / -1" }}>
            <Field.Label style={styles.label}>Image URL</Field.Label>
            <Field.Control required type="url" style={styles.input} value={form.imagePokemon} onChange={e => set("imagePokemon", e.target.value)} placeholder="https://..." />
            <Field.Error style={styles.error} match="valueMissing">Image URL is required.</Field.Error>
          </Field.Root>

        </div>

        <button type="submit" style={styles.submitBtn}>
          {initialData ? "Update Pokémon" : "Save to Pokédex"}
        </button>

        {initialData && onDelete && (
          <button type="button" onClick={() => onDelete(initialData._id)} style={styles.deleteBtn}>
            Delete Pokémon
          </button>
        )}
      </form>
    </div>
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
