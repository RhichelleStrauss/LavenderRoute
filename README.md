<div align="center">
  
# Lavender Route
<img src="../LavenderRoute/frontend/LavendarRoute/src/assets/Banner_LavenderRoute.png">

**A shadowy hub for serious Pokémon traders, where rare finds and elite builds change hands fast.**

</div>

## About Lavender Route

In the standard digital asset and Pokémon trading space, platforms often feel generic, cluttered, and lack a premium feel. **Lavender Route** is a full-stack web application built to solve this. Designed for competitive players and elite collectors, the platform allows users to securely register, trade, and manage high-value digital assets within a nostalgic yet modern "Misty Glass" interface. Built on privacy, trust, and reputation.

### Built With

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Base UI](https://img.shields.io/badge/Base%20UI-007FFF?style=for-the-badge&logo=mui&logoColor=white)

<img src="../LavenderRoute/frontend/LavendarRoute/src/assets/HomePageLavRoute.jpg">

---

## How To Install

To get started, clone the repo:
```bash
git clone [https://github.com/RhichelleStrauss/LavenderRoute.git](https://github.com/RhichelleStrauss/LavenderRoute.git)
```

Install all the backend dependencies and start the server:
```bash
cd backend
npm install
node server.js
```
*(Ensure you have a `.env` file with your `MONGO_URI` and `JWT_SECRET`)*

Open a new terminal, install frontend dependencies, and run the app:
```bash
cd frontend
cd LavendarRoute
npm install
npm run dev
```

---

## Features

| Authentication & Security | Marketplace & Trading | Admin & Seller Dashboard |
| :--- | :--- | :--- |
| Encrypted JWT Sessions | Asset Browsing & Searching | Full CRUD Operations |
| Role-Based Access Control | Add to Cart / Wishlist | Manage Active Listings |
| Bcrypt Password Hashing | Ethereal Glassmorphism UI | View User Demographics |

---

## The Idea

The idea was to create a digital marketplace that didn't feel like a standard e-commerce site, but rather an exclusive, underground network. We wanted to combine the nostalgic, slightly eerie vibe of the original Pokémon games (specifically Lavender Town) with a highly modern, secure, and cyberpunk-inspired UI layout. 

## Wireframes

<div align="center">
  <img src="../LavenderRoute/frontend/LavendarRoute/src/assets/LavenderRoute_Wireframe_HomePage.png" width="24%">
  <img src="../LavenderRoute/frontend/LavendarRoute/src/assets/Catalog_wireframe.png" width="24%">
  <img src="../LavenderRoute/frontend/LavendarRoute/src/assets/Modal_wireframe.png" width="24%">
  <img src="../LavenderRoute/frontend/LavendarRoute/src/assets/ProductAdd_Wireframe.png" width="24%">
</div>

---

## Development Process & Challenges

Building a full-stack MERN application from scratch required overcoming several architectural and engineering challenges:

### 1. Full-Stack Security & RBAC (Role-Based Access Control)
One of the most complex parts of the project was implementing secure Role-Based Access Control. We needed a system that securely differentiated between Admins, Sellers, and standard Guests. We implemented a stateless authentication system using **JSON Web Tokens (JWT)**. `bcrypt` hashes passwords on the backend, while the signed JWTs are used on the React frontend to conditionally render the UI. Most importantly, we built Express middleware to verify these JWTs in the HTTP headers for every CRUD operation, ensuring the backend is as secure as the frontend.

### 2. NoSQL Data Modeling
Shifting to a NoSQL document database (MongoDB) required critical architectural decisions regarding whether to *embed* data or *reference* it. For the Cart and Wishlist systems, instead of embedding massive arrays of full Pokémon objects inside the User document, we stored an array of Mongoose `ObjectIds`. By utilizing Mongoose's `.populate()` method dynamically, we kept the database normalized, lightweight, and ensured that global price updates reflect instantly in every user's cart.

### 3. Separation of Concerns (MVC Architecture)
As the application scaled, managing backend routes and frontend UI became complex. We refactored the backend into a strict **Model-View-Controller (MVC)** pattern—separating our Mongoose Models, Express Routes, and Controllers into isolated modules. On the frontend, we broke massive pages down into highly reusable, isolated React components. This modularity eliminated spaghetti code, prevented Git merge conflicts, and allowed our team to work in parallel.

### 4. UI/UX: Headless Components vs. Custom Theming
To achieve our highly specific "Misty Glass" cyberpunk aesthetic, standard UI libraries like Bootstrap or Material UI were too rigid. However, building accessible inputs (like number steppers and toggles) from scratch is incredibly time-consuming. We solved this by using `@base-ui/react`, a "headless" component library. It provided the complex underlying logic and accessibility (ARIA roles, keyboard navigation) but shipped with zero CSS, giving us total creative control to engineer our custom glassmorphism effects and layouts using CSS Grid and Flexbox.

---

## Future Implementations

* Integration of real-time WebSockets for live bidding and auctions.
* A direct messaging system for Sellers and Buyers to negotiate safely.
* Crypto-wallet connection for decentralized asset purchases.
* Advanced filtering by Pokémon IVs, EVs, and specific abilities.
* Adding the Pokémon API for easier Pokémon product creation.

## Mockups

![Lavender Route Mockup](../LavenderRoute/frontend/LavendarRoute/src/assets/LavRouteMockupDashboard.png)
![Lavender Route Mockup](../LavenderRoute/frontend/LavendarRoute/src/assets/DesktopMockup.png)

## Demonstration

[Link To Demonstration Video / Live Deployment](#)

## License

MIT © [TheReactors]
