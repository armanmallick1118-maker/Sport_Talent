import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Map, Users, Trophy, TrendingUp, MapPin, Target, ExternalLink } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function GeospatialRadar() {
  const [data, setData] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const userRole = localStorage.getItem('role') || 'athlete';
  // Role logic: Athletes look for Coaches/Scouts. Scouts look for Athletes.
  const targetRole = userRole === 'athlete' ? 'coach' : 'athlete';
  const pageTitle = userRole === 'athlete' ? 'Find Scouts Map' : 'Elite Talent Radar';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [dataRes, statsRes] = await Promise.all([
          API.get('/api/v1/plugins/geospatial/data'),
          API.get('/api/v1/plugins/geospatial/stats')
        ]);
        setData(dataRes.data);
        setStats(statsRes.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load geospatial data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="text-xl text-slate-500 flex items-center gap-2">
          <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          Scanning Regions...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="p-8 bg-red-50 border border-red-200 text-red-600 rounded-2xl">
          {error}
        </div>
      </div>
    );
  }

  const { summary, regionalStats } = stats;
  // Filter items based on what the current user role should see
  const filteredItems = data.items.filter(item => item.role === targetRole);

  // Center map on India
  const centerLat = 22.9734;
  const centerLng = 78.6569;

  const createCustomIcon = (item) => {
    return L.divIcon({
      className: 'custom-avatar-marker',
      html: `
        <div style="
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 3px solid ${item.colorCode || '#3b82f6'};
          background-image: url('${item.avatar}');
          background-size: cover;
          background-position: center;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s;
        " onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'"></div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
      popupAnchor: [0, -20]
    });
  };

  return (
    <div className="bg-slate-950 min-h-screen pb-12">
      {/* Header */}
      <div className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-10 px-6 py-6 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Map className="text-indigo-400" />
              {pageTitle}
            </h1>
            <p className="text-slate-400 mt-1">Live national {targetRole === 'coach' ? 'scout' : 'athlete'} distribution map.</p>
          </div>
          <div className="text-sm px-5 py-2 bg-indigo-500/10 text-indigo-300 font-bold rounded-full border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.15)]">
            {filteredItems.length} {targetRole === 'coach' ? 'Scouts Active' : 'Athletes Active'}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-8">
        
        {/* Interactive Leaflet Map */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden mb-10 h-[550px] z-0 relative">
          <MapContainer center={[centerLat, centerLng]} zoom={5} style={{ height: '100%', width: '100%', zIndex: 0, backgroundColor: '#0f172a' }}>
            {/* Premium Dark Map Tile (CartoDB Dark Matter) */}
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            {filteredItems.map(item => (
              <Marker key={item.id} position={[item.coordinates.lat, item.coordinates.lng]} icon={createCustomIcon(item)}>
                <Popup className="dark-popup">
                  <div className="text-center w-48 p-1">
                    <img src={item.avatar} alt={item.name} className="w-16 h-16 rounded-full mx-auto mb-3 border-2 object-cover shadow-[0_0_10px_rgba(0,0,0,0.5)]" style={{ borderColor: item.colorCode }} />
                    <h3 className="font-bold text-sm text-slate-800">{item.name}</h3>
                    <p className="text-xs text-slate-500 mb-2">{item.location}</p>
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold mb-3 border" style={{ backgroundColor: `${item.colorCode}15`, color: item.colorCode, borderColor: `${item.colorCode}40` }}>
                      {item.tier}
                    </span>
                    <button 
                      onClick={() => {
                        if (targetRole === 'coach') {
                          navigate(`/scouts/${item.id}`, {
                            state: {
                              mockData: {
                                id: item.id,
                                email: `contact_${item.id}@example.com`,
                                user: {
                                  profile: {
                                    full_name: item.name,
                                    avatar_url: item.avatar
                                  }
                                },
                                organization: item.organization,
                                organization_type: 'Academy',
                                region: item.region,
                                specialization: item.specialization ? item.specialization.split('&').map(s => s.trim()) : []
                              }
                            }
                          });
                        } else {
                          navigate(`/scout/athletes/${item.id}`);
                        }
                      }}
                      className="w-full py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-500 transition-colors flex justify-center items-center gap-1.5 shadow-md"
                    >
                      View Profile <ExternalLink size={12} />
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Regional Breakdown */}
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Target className="text-indigo-400" size={20} />
          Regional Density Index
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {Object.entries(regionalStats).map(([key, region]) => (
            <div key={key} className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/60 rounded-2xl p-5 shadow-lg hover:border-indigo-500/30 transition-colors">
              <h3 className="font-bold text-slate-200 mb-4 flex items-center gap-2">
                <MapPin className="text-indigo-400" size={16} />
                {region.region}
              </h3>
              <div className="flex justify-between items-center text-sm text-slate-400 mb-2">
                <span>Athletes</span>
                <span className="font-bold text-slate-200">{region.athleteCount}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-slate-400 mb-1">
                <span>Scouts</span>
                <span className="font-bold text-slate-200">{region.coachCount}</span>
              </div>
            </div>
          ))}
        </div>

        {/* List */}
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Users className="text-indigo-400" size={20} />
          Directory
        </h2>
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/60 rounded-2xl shadow-lg overflow-hidden">
          <div className="divide-y divide-slate-800/60">
            {filteredItems.map(item => (
              <div 
                key={item.id} 
                className="p-5 flex items-center justify-between hover:bg-slate-800/40 transition-colors cursor-pointer group"
                onClick={() => {
                  if (targetRole === 'coach') {
                    navigate(`/scouts/${item.id}`, {
                      state: {
                        mockData: {
                          id: item.id,
                          email: `contact_${item.id}@example.com`,
                          user: {
                            profile: {
                              full_name: item.name,
                              avatar_url: item.avatar
                            }
                          },
                          organization: item.organization,
                          organization_type: 'Academy',
                          region: item.region,
                          specialization: item.specialization ? item.specialization.split('&').map(s => s.trim()) : []
                        }
                      }
                    });
                  } else {
                    navigate(`/scout/athletes/${item.id}`);
                  }
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 shadow-[0_0_10px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform" style={{ borderColor: item.colorCode }}>
                    <img src={item.avatar} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-200 group-hover:text-indigo-300 transition-colors">{item.name}</h3>
                    <p className="text-sm text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin size={12} className="text-slate-500" /> {item.location} • {item.sport || item.organization}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold border tracking-wide uppercase" style={{ backgroundColor: `${item.colorCode}15`, color: item.colorCode, borderColor: `${item.colorCode}40` }}>
                    {item.tier}
                  </span>
                  <p className="text-xs text-slate-500 mt-2 font-medium">
                    {targetRole === 'athlete' ? `Rating: ${item.overallScore}` : `Exp: ${item.experienceYears}y`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
