import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar.jsx';
import ReflectiveCard from '../components/pokemonCard.jsx';
import PokemonAddForm from '../components/PokemonAddForm.jsx';
import CrossIcon from '../assets/icons/CrossIcon.png';
import LiquidEther from '../components/LiquidEther.jsx';

const MOCK_PENDING = [
  { _id: '1', name: 'GENGAR', level: 45, type: ['Ghost', 'Poison'], gender: 'Male', imgUrl: 'https://archives.bulbagarden.net/media/upload/thumb/4/47/0094Gengar.png/375px-0094Gengar.png' },
  { _id: '2', name: 'DRAGONITE', level: 60, type: ['Dragon', 'Flying'], gender: 'Female', imgUrl: 'https://archives.bulbagarden.net/media/upload/thumb/1/1c/0149Dragonite.png/375px-0149Dragonite.png' }
];

const MOCK_ACTIVE = [
  { _id: '3', name: 'PIKACHU', level: 52, type: ['Electric'], gender: 'Male', stage: 'Basic', imgUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png' }
];


const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('approval');
    const [selectedPost, setSelectedPost] = useState(null);
  const [adminFeedback, setAdminFeedback] = useState("");
  const [isEditing, setIsEditing] = useState(false);

    return (
    <div style={{ width: '100%', padding: '0 20px', boxSizing: 'border-box' }}>
      
   
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        flexWrap: 'wrap', 
        marginBottom: '40px',
        borderBottom: '1px solid rgba(42, 26, 58, 0.5)', 
        paddingBottom: '20px'
      }}>
        
        <div style={{ flex: '1 1 auto', minWidth: '300px' }}>
          <h2 style={{ color: '#A855F7', margin: 0, fontSize: '32px', fontWeight: 'bold' }}>Command Center</h2>
          <p style={{ color: '#888', margin: '5px 0 0 0', fontSize: '16px' }}>Manage the Lavender Route ecosystem.</p>
        </div>

     
        <div style={{ 
          display: 'flex', 
          gap: '5px', 
          background: 'rgba(42, 26, 58, 0.3)', 
          padding: '6px', 
          borderRadius: '30px', 
          border: '1px solid #2A1A3A',
          marginTop: '10px' 
        }}>
          <button onClick={() => setActiveTab('approval')} style={{ background: activeTab === 'approval' ? '#A855F7' : 'transparent', color: activeTab === 'approval' ? '#fff' : '#BA8CFF', border: 'none', padding: '8px 24px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.3s ease' }}>Needs Approval</button>
          <button onClick={() => setActiveTab('flagged')} style={{ background: activeTab === 'flagged' ? '#A855F7' : 'transparent', color: activeTab === 'flagged' ? '#fff' : '#BA8CFF', border: 'none', padding: '8px 24px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.3s ease' }}>Flagged</button>
        </div>
      </div>

  
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '30px', 
        justifyContent: 'flex-start' 
      }}>
     
     <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {activeTab === 'approval' ? (
          MOCK_PENDING.map(pokemon => (
            <div key={pokemon._id} onClick={() => setSelectedPost(pokemon)}>

               <ReflectiveCard 
               pokemonName={pokemon.name} 
               id={pokemon._id} 
               level={pokemon.level} 
               type={pokemon.type} 
               gender={pokemon.gender} 
               imgUrl={pokemon.imgUrl} />
            </div>
          ))
        ) : (
          <p style={{ color: '#ff4d4d' }}>No flagged listings.</p>
        )}
      </div>

      {selectedPost && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0, 0, 0, 0.85)", zIndex: 999, display: "flex", justifyContent: "center", alignItems: "center", backdropFilter: "blur(5px)", padding: "20px" }}>
          <div style={{ position: "relative", width: "100%", maxWidth: "800px", background: "#0a0a0a", border: "1px solid #A855F7", borderRadius: "16px", padding: "30px" }}>
            
            <button onClick={() => {setSelectedPost(null); setIsEditing(false);}} style={{ position: "absolute", top: "20px", right: "20px", background: "transparent", border: "none", cursor: "pointer" }}>
              <img src={CrossIcon} style={{ width: "24px", height: "24px" }} alt="Close" />
            </button>

            {isEditing ? (
              <>
                <h3 style={{ color: '#BA8CFF', marginBottom: '20px', fontFamily: "'VT323', monospace", }}>Admin Override Edit</h3>
                <PokemonAddForm initialData={selectedPost} isModal={true} onSave={() => setIsEditing(false)} />
              </>
            ) : (
              <div style={{ display: 'flex', gap: '30px' }}>
                <ReflectiveCard pokemonName={selectedPost.name} id={selectedPost._id} level={selectedPost.level} type={selectedPost.type} gender={selectedPost.gender} imgUrl={selectedPost.imgUrl} />
                
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <h3 style={{ color: '#fff',fontFamily: "'VT323', monospace",  }}>Review: {selectedPost.name}</h3>
                  <p style={{ color: '#888', fontFamily: "'VT323', monospace", }}>Seller: Ash Ketchum <br/> Trust Level: 2 Approvals</p>

                  <textarea 
                    placeholder="Feedback (required if denying)..." 
                    value={adminFeedback}
                    onChange={(e) => setAdminFeedback(e.target.value)}
                    style={{ width: '100%', height: '80px', background: 'rgba(42, 26, 58, 0.3)', border: '1px solid #2A1A3A', color: 'white', padding: '10px', borderRadius: '8px' }}
                  />

                  <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                    <button style={{ flex: 1, background: '#C4FF4D', color: '#050505', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontFamily: "'VT323', monospace", }}>APPROVE</button>
                    <button style={{ flex: 1, background: '#ff4d4d', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontFamily: "'VT323', monospace", }}>DENY</button>
                    <button onClick={() => setIsEditing(true)} style={{ flex: 1, background: 'transparent', color: '#A855F7', border: '1px solid #A855F7', padding: '10px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer',
                      fontFamily: "'VT323', monospace",
                     }}>EDIT</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
    </div>
  );
};
        
   

 


const SellerDashboard = () => {

    const [activeTab, setActiveTab] = useState('active');
    const [selectedPost, setSelectedPost] = useState(null);
    
  return (
    <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h2 style={{ color: '#C4FF4D', margin: 0, fontSize: '48px', fontFamily: "'VT323', monospace", }}>Seller Hub</h2>
          <p style={{ color: '#4D4D4D', margin: '5px 0 0 0' }}>Manage your inventory and track approvals.</p>
        </div>
        <div style={{ display: 'flex', gap: '5px', background: 'rgba(42, 26, 58, 0.3)', padding: '6px', borderRadius: '12px', border: '1px solid #2A1A3A' }}>
          <button onClick={() => setActiveTab('active')} style={{ background: activeTab === 'active' ? '#C4FF4D' : 'transparent', color: activeTab === 'active' ? '#050505' : '#C4FF4D', border: 'none', padding: '8px 20px', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.3s ease', fontFamily: "'VT323', monospace", }}>Active Listings</button>
          <button onClick={() => setActiveTab('pending')} style={{ background: activeTab === 'pending' ? '#C4FF4D' : 'transparent', color: activeTab === 'pending' ? '#050505' : '#C4FF4D', border: 'none', padding: '8px 20px', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.3s ease', fontFamily: "'VT323', monospace", }}>Pending</button>
        </div>
      </div>

     <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {activeTab === 'active' ? (
          MOCK_ACTIVE.map(pokemon => (
            <ReflectiveCard 
              key={pokemon._id}
              pokemonName={pokemon.name}
              id={pokemon._id} 
              level={pokemon.level}
              type={pokemon.type}
              gender={pokemon.gender}
              imgUrl={pokemon.imgUrl}
              onEditClick={() => setSelectedPost(pokemon)}
            />
          ))
        ) : (
          MOCK_PENDING.map(pokemon => (
            <ReflectiveCard 
              key={pokemon._id}
              pokemonName={pokemon.name}
              id={pokemon._id} 
              level={pokemon.level}
              type={pokemon.type}
              gender={pokemon.gender}
              imgUrl={pokemon.imgUrl}
              onEditClick={() => setSelectedPost(pokemon)}
            />
          ))
        )}
      </div>

       {selectedPost && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0, 0, 0, 0.8)", zIndex: 999, display: "flex", justifyContent: "center", alignItems: "center", backdropFilter: "blur(5px)", padding: "20px" }}>
          <div style={{ position: "relative", width: "100%", maxWidth: "800px" }}>
            <button onClick={() => setSelectedPost(null)} style={{ position: "absolute", top: "20px", right: "20px", background: "transparent", border: "none", zIndex: 1000, cursor: "pointer" }}>
              <img src={CrossIcon} style={{ width: "30px", height: "30px" }} alt="Close" />
            </button>
            
            <PokemonAddForm initialData={selectedPost} isModal={true} onSave={() => setSelectedPost(null)} />
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
    <div style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            width: '100vw', 
            height: '100vh', 
            zIndex: -1
          }}>
    
      <LiquidEther
        mouseForce={20}
        cursorSize={100}
        isViscous
        viscous={30}
        colors={["#2A1A3A","#BA8CFF","#2A1A3A"]}
        autoDemo
        autoSpeed={0.5}
        autoIntensity={2.2}
        isBounce={false}
        resolution={0.5}
    
      />
      </div>
      <Navbar />
      <div style={{ 
       
        minHeight: '100vh', 
        width: '100vw',
        paddingTop: '120px', 
        paddingBottom: '60px',
        color: 'white',
        boxSizing: 'border-box',
        paddingLeft: '20px',
        paddingRight: '20px',
        zIndex: -1

      }}>
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
    </>
  );
}

   