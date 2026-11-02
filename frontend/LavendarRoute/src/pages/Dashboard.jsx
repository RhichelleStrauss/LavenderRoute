//onload checks localstorage for users roles
//if its admin, admin dash is loaded, and loads admin dash, fetches all pending posts 
//if seller, seller dash is loaded, fethces users pokemon



import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/navbar.jsx';
import Footer from '../components/Footer.jsx';
import ReflectiveCard from '../components/pokemonCard.jsx';
import PokemonAddForm from '../components/PokemonAddForm.jsx';
import CrossIcon from '../assets/icons/CrossIcon.png';
import LiquidEther from '../components/LiquidEther.jsx';
import MagicBento from '../components/MagicBento.jsx';
import axios from 'axios';
import toast from 'react-hot-toast';
import "../css/catalog.css";
import "../css/Dashboard.css";

const priceFormatter = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const timeAgo = (date) => {
  if (!date) return "—";
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const units = [["y", 31536000], ["mo", 2592000], ["d", 86400], ["h", 3600], ["m", 60]];
  for (const [label, size] of units) {
    if (seconds >= size) return `${Math.floor(seconds / size)}${label} ago`;
  }
  return "—";
};

// confirm, then delete a listing; returns true if it was deleted
const deleteListing = async (post) => {
  if (!post || !window.confirm(`Are you sure you want to delete ${post.name}? This cannot be undone.`)) return false;
  try {
    await axios.delete(`${import.meta.env.VITE_API_URL}/api/pokemon/${post._id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    toast.success(`${post.name} deleted.`);
    return true;
  } catch (err) {
    console.error(err);
    toast.error("Failed to delete. It may have already been removed.");
    return false;
  }
};

const STAT_GLOW = { lime: '#C4FF4D', purple: '#BA8CFF', red: '#ff4d6d', grey: '#d4d4d8' };

const StatCard = ({ stat, loading }) => (
  <MagicBento
    className={`stat-bento stat-bento-${stat.accent}`}
    columns={1}
    glowColor={STAT_GLOW[stat.accent]}
    style={{ gridAutoRows: 'auto' }}
    items={[{
      content: (
        <div className={`admin-stat admin-stat-${stat.accent}`}>
          <span className="admin-stat-label">{stat.label}</span>
          <span className="admin-stat-value">{loading ? '–' : stat.value}</span>
        </div>
      ),
    }]}
  />
);

const ADMIN_TABS = [
  { key: 'pending', label: 'Pending' },
  { key: 'approved', label: 'Live' },
  { key: 'rejected', label: 'Rejected' },
];

const STATUS_LABELS = { pending: 'Pending', approved: 'Live', rejected: 'Rejected' };

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [allPosts, setAllPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // one request for every listing (admin-only route), then split by status for the stats and tabs
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/pokemon/all`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      setAllPosts(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error(error);
      toast.error("Couldn't load listings.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const groups = { pending: [], approved: [], rejected: [] };
  allPosts.forEach(p => groups[p.status]?.push(p));
  const sellerCount = new Set(allPosts.map(p => p.sellerId?._id || p.sellerId).filter(Boolean)).size;

  const query = search.trim().toLowerCase();
  const rows = groups[activeTab]
    .filter(p => !query
      || p.name?.toLowerCase().includes(query)
      || p.sellerId?.firstName?.toLowerCase().includes(query))
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    const selectedPost = allPosts.find(p => p._id === selectedId) || null;

  const selectPost = (post) => {
    setSelectedId(post._id);
    setAdminNotes("");
    setIsEditing(false);
  };

  const closeModal = () => {
    setSelectedId(null);
    setAdminNotes("");
    setIsEditing(false);
  };

  const switchTab = (key) => {
    setActiveTab(key);
    closeModal();
  };

  const handleReview = async (post, action, notes = "") => {
    if (action === 'reject' && !notes.trim()) {
      return toast.error("You must provide feedback to deny a post.");
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/review-post`, {
        postId: post._id,
        action: action,
        adminNotes: action === 'reject' ? notes : ""
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success(`${post.name} ${action === 'approve' ? 'approved' : 'rejected'}!`);
      closeModal();
      fetchPosts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Review failed.");
    }
  };

  const stats = [
    { label: 'Awaiting review', value: groups.pending.length, accent: 'lime' },
    { label: 'Live listings', value: groups.approved.length, accent: 'purple' },
    { label: 'Rejected', value: groups.rejected.length, accent: 'red' },
    { label: 'Sellers', value: sellerCount, accent: 'grey' },
  ];

  return (
    <div className="admin-hub">
      <div className="admin-header">
        <div>
          <h2 className="admin-title">Admin Hub</h2>
          <p className="admin-subtitle">Manage the Lavender Route ecosystem.</p>
        </div>
        <button className="admin-btn admin-btn-ghost" onClick={fetchPosts} disabled={loading}>
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      <div className="admin-stats">
        {stats.map(stat => <StatCard key={stat.label} stat={stat} loading={loading} />)}
      </div>

      <div className="admin-workspace admin-workspace-full">
        <div className="admin-panel">
          <div className="admin-toolbar">
            <div className="admin-tabs">
              {ADMIN_TABS.map(tab => (
                <button
                  key={tab.key}
                  className={`admin-tab ${activeTab === tab.key ? 'active' : ''}`}
                  onClick={() => switchTab(tab.key)}
                >
                  {tab.label}
                  <span className="admin-tab-count">{groups[tab.key].length}</span>
                </button>
              ))}
            </div>
            <input
              className="admin-search"
              type="search"
              placeholder="Search Pokémon or seller..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="admin-table">

            {loading ? (
              <p className="admin-empty">Loading listings...</p>
            ) : rows.length === 0 ? (
              <p className="admin-empty">
                {query ? 'No listings match your search.' : activeTab === 'pending' ? 'Queue is clear. Nothing waiting for review.' : 'Nothing here yet.'}
              </p>
            ) : rows.map(pokemon => (
              <div
                key={pokemon._id}
                className={`admin-row ${selectedPost?._id === pokemon._id ? 'selected' : ''}`}
                onClick={() => selectPost(pokemon)}
              >
                <img className="admin-thumb" src={pokemon.imagePokemon || pokemon.imgUrl} alt={pokemon.name} />

                <div className="admin-cell-main">
                  <span className="admin-name">{pokemon.name}</span>
                  <div className="pokemon-tags admin-tags">
                    {pokemon.shiny && <span className="tag tag-shiny">Shiny</span>}
                    {pokemon.type?.map(t => (
                      <span key={t} className={`tag type-${t.toLowerCase()}`}>{t}</span>
                    ))}
                  </div>
                </div>

                <span className="admin-cell" data-label="Seller">{pokemon.sellerId?.firstName || "Unknown"}</span>
                <span className="admin-cell admin-mono" data-label="Level">{pokemon.level}</span>
                <span className="admin-cell admin-mono" data-label="Price">₽ {priceFormatter.format(pokemon.price || 0)}</span>
                <span className="admin-cell admin-muted" data-label="Submitted">{timeAgo(pokemon.createdAt)}</span>

                {/* quick approve without opening the modal; stopPropagation keeps the row click from firing */}
                <div className="admin-actions" onClick={(e) => e.stopPropagation()}>
                  {activeTab === 'pending' ? (
                    <button className="admin-btn admin-btn-approve" onClick={() => handleReview(pokemon, 'approve')}>Approve</button>
                  ) : (
                    <button className="admin-btn admin-btn-ghost" onClick={() => navigate(`/pokemon/${pokemon._id}`)}>View</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* review modal: opens when a row is clicked, card on the left, details + actions on the right */}
      {selectedPost && (
        <div className="admin-modal-backdrop" onClick={closeModal}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <button className="admin-modal-close" onClick={closeModal}>
              <img src={CrossIcon} alt="Close" />
            </button>

            {isEditing ? (
              <>
                <h3 className="admin-modal-title">Admin Override Edit</h3>
                <PokemonAddForm
                  initialData={selectedPost}
                  isModal={true}
                  onSave={() => { setIsEditing(false); fetchPosts(); }}
                  onDelete={async () => { if (await deleteListing(selectedPost)) { closeModal(); fetchPosts(); } }}
                />
              </>
            ) : (
              <div className="review-modal">
                <div className="review-modal-card">
                  <ReflectiveCard
                    key={selectedPost._id}
                    isInteractive={false}
                    pokemonName={selectedPost.name}
                    id={selectedPost._id}
                    level={selectedPost.level}
                    type={selectedPost.type}
                    gender={selectedPost.gender}
                    height={selectedPost.height}
                    weight={selectedPost.weight}
                    shiny={selectedPost.shiny}
                    imgUrl={selectedPost.imagePokemon || selectedPost.imgUrl}
                  />
                </div>

                <div className="review-modal-details">
                  <div className="inspector-head">
                    <span className={`status-pill status-${selectedPost.status}`}>{STATUS_LABELS[selectedPost.status]}</span>
                    <span className="admin-muted">{timeAgo(selectedPost.createdAt)}</span>
                  </div>

                  <h3 className="admin-modal-title">Review: {selectedPost.name}</h3>

                  <div className="inspector-meta">
                    <div>
                      <span className="admin-stat-label">Seller</span>
                      <span className="inspector-meta-value">{selectedPost.sellerId?.firstName || "Unknown"}</span>
                    </div>
                    <div>
                      <span className="admin-stat-label">Price</span>
                      <span className="inspector-meta-value">₽ {priceFormatter.format(selectedPost.price || 0)}</span>
                    </div>
                  </div>

                  {selectedPost.description && <p className="inspector-description">{selectedPost.description}</p>}

                  {selectedPost.status === 'rejected' && selectedPost.adminNotes && (
                    <div className="inspector-feedback">
                      <span className="admin-stat-label">Previous feedback</span>
                      <p>{selectedPost.adminNotes}</p>
                    </div>
                  )}

                  <textarea
                    className="admin-notes"
                    placeholder="Feedback (required if denying)..."
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                  />

                  <div className="admin-modal-actions">
                    {selectedPost.status !== 'approved' && (
                      <button className="admin-btn admin-btn-approve" onClick={() => handleReview(selectedPost, 'approve')}>Approve</button>
                    )}
                    {selectedPost.status !== 'rejected' && (
                      <button className="admin-btn admin-btn-deny" onClick={() => handleReview(selectedPost, 'reject', adminNotes)}>Deny</button>
                    )}
                    <button className="admin-btn admin-btn-ghost" onClick={() => setIsEditing(true)}>Edit</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const SELLER_TABS = [
  { key: 'approved', label: 'Live' },
  { key: 'pending', label: 'Pending' },
  { key: 'rejected', label: 'Needs revision' },
];

const SellerDashboard = () => {
  const navigate = useNavigate();
  // the profile page's notifications can open a specific tab / listing
  const linked = useLocation().state;
  const inspectorRef = useRef(null);
  const [myPosts, setMyPosts] = useState([]);
  const [selectedId, setSelectedId] = useState(linked?.id || null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState(linked?.tab || 'approved');
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // /mine returns only this seller's listings, in every status
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/pokemon/mine`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMyPosts(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error(error);
      toast.error("Couldn't load your listings.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const groups = { pending: [], approved: [], rejected: [] };
  myPosts.forEach(p => groups[p.status]?.push(p));
  const liveValue = groups.approved.reduce((sum, p) => sum + (Number(p.price) || 0), 0);

  const query = search.trim().toLowerCase();
  const rows = groups[activeTab]
    .filter(p => !query || p.name?.toLowerCase().includes(query))
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

  const selectedPost = rows.find(p => p._id === selectedId) || rows[0] || null;

  const selectPost = (post) => {
    setSelectedId(post._id);
    if (window.matchMedia('(max-width: 1279px)').matches) {
      inspectorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const switchTab = (key) => {
    setActiveTab(key);
    setSelectedId(null);
  };

  const handleDelete = async () => {
    if (await deleteListing(selectedPost)) {
      setIsEditing(false);
      fetchPosts();
    }
  };

  const stats = [
    { label: 'Live listings', value: groups.approved.length, accent: 'lime' },
    { label: 'Pending review', value: groups.pending.length, accent: 'purple' },
    { label: 'Needs revision', value: groups.rejected.length, accent: 'red' },
    { label: 'Live value', value: `₽ ${priceFormatter.format(liveValue)}`, accent: 'grey' },
  ];

  const emptyText = {
    approved: "You have no live listings yet.",
    pending: "Nothing waiting for review.",
    rejected: "No listings need revision. Great job!",
  };

  return (
    <div className="admin-hub seller-hub">
      <div className="admin-header">
        <div>
          <h2 className="admin-title">Seller Hub</h2>
          <p className="admin-subtitle">Manage your inventory and track approvals.</p>
        </div>
        <div className="admin-header-actions">
          <button className="admin-btn admin-btn-ghost" onClick={fetchPosts} disabled={loading}>
            {loading ? 'Loading...' : 'Refresh'}
          </button>
          <button className="admin-btn admin-btn-approve" onClick={() => navigate('/add-pokemon')}>
            + List a Pokémon
          </button>
        </div>
      </div>

      <div className="admin-stats">
        {stats.map(stat => <StatCard key={stat.label} stat={stat} loading={loading} />)}
      </div>

      <div className="admin-workspace">
        <div className="admin-panel">
          <div className="admin-toolbar">
            <div className="admin-tabs">
              {SELLER_TABS.map(tab => (
                <button
                  key={tab.key}
                  className={`admin-tab ${activeTab === tab.key ? 'active' : ''}`}
                  onClick={() => switchTab(tab.key)}
                >
                  {tab.label}
                  <span className="admin-tab-count">{groups[tab.key].length}</span>
                </button>
              ))}
            </div>
            <input
              className="admin-search"
              type="search"
              placeholder="Search your Pokémon..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="admin-table">

            {loading ? (
              <p className="admin-empty">Loading your listings...</p>
            ) : rows.length === 0 ? (
              <p className="admin-empty">{query ? 'No listings match your search.' : emptyText[activeTab]}</p>
            ) : rows.map(pokemon => (
              <div
                key={pokemon._id}
                className={`admin-row seller-row ${selectedPost?._id === pokemon._id ? 'selected' : ''}`}
                onClick={() => selectPost(pokemon)}
              >
                <img className="admin-thumb" src={pokemon.imagePokemon || pokemon.imgUrl} alt={pokemon.name} />

                <div className="admin-cell-main">
                  <span className="admin-name">{pokemon.name}</span>
                  <div className="pokemon-tags admin-tags">
                    {pokemon.shiny && <span className="tag tag-shiny">Shiny</span>}
                    {pokemon.type?.map(t => (
                      <span key={t} className={`tag type-${t.toLowerCase()}`}>{t}</span>
                    ))}
                  </div>
                </div>

                <span className="admin-cell admin-mono" data-label="Level">{pokemon.level}</span>
                <span className="admin-cell admin-mono" data-label="Price">₽ {priceFormatter.format(pokemon.price || 0)}</span>
                <span className="admin-cell admin-muted" data-label="Listed">{timeAgo(pokemon.createdAt)}</span>

                <div className="admin-actions" onClick={(e) => e.stopPropagation()}>
                  <button className="admin-btn admin-btn-ghost" onClick={() => { setSelectedId(pokemon._id); setIsEditing(true); }}>Edit</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="admin-inspector" ref={inspectorRef}>
          {selectedPost ? (
            <>
              <div className="inspector-head">
                <span className={`status-pill status-${selectedPost.status}`}>{STATUS_LABELS[selectedPost.status]}</span>
                <span className="admin-muted">{timeAgo(selectedPost.createdAt)}</span>
              </div>

              <div className="inspector-card">
                <ReflectiveCard
                  key={selectedPost._id}
                  isInteractive={false}
                  pokemonName={selectedPost.name}
                  id={selectedPost._id}
                  level={selectedPost.level}
                  type={selectedPost.type}
                  gender={selectedPost.gender}
                  height={selectedPost.height}
                  weight={selectedPost.weight}
                  shiny={selectedPost.shiny}
                  imgUrl={selectedPost.imagePokemon || selectedPost.imgUrl}
                />
              </div>

              <div className="inspector-meta">
                <div>
                  <span className="admin-stat-label">Price</span>
                  <span className="inspector-meta-value">₽ {priceFormatter.format(selectedPost.price || 0)}</span>
                </div>
                <div>
                  <span className="admin-stat-label">Comments</span>
                  <span className="inspector-meta-value">{selectedPost.comments?.length || 0}</span>
                </div>
              </div>

              {selectedPost.status === 'rejected' && (
                <div className="inspector-feedback">
                  <span className="admin-stat-label">Admin feedback</span>
                  <p>{selectedPost.adminNotes || "No feedback provided."}</p>
                </div>
              )}

              {selectedPost.status === 'pending' && (
                <p className="admin-muted">Waiting for an admin to review this listing.</p>
              )}

              {selectedPost.description && <p className="inspector-description">{selectedPost.description}</p>}

              <div className="admin-modal-actions">
                <button className="admin-btn admin-btn-approve" onClick={() => setIsEditing(true)}>
                  {selectedPost.status === 'rejected' ? 'Fix listing' : 'Edit'}
                </button>
                {selectedPost.status === 'approved' && (
                  <button className="admin-btn admin-btn-ghost" onClick={() => navigate(`/pokemon/${selectedPost._id}`)}>View live</button>
                )}
              </div>
            </>
          ) : (
            <p className="admin-empty">{loading ? 'Loading...' : 'Select a listing to preview its card.'}</p>
          )}
        </aside>
      </div>

      {isEditing && selectedPost && (
        <div className="admin-modal-backdrop" onClick={() => setIsEditing(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <button className="admin-modal-close" onClick={() => setIsEditing(false)}>
              <img src={CrossIcon} alt="Close" />
            </button>
            <h3 className="admin-modal-title">Edit {selectedPost.name}</h3>
            <PokemonAddForm
              initialData={selectedPost}
              isModal={true}
              onSave={() => { setIsEditing(false); fetchPosts(); }}
              onDelete={handleDelete}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default function Dashboard() {
  const [userRoles, setUserRoles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const roles = JSON.parse(localStorage.getItem('userRoles') || '[]');

    if (!roles.includes('admin') && !roles.includes('seller') && !roles.includes('hybrid')) {
      navigate('/catalog');
      return;
    }

    setUserRoles(roles);
  }, [navigate]);

  if (userRoles.length === 0) return null;

  return (
    <>
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1 }}>
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
      <div style={{ minHeight: '100vh', width: '100%', paddingTop: '120px', paddingBottom: '60px', color: 'white', boxSizing: 'border-box', paddingLeft: '20px', paddingRight: '20px', zIndex: -1 }}>
        {userRoles.includes('admin') ? (
          <AdminDashboard />
        ) : userRoles.includes('seller') || userRoles.includes('hybrid') ? (
          <SellerDashboard />
        ) : (
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2 style={{ color: '#BA8CFF' }}>Buyer Dashboard</h2>
            <p style={{ color: '#888' }}>Your purchases and saved items will appear here.</p>
          </div>
        )}
      </div>
      <div className="page-footer">
        <Footer glitch />
      </div>
    </>
  );
}