//onload initial data is passed into form
//initial data is empty, form is blank, and is storing things
//if clicking edit button, initial data contains pokemons info, and fills in the stored things


//form creates a payload-copies all text data, but transofms price, lvelem height and weight into numbers
//put is edit - form gets edited with new payload
//post, sends axis post to create listing
//it attaches auth to ensure the user can make these changes

//base ui imports
import { NumberField, Switch } from '@base-ui/react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BinIcon from '../assets/icons/BinIcon.png';
import axios from 'axios';
import toast from 'react-hot-toast';
import '../css/reflectiveCard.css'; // card tag colours for the type tags
import '../css/PokemonAddForm.css';

const API = `${import.meta.env.VITE_API_URL}/api/pokemon`;

const POKEMON_TYPE = [
    'Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice', 'Fighting', 'Poison', 'Ground', 'Flying',
    'Psychic', 'Bug', 'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel', 'Fairy'
];
//pokemon types for dropdown (max 2)

const GENDERS = ['Male', 'Female', 'Genderless'];

//braindump?
//if editing (on catalog page), the form sends the data to the catalog component via onsave
//if adding the form sends data out to api, redirects uou to catalog on sibmit
// payload is a bundle of info about a pokemon sendinf to database\
//before sending data, create a payload object that takes values on form
//certain objets convert strings into numbers
//payload is stringified into a json string, and placed into bpody of fetch to server on api https
//modal not open

//returns { field: message } for anything missing or out of range
const validate = (form) => {
  const errors = {};
  if (!form.name?.trim()) errors.name = "Please enter a name.";
  if (!form.description?.trim()) errors.description = "Description is required.";
  if (!form.type?.length) errors.type = "Pick at least 1 type.";
  if (form.level === "" || form.level < 1 || form.level > 100) errors.level = "Level must be 1–100.";
  if (form.height === "" || form.height < 0) errors.height = "Required.";
  if (form.weight === "" || form.weight < 0) errors.weight = "Required.";
  if (form.price === "" || Number(form.price) < 0) errors.price = "Price is required.";
  if (!/^https?:\/\/\S+$/i.test(form.imagePokemon || "")) errors.imagePokemon = "Enter an image link starting with http.";
  return errors;
};

//initialdata: on addpokemon page nothing, on catalog stores pokemons when clicking card
//on save on delete callbacks - form givess functipns data
 function PokemonAddForm({ initialData, onSave, onDelete, isModal = false }) {
  const navigate = useNavigate();

  const roles = JSON.parse(localStorage.getItem('userRoles') || '[]');
  const isAdmin = roles.includes('admin');
  // sellers editing a live/pending listing can only change height, weight and price;
  // a rejected listing is fully editable so they can fix what the admin flagged
  const isRestrictedEdit = initialData && !isAdmin && initialData.status !== 'rejected';

  const [form, setForm] = useState(initialData || {
    name: "", level: "", price: "", height: "", weight: "",
    description: "", imagePokemon: "", type: [], gender: "Genderless", shiny: false
  });
  const [errors, setErrors] = useState({});
  const [imageBroken, setImageBroken] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isTypeMenuOpen, setIsTypeMenuOpen] = useState(false);
  const typeRef = useRef(null);

  //clicking anywhere but menu, menu ckose
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (typeRef.current && !typeRef.current.contains(event.target)) {
        setIsTypeMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  //set key value - helper function (also clears that field's error)
  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: undefined }));
  };

  const addType = (t) => {
    const next = [...form.type, t];
    set("type", next);
    if (next.length >= 2) setIsTypeMenuOpen(false);
  };

  const removeType = (t) => set("type", form.type.filter(type => type !== t));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = validate(form);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      return toast.error("Please fix the highlighted fields.");
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        level: Number(form.level),
        height: Number(form.height),
        weight: Number(form.weight)
      };

      if (initialData) {

        await axios.put(`${API}/${initialData._id}`, payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        toast.success(initialData.status === 'rejected' ? "Fixed and sent back for review!" : "Pokémon updated successfully!");
      } else {

        await axios.post(API, payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
       toast.success("New Pokémon added to the LavenderRoute!");
      }

      if (onSave) {
        onSave(form);
        //checking if onsave exists foir editing, if onsave exists in catalog, the form givees data back to catalog page
      } else {
        navigate('/catalog');
        //if onsave wasnt passed, (on addpokemon page), it runs this block to create a new entry
      }
      } catch (err) {
      console.error("SUBMIT ERROR FULL OBJECT:", err);
      if (err.response) {
        toast.error("Backend refused the listing: " + err.response.data.message);
      } else {
        toast.error("Request failed completely. Is the server running?");
      }
    }
    setSaving(false);
  };

    const handleDelete = async () => {
    const isConfirmed = window.confirm(`Are you sure you want to delete ${form.name}? This cannot be undone.`);
    if (!isConfirmed) return;

    try {
      await axios.delete(`${API}/${initialData._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
     toast.success("Pokémon deleted permanently!");

      if (onSave) {
        onSave();
        } else {
        navigate('/catalog');
      }
    } catch (err) {
      console.error("DELETE ERROR:", err);
     toast.error("Failed to delete. It may have already been removed.");
    }
  };

  const locked = (field) => isRestrictedEdit && !['height', 'weight', 'price'].includes(field);

  const fieldClass = (field, extra = "") =>
    `paf-field ${extra} ${errors[field] ? 'has-error' : ''} ${locked(field) ? 'is-locked' : ''}`;

  const numberField = (field, label, props) => (
    <div className={fieldClass(field)}>
      <label className="paf-label">{label}</label>
      <NumberField.Root
        disabled={locked(field)}
        value={form[field] === "" ? null : Number(form[field])}
        onValueChange={v => set(field, v ?? "")}
        {...props}
      >
        <NumberField.Group className="paf-number">
          <NumberField.Decrement className="paf-number-btn">−</NumberField.Decrement>
          <NumberField.Input className="paf-number-input" />
          <NumberField.Increment className="paf-number-btn">+</NumberField.Increment>
        </NumberField.Group>
      </NumberField.Root>
      {errors[field] && <span className="paf-error">{errors[field]}</span>}
    </div>
  );

 return (
    <div className={`paf-card ${isModal ? 'paf-modal' : ''}`}>
      <h2 className="paf-title">{initialData ? "Edit Pokémon" : "List a Pokémon"}</h2>
      {isRestrictedEdit && (
        <p className="paf-note">Live listings can only change height, weight and price.</p>
      )}

      <form onSubmit={handleSubmit} noValidate>

        {/* two columns on the add page: basics left, stats + listing right */}
        <div className="paf-columns">
        <div className="paf-col">
        {/* ᓚᘏᗢ the basics */}
        <section className="paf-section">
          <h3 className="paf-section-title">The basics</h3>

          <div className={fieldClass('name')}>
            <label className="paf-label" htmlFor="paf-name">Pokémon name</label>
            <input id="paf-name" className="paf-input" disabled={locked('name')} value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Gengar" />
            {errors.name && <span className="paf-error">{errors.name}</span>}
          </div>

          <div className={fieldClass('description')}>
            <label className="paf-label" htmlFor="paf-description">
              Description <span className="paf-count">{form.description?.length || 0}</span>
            </label>
            <textarea id="paf-description" className="paf-input paf-textarea" disabled={locked('description')} value={form.description} onChange={e => set("description", e.target.value)} placeholder="Describe your Pokémon..." />
            {errors.description && <span className="paf-error">{errors.description}</span>}
          </div>

          {/* ᓚᘏᗢ type dropdown, up to 2 */}
          <div className={fieldClass('type')} ref={typeRef}>
            <label className="paf-label">Type <span className="paf-count">{form.type.length}/2</span></label>
            <div className="paf-dropdown">
              <div
                className={`paf-dropdown-trigger ${isTypeMenuOpen ? 'open' : ''}`}
                role="button"
                tabIndex={locked('type') ? -1 : 0}
                onClick={() => !locked('type') && setIsTypeMenuOpen(o => !o)}
                onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && !locked('type')) { e.preventDefault(); setIsTypeMenuOpen(o => !o); } }}
              >
                {form.type.length === 0 && <span className="paf-placeholder">Select types...</span>}
                {form.type.map(t => (
                  <span key={t} className={`tag type-${t.toLowerCase()} paf-chosen-type`}>
                    {t}
                    {!locked('type') && (
                      <button type="button" aria-label={`Remove ${t}`} onClick={(e) => { e.stopPropagation(); removeType(t); }}>✕</button>
                    )}
                  </span>
                ))}
                <span className="paf-chevron">▾</span>
              </div>

              {isTypeMenuOpen && (
                <div className="paf-dropdown-menu">
                  {form.type.length >= 2 ? (
                    <p className="paf-hint paf-menu-note">Max 2 types. Remove one to change it.</p>
                  ) : POKEMON_TYPE.filter(t => !form.type.includes(t)).map(t => (
                    <button key={t} type="button" className="paf-option" onClick={() => addType(t)}>
                      <span className={`tag type-${t.toLowerCase()}`}>{t}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {errors.type && <span className="paf-error">{errors.type}</span>}
          </div>

          {/* ᓚᘏᗢ gender + shiny */}
          <div className="paf-row">
            <div className={fieldClass('gender')}>
              <label className="paf-label">Gender</label>
              <div className="paf-segmented">
                {GENDERS.map(g => (
                  <button
                    key={g}
                    type="button"
                    disabled={locked('gender')}
                    className={form.gender === g ? 'active' : ''}
                    onClick={() => set("gender", g)}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div className={fieldClass('shiny', 'paf-shiny')}>
              <label className="paf-label">Shiny variant</label>
              <Switch.Root disabled={locked('shiny')} checked={!!form.shiny} onCheckedChange={(c) => set("shiny", c)} className="paf-switch">
                <Switch.Thumb className="paf-switch-thumb" />
              </Switch.Root>
            </div>
          </div>
        </section>

        </div>

        <div className="paf-col">
        {/* ᓚᘏᗢ stats - height in meters, weight in kg */}
        <section className="paf-section">
          <h3 className="paf-section-title">Stats</h3>
          <div className="paf-row paf-row-3">
            {numberField('level', 'Level', { min: 1, max: 100 })}
            {numberField('height', 'Height (m)', { min: 0, step: 0.1 })}
            {numberField('weight', 'Weight (kg)', { min: 0, step: 0.1 })}
          </div>
        </section>

        {/* ᓚᘏᗢ price + image */}
        <section className="paf-section">
          <h3 className="paf-section-title">Listing</h3>

          <div className={fieldClass('price')}>
            <label className="paf-label" htmlFor="paf-price">Price</label>
            <div className="paf-price">
              <span className="paf-price-prefix">₽</span>
              <input id="paf-price" className="paf-input" type="number" step="any" min="0" value={form.price} onChange={e => set("price", e.target.value)} placeholder="0.00" />
            </div>
            {errors.price && <span className="paf-error">{errors.price}</span>}
          </div>

          <div className={fieldClass('imagePokemon')}>
            <label className="paf-label" htmlFor="paf-image">Image link</label>
            <div className="paf-image-row">
              <div className="paf-image-thumb">
                {form.imagePokemon && !imageBroken
                  ? <img src={form.imagePokemon} alt="" onError={() => setImageBroken(true)} />
                  : <span>?</span>}
              </div>
              <input
                id="paf-image"
                className="paf-input"
                type="url"
                disabled={locked('imagePokemon')}
                value={form.imagePokemon}
                onChange={e => { set("imagePokemon", e.target.value); setImageBroken(false); }}
                placeholder="https://..."
              />
            </div>
            <span className={imageBroken ? 'paf-error' : 'paf-hint'}>
              {imageBroken
                ? "That image couldn't load. Check the link."
                : "Tip: copy the image address from Bulbagarden for a transparent background."}
            </span>
            {errors.imagePokemon && <span className="paf-error">{errors.imagePokemon}</span>}
          </div>
        </section>

        </div>
        </div>

             {/* ᓚᘏᗢ buttons depending on page */}
             {/* save changes if editing, add product if on add product page */}
        <div className="paf-actions">
          {/* delete button only appears when editing */}
          {initialData && (
            <button
              type="button"
              className="paf-delete"
              title="Delete listing"
              onClick={() => (onDelete ? onDelete(initialData._id) : handleDelete())}
            >
              <img src={BinIcon} alt="Delete" />
            </button>
          )}
          <button type="submit" className="paf-submit" disabled={saving}>
            {saving ? "Saving..." : initialData ? (initialData.status === 'rejected' ? "Resubmit for review" : "Save changes") : "List Pokémon"}
          </button>
        </div>

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
