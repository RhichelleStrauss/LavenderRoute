
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/navbar.jsx';
import Footer from '../components/Footer.jsx';
import LiquidEther from '../components/LiquidEther.jsx';
import LetterGlitch from '../components/LetterGlitch.jsx';
import ReflectiveCard from '../components/pokemonCard.jsx';
import { logout, getTokenPayload } from '../utils/auth.js';
import "../css/Dashboard.css";
import "../css/Profile.css";

const readList = (key) => {
  try {
    const list = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(list) ? list.filter(Boolean) : [];
  } catch {
    return [];
  }
};

const ROLE_LABELS = { admin: 'Admin', seller: 'Seller', hybrid: 'Seller', buyer: 'Buyer' };

const STREAK_LIMIT = 4;

const timeSince = (date) => {
  const days = Math.floor((Date.now() - date.getTime()) / 86400000);
  const plural = (n, unit) => `${n} ${unit}${n === 1 ? "" : "s"}`;
  if (days < 1) return null;
  if (days < 30) return plural(days, "day");
  if (days < 365) return plural(Math.floor(days / 30), "month");
  return plural(Math.floor(days / 365), "year");
};

export default function Profile() {
  const navigate = useNavigate();
  const tokenUser = getTokenPayload();
  const [user, setUser] = useState(null);
  const [profileError, setProfileError] = useState(false);
  const [myPosts, setMyPosts] = useState(null);
  const roles = user?.roles || tokenUser?.roles || [];
  const isSeller = roles.some(r => ['seller', 'hybrid', 'admin'].includes(r));

  useEffect(() => {
    if (!tokenUser) {
      navigate('/login');
      return;
    }
    const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };

    axios.get(`${import.meta.env.VITE_API_URL}/api/users/me`, { headers })
      .then(res => (res.data && typeof res.data === 'object' ? setUser(res.data) : setProfileError(true)))
      .catch(() => setProfileError(true));

    // only this user's listings, in every status
    axios.get(`${import.meta.env.VITE_API_URL}/api/pokemon/mine`, { headers })
      .then(res => setMyPosts(Array.isArray(res.data) ? res.data : []))
      .catch(() => setMyPosts([]));
  }, []);

  if (!tokenUser) return null;

  const firstName = user?.firstName || tokenUser.firstName || "Trainer";
  const fullName = [firstName, user?.lastName].filter(Boolean).join(" ");
  const initials = (firstName.charAt(0) + (user?.lastName?.charAt(0) || "")).toUpperCase();
 
  const joinedAt = user?.createdAt
    ? new Date(user.createdAt)
    : tokenUser.id ? new Date(parseInt(String(tokenUser.id).slice(0, 8), 16) * 1000) : null;
  const memberSince = joinedAt
    ? joinedAt.toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : null;
  const activeFor = joinedAt ? timeSince(joinedAt) : null;
  const uniqueRoles = [...new Set(roles.map(r => ROLE_LABELS[r] || r))];

  const livePosts = (myPosts || []).filter(p => p.status === 'approved');
  const rejectedPosts = (myPosts || []).filter(p => p.status === 'rejected');
  
  const soldCount = (myPosts || []).filter(p => p.status === 'sold').length;
  const wishlist = readList('wishlist');

  const count = (n) => (myPosts ? n : '–');
  const headerStats = isSeller
    ? [
        { label: 'Sold', value: count(soldCount), tone: 'purple' },
        { label: 'Denied', value: count(rejectedPosts.length), tone: 'red' },
        { label: 'Live listings', value: count(livePosts.length), tone: 'lime' },
      ]
    : [{ label: 'Wishlist', value: wishlist.length, tone: 'lime' }];

   const shelf = isSeller
    ? { title: 'Your listings', items: livePosts, empty: "You have no live listings", emptyHint: "When you list a Pokémon and it's approved, it will show up here.", cta: { label: '+ List a Pokémon', to: '/add-pokemon' } }
    : { title: 'Your wishlist', items: wishlist, empty: "Your wishlist is empty", emptyHint: "Tap the heart on any Pokémon to save it here.", cta: { label: 'Browse inventory', to: '/catalog' } };

  return (
    <>
      <div className="profile-bg">
        <LiquidEther
          mouseForce={20}
          cursorSize={100}
          isViscous
          viscous={30}
          colors={["#2A1A3A", "#BA8CFF", "#2A1A3A"]}
          autoDemo
          autoSpeed={0.5}
          autoIntensity={2.2}
          isBounce={false}
          resolution={0.5}
        />
      </div>

      <Navbar />

      <main className="profile-page admin-hub">
        
        <section className="profile-header">
          <div className="profile-banner" aria-hidden="true">
            <LetterGlitch
              glitchColors={["#7C3AED", "#A855F7", "#C4FF4D"]}
              glitchSpeed={60}
              centerVignette={false}
              outerVignette={false}
              smooth={true}
            />
          </div>

          <div className="profile-identity-row">
            <div className="profile-avatar">{initials}</div>

            <div className="profile-identity">
              <h1 className="profile-name">{fullName}</h1>
              <div className="profile-meta">
                {uniqueRoles.map(role => (
                  <span key={role} className={`tag role-${role.toLowerCase()}`}>{role}</span>
                ))}
                {user?.email && <span>{user.email}</span>}
              </div>
              {memberSince && (
                <p className="profile-active">
                  {activeFor ? `Active for ${activeFor}` : 'Joined today'}
                  <span> · Member since {memberSince}</span>
                </p>
              )}
            </div>

            <div className="profile-side">
              <button className="admin-btn admin-btn-deny" onClick={() => logout(navigate)}>Log out</button>
            </div>
          </div>
        </section>

          <div className="profile-stats">
          {headerStats.map(stat => (
            <div key={stat.label} className={`profile-stat profile-stat-${stat.tone}`}>
              <span className="admin-stat-label">{stat.label}</span>
              <span className="profile-stat-value">{stat.value}</span>
            </div>
          ))}
        </div>

        {profileError && (
          <p className="profile-warning">Couldn't load your full profile from the server, so some details are missing.</p>
        )}

           <div className={`profile-body ${isSeller ? '' : 'profile-body-single'}`}>
          {isSeller && (
          <div className="profile-column">
               <section className="profile-panel">
              <h2 className="profile-panel-title">
                Reputation
                <span className={`status-pill ${user?.isDeniedFromPosting ? 'status-rejected' : (user?.approvalStreak ?? 0) >= STREAK_LIMIT ? 'status-pending' : 'status-approved'}`}>
                  {user?.isDeniedFromPosting ? 'Blocked' : (user?.approvalStreak ?? 0) >= STREAK_LIMIT ? 'Trusted' : 'Standard'}
                </span>
              </h2>

              <div className="profile-streak">
                <div className="profile-streak-head">
                  <span className="admin-stat-label">Approval streak</span>
                  <span className="profile-streak-count">{Math.min(user?.approvalStreak ?? 0, STREAK_LIMIT)}/{STREAK_LIMIT}</span>
                </div>
                <div className="profile-streak-bar tone-lime">
                  <span style={{ width: `${(Math.min(user?.approvalStreak ?? 0, STREAK_LIMIT) / STREAK_LIMIT) * 100}%` }} />
                </div>
                <span className="profile-streak-hint">{STREAK_LIMIT} approvals in a row and your listings skip review.</span>
              </div>

              <div className="profile-streak">
                <div className="profile-streak-head">
                  <span className="admin-stat-label">Deny streak</span>
                  <span className="profile-streak-count">{Math.min(user?.denyStreak ?? 0, STREAK_LIMIT)}/{STREAK_LIMIT}</span>
                </div>
                <div className="profile-streak-bar tone-red">
                  <span style={{ width: `${(Math.min(user?.denyStreak ?? 0, STREAK_LIMIT) / STREAK_LIMIT) * 100}%` }} />
                </div>
                <span className="profile-streak-hint">{STREAK_LIMIT} denials in a row and you can't post new listings.</span>
              </div>

              <p className="profile-placeholder">Coming soon: streaks aren't counted yet.</p>
            </section>
          </div>
          )}

            <section className="profile-panel profile-shelf">
            <h2 className="profile-panel-title">{shelf.title}</h2>

            {isSeller && myPosts === null ? (
              <p className="profile-muted">Loading...</p>
            ) : shelf.items.length === 0 ? (
              <div className="profile-empty">
                <strong>{shelf.empty}</strong>
                <span>{shelf.emptyHint}</span>
                <button className="admin-btn admin-btn-approve" onClick={() => navigate(shelf.cta.to)}>{shelf.cta.label}</button>
              </div>
            ) : (
              <div className="profile-cards">
                {shelf.items.map(p => (
                  <ReflectiveCard
                    key={p._id}
                    id={p._id}
                    pokemonName={p.name}
                    level={p.level}
                    type={p.type || []}
                    gender={p.gender}
                    height={p.height}
                    weight={p.weight}
                    shiny={p.shiny}
                    imgUrl={p.imagePokemon || p.imgUrl}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <div className="page-footer">
        <Footer glitch />
      </div>
    </>
  );
}
