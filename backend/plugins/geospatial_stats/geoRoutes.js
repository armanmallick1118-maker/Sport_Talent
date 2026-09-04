const express = require('express');
const router = express.Router();

// Mock & Geocoded Database of Athletes (Purple Shades) & Coaches (Yellow Shades)
const talentHubs = [
  // ================= ATHLETES (PURPLE SPECTRUM) =================
  {
    id: 'ath-1',
    name: 'Rahul Das',
    role: 'athlete',
    sport: 'Football',
    position: 'Winger',
    age: 17,
    location: 'Kolkata, West Bengal',
    coordinates: { lat: 22.5726, lng: 88.3639 },
    region: 'East',
    overallScore: 88,
    speed: 91,
    agility: 84,
    jump: 88,
    endurance: 82,
    technique: 86,
    sprintTime: '2.84s',
    topSpeed: '24.2 km/h',
    verified: true,
    academy: 'Bengal Tigers Football Academy',
    bio: 'Explosive winger with exceptional acceleration and dribbling abilities in tight spaces.',
    tier: 'Advanced',
    colorCode: '#7C3AED',
    avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'ath-2',
    name: 'Priya Sharma',
    role: 'athlete',
    sport: 'Football',
    position: 'Midfielder',
    age: 19,
    location: 'Mumbai, Maharashtra',
    coordinates: { lat: 19.0760, lng: 72.8777 },
    region: 'West',
    overallScore: 94,
    speed: 95,
    agility: 91,
    jump: 86,
    endurance: 93,
    technique: 92,
    sprintTime: '2.71s',
    topSpeed: '25.8 km/h',
    verified: true,
    academy: 'Western Coastal Strikers Club',
    bio: 'Box-to-box midfielder known for high work rate, vision, and sustained top-end speed.',
    tier: 'Elite',
    colorCode: '#8B5CF6',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'ath-3',
    name: 'Amit Patel',
    role: 'athlete',
    sport: 'Cricket',
    position: 'Fast Bowler',
    age: 18,
    location: 'Ahmedabad, Gujarat',
    coordinates: { lat: 23.0225, lng: 72.5714 },
    region: 'West',
    overallScore: 81,
    speed: 82,
    agility: 78,
    jump: 80,
    endurance: 84,
    technique: 79,
    sprintTime: '3.02s',
    topSpeed: '22.5 km/h',
    verified: true,
    academy: 'Gujarat Cricket Development Center',
    bio: 'Pace bowler with clean run-up mechanics and consistent line and length release.',
    tier: 'Advanced',
    colorCode: '#7C3AED',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'ath-4',
    name: 'Rohan Verma',
    role: 'athlete',
    sport: 'Athletics',
    position: '100m Sprinter',
    age: 16,
    location: 'New Delhi, Delhi NCR',
    coordinates: { lat: 28.6139, lng: 77.2090 },
    region: 'North',
    overallScore: 92,
    speed: 98,
    agility: 88,
    jump: 90,
    endurance: 80,
    technique: 89,
    sprintTime: '2.62s',
    topSpeed: '27.1 km/h',
    verified: true,
    academy: 'Capital Sports High-Performance Wing',
    bio: 'National junior sprint medalist with lightning reaction off the blocks.',
    tier: 'Elite',
    colorCode: '#8B5CF6',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'ath-5',
    name: 'Sneha Reddy',
    role: 'athlete',
    sport: 'Badminton',
    position: 'Singles',
    age: 17,
    location: 'Hyderabad, Telangana',
    coordinates: { lat: 17.3850, lng: 78.4867 },
    region: 'South',
    overallScore: 89,
    speed: 88,
    agility: 96,
    jump: 87,
    endurance: 85,
    technique: 92,
    sprintTime: '2.89s',
    topSpeed: '23.8 km/h',
    verified: true,
    academy: 'Deccan Shuttle Academy',
    bio: 'Extremely quick footwork, sharp smashes, and high agility along the baseline.',
    tier: 'Advanced',
    colorCode: '#9333EA',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'ath-6',
    name: 'Arjun Nair',
    role: 'athlete',
    sport: 'Basketball',
    position: 'Point Guard',
    age: 18,
    location: 'Bengaluru, Karnataka',
    coordinates: { lat: 12.9716, lng: 77.5946 },
    region: 'South',
    overallScore: 85,
    speed: 87,
    agility: 90,
    jump: 92,
    endurance: 83,
    technique: 84,
    sprintTime: '2.90s',
    topSpeed: '23.4 km/h',
    verified: true,
    academy: 'Silicon City Hoops Foundation',
    bio: 'Dynamic playmaker with 78cm vertical leap and rapid transition velocity.',
    tier: 'Advanced',
    colorCode: '#9333EA',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'ath-7',
    name: 'Vikramjit Singh',
    role: 'athlete',
    sport: 'Athletics',
    position: 'High Jump & Long Jump',
    age: 19,
    location: 'Chandigarh, Punjab',
    coordinates: { lat: 30.7333, lng: 76.7794 },
    region: 'North',
    overallScore: 91,
    speed: 89,
    agility: 85,
    jump: 97,
    endurance: 78,
    technique: 91,
    sprintTime: '2.79s',
    topSpeed: '25.0 km/h',
    verified: true,
    academy: 'Northern Track & Field Institute',
    bio: 'Record-shattering explosive vertical power with 82cm standing vertical jump.',
    tier: 'Elite',
    colorCode: '#8B5CF6',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'ath-8',
    name: 'Ananya Deshmukh',
    role: 'athlete',
    sport: 'Football',
    position: 'Goalkeeper',
    age: 18,
    location: 'Pune, Maharashtra',
    coordinates: { lat: 18.5204, lng: 73.8567 },
    region: 'West',
    overallScore: 78,
    speed: 74,
    agility: 88,
    jump: 86,
    endurance: 75,
    technique: 82,
    sprintTime: '3.12s',
    topSpeed: '21.4 km/h',
    verified: true,
    academy: 'Sahyadri Sports Academy',
    bio: 'Commanding aerial presence, quick reflex dives, and great penalty-stopping record.',
    tier: 'Rising',
    colorCode: '#A855F7',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'ath-9',
    name: 'Kabir Thapa',
    role: 'athlete',
    sport: 'Football',
    position: 'Striker',
    age: 16,
    location: 'Guwahati, Assam',
    coordinates: { lat: 26.1445, lng: 91.7362 },
    region: 'East',
    overallScore: 86,
    speed: 92,
    agility: 87,
    jump: 84,
    endurance: 80,
    technique: 85,
    sprintTime: '2.80s',
    topSpeed: '24.9 km/h',
    verified: true,
    academy: 'Brahmaputra Youth Soccer Hub',
    bio: 'Deadly finishing with both feet, sharp acceleration cuts, and great spatial awareness.',
    tier: 'Advanced',
    colorCode: '#9333EA',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'ath-10',
    name: 'Diya Krishnan',
    role: 'athlete',
    sport: 'Athletics',
    position: '400m / 800m Runner',
    age: 17,
    location: 'Kochi, Kerala',
    coordinates: { lat: 9.9312, lng: 76.2673 },
    region: 'South',
    overallScore: 93,
    speed: 94,
    agility: 86,
    jump: 85,
    endurance: 97,
    technique: 90,
    sprintTime: '2.75s',
    topSpeed: '25.3 km/h',
    verified: true,
    academy: 'Malabar Athletic Center of Excellence',
    bio: 'Phenomenal stamina and aerobic engine, maintaining top sprint speeds into the final lap.',
    tier: 'Elite',
    colorCode: '#8B5CF6',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'ath-11',
    name: 'Manish Rawat',
    role: 'athlete',
    sport: 'Kabaddi',
    position: 'Raider',
    age: 19,
    location: 'Jaipur, Rajasthan',
    coordinates: { lat: 26.9124, lng: 75.7873 },
    region: 'North',
    overallScore: 83,
    speed: 86,
    agility: 92,
    jump: 81,
    endurance: 87,
    technique: 84,
    sprintTime: '2.94s',
    topSpeed: '23.1 km/h',
    verified: true,
    academy: 'Desert Warriors Kabaddi Complex',
    bio: 'High-speed toe touches, swift evasive jumps, and powerful lower-body driving force.',
    tier: 'Advanced',
    colorCode: '#9333EA',
    avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'ath-12',
    name: 'Simran Kaur',
    role: 'athlete',
    sport: 'Cricket',
    position: 'All-Rounder',
    age: 17,
    location: 'Amritsar, Punjab',
    coordinates: { lat: 31.6340, lng: 74.8723 },
    region: 'North',
    overallScore: 87,
    speed: 86,
    agility: 88,
    jump: 83,
    endurance: 89,
    technique: 91,
    sprintTime: '2.91s',
    topSpeed: '23.6 km/h',
    verified: true,
    academy: 'Golden State Cricket Arena',
    bio: 'Disciplined swing bowling and aggressive power-hitting in the middle order.',
    tier: 'Advanced',
    colorCode: '#9333EA',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  },

  // ================= COACHES & SCOUTS (YELLOW SPECTRUM) =================
  {
    id: 'coa-1',
    name: 'Coach Jack (AI Director)',
    role: 'coach',
    title: 'National AI Talent Scout Director',
    organization: 'Sport Talent National Scouting Directorate',
    location: 'New Delhi, Delhi NCR',
    coordinates: { lat: 28.5355, lng: 77.2410 },
    region: 'North',
    experienceYears: 16,
    scoutedTalentsCount: 420,
    specialization: 'Multi-Sport Biomechanics & Computer Vision Scouting',
    activeRosterSize: 34,
    license: 'FIFA Master & Olympic High-Performance certified',
    tier: 'Master Scout',
    colorCode: '#F59E0B',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    linkedAthletes: ['ath-4', 'ath-7', 'ath-11'],
  },
  {
    id: 'coa-2',
    name: 'Coach Sunita Mukherjee',
    role: 'coach',
    title: 'Head Coach & Talent Scout',
    organization: 'Eastern Zone Football Academy',
    location: 'Kolkata, West Bengal',
    coordinates: { lat: 22.5186, lng: 88.3842 },
    region: 'East',
    experienceYears: 12,
    scoutedTalentsCount: 180,
    specialization: 'Youth Football Development & Sprint Velocity',
    activeRosterSize: 22,
    license: 'AFC Pro Coaching License',
    tier: 'Academy Head Coach',
    colorCode: '#EAB308',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    linkedAthletes: ['ath-1', 'ath-9'],
  },
  {
    id: 'coa-3',
    name: 'Coach Marcus Anthony',
    role: 'coach',
    title: 'Sprint & Conditioning Director',
    organization: 'Southern Olympic Center of Excellence',
    location: 'Bengaluru, Karnataka',
    coordinates: { lat: 12.9249, lng: 77.6200 },
    region: 'South',
    experienceYears: 14,
    scoutedTalentsCount: 260,
    specialization: '10m / 40m Sprint Velocity & Kinetic Jump Mechanics',
    activeRosterSize: 28,
    license: 'World Athletics Elite Level 3',
    tier: 'Master Scout',
    colorCode: '#F59E0B',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    linkedAthletes: ['ath-5', 'ath-6', 'ath-10'],
  },
  {
    id: 'coa-4',
    name: 'Coach Rajiv Saxena',
    role: 'coach',
    title: 'Senior Cricket Talent Evaluator',
    organization: 'Western India Talent Pipeline',
    location: 'Mumbai, Maharashtra',
    coordinates: { lat: 18.9894, lng: 72.8340 },
    region: 'West',
    experienceYears: 18,
    scoutedTalentsCount: 310,
    specialization: 'Fast Bowling Mechanics & Dynamic Agility',
    activeRosterSize: 19,
    license: 'BCCI Level 3 High Performance Coach',
    tier: 'Master Scout',
    colorCode: '#F59E0B',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    linkedAthletes: ['ath-2', 'ath-3', 'ath-8'],
  },
  {
    id: 'coa-5',
    name: 'Coach Devendra Chahal',
    role: 'coach',
    title: 'High Performance Jump & Agility Specialist',
    organization: 'Northern Track & Field Combine',
    location: 'Chandigarh, Punjab',
    coordinates: { lat: 30.7410, lng: 76.7682 },
    region: 'North',
    experienceYears: 9,
    scoutedTalentsCount: 140,
    specialization: 'Vertical Leap Elevation & Plyometrics',
    activeRosterSize: 16,
    license: 'NS NIS Athletics Gold Specialist',
    tier: 'Performance Specialist',
    colorCode: '#FACC15',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    linkedAthletes: ['ath-7', 'ath-12'],
  },
];

// Helper: Calculate regional aggregates
function calculateRegionalStats(items) {
  const regions = ['North', 'South', 'East', 'West'];
  const summary = {};

  regions.forEach((reg) => {
    const regAthletes = items.filter((i) => i.role === 'athlete' && i.region === reg);
    const regCoaches = items.filter((i) => i.role === 'coach' && i.region === reg);

    const avgScore = regAthletes.length
      ? Math.round(regAthletes.reduce((acc, a) => acc + a.overallScore, 0) / regAthletes.length)
      : 0;

    const topSpeed = regAthletes.length
      ? Math.max(...regAthletes.map((a) => parseFloat(a.topSpeed.replace(' km/h', ''))))
      : 0;

    const maxJump = regAthletes.length
      ? Math.max(...regAthletes.map((a) => a.jump))
      : 0;

    const regionNames = {
      North: 'North India (Delhi ┬╖ Punjab ┬╖ Jaipur)',
      South: 'South India (Bengaluru ┬╖ Kerala ┬╖ Hyd)',
      East: 'East India (Kolkata ┬╖ Assam ┬╖ Bengal)',
      West: 'West India (Mumbai ┬╖ Gujarat ┬╖ Pune)',
    };

    summary[reg] = {
      region: regionNames[reg] || reg,
      athleteCount: regAthletes.length,
      coachCount: regCoaches.length,
      coachToAthleteRatio: regCoaches.length ? `1 : ${(regAthletes.length / regCoaches.length).toFixed(1)}` : 'N/A',
      avgScore,
      topSpeed: `${topSpeed.toFixed(1)} km/h`,
      maxJumpScore: maxJump,
      densityIndex: Math.min(100, (regAthletes.length * 15) + (regCoaches.length * 10)),
    };
  });

  return summary;
}

// -------------------------------------------------------------
// ROUTES
// -------------------------------------------------------------

// @route   GET /api/v1/plugins/geospatial/ping
router.get('/ping', (req, res) => {
  res.status(200).json({
    success: true,
    plugin: 'Geospatial Statistics Radar',
    version: '1.0.0',
    status: 'ACTIVE',
    timestamp: new Date().toISOString(),
  });
});

// @route   GET /api/v1/plugins/geospatial/data
router.get('/data', (req, res) => {
  const athletes = talentHubs.filter((item) => item.role === 'athlete');
  const coaches = talentHubs.filter((item) => item.role === 'coach');

  res.status(200).json({
    success: true,
    totalRecords: talentHubs.length,
    athletesCount: athletes.length,
    coachesCount: coaches.length,
    colorLegend: {
      athletes: {
        role: 'athlete',
        baseTone: 'Purple Shades',
        tiers: [
          { label: 'Elite (90+)', color: '#8B5CF6' },
          { label: 'Advanced (80-89)', color: '#7C3AED' },
          { label: 'Rising (70-79)', color: '#9333EA' },
          { label: 'Developing (<70)', color: '#C4B5FD' },
        ],
      },
      coaches: {
        role: 'coach',
        baseTone: 'Yellow Shades',
        tiers: [
          { label: 'Master Scout', color: '#F59E0B' },
          { label: 'Academy Head Coach', color: '#EAB308' },
          { label: 'Performance Specialist', color: '#FACC15' },
          { label: 'Club Scout', color: '#FEF08A' },
        ],
      },
    },
    items: talentHubs,
  });
});

// @route   GET /api/v1/plugins/geospatial/heatmap
router.get('/heatmap', (req, res) => {
  // Convert athletes to heatmap format
  const heatmapData = talentHubs
    .filter(item => item.role === 'athlete')
    .map(item => ({
      lat: item.coordinates.lat,
      lng: item.coordinates.lng,
      weight: item.overallScore ? item.overallScore / 100 : 0.5,
      name: item.location
    }));

  res.status(200).json(heatmapData);
});

// @route   GET /api/v1/plugins/geospatial/stats
router.get('/stats', (req, res) => {
  const regionalSummary = calculateRegionalStats(talentHubs);
  const totalAthletes = talentHubs.filter((i) => i.role === 'athlete').length;
  const totalCoaches = talentHubs.filter((i) => i.role === 'coach').length;
  const verifiedCount = talentHubs.filter((i) => i.verified).length;

  res.status(200).json({
    success: true,
    summary: {
      totalAthletes,
      totalCoaches,
      verifiedAthletes: verifiedCount,
      nationalCoverageRatio: `1 Coach : ${(totalAthletes / totalCoaches).toFixed(1)} Athletes`,
      nationalAvgTalentRating: Math.round(
        talentHubs.filter((i) => i.role === 'athlete').reduce((a, b) => a + b.overallScore, 0) / totalAthletes
      ),
      fastestRecordedSprint: '2.62s (Rohan Verma ┬╖ Delhi)',
      highestRecordedJump: '97 rating / 82cm (Vikramjit Singh ┬╖ Chandigarh)',
    },
    regionalStats: regionalSummary,
  });
});

// @route   POST /api/v1/plugins/geospatial/filter
router.post('/filter', (req, res) => {
  const { role, sport, minScore, query, region } = req.body || {};

  let results = [...talentHubs];

  if (role && role !== 'all') {
    results = results.filter((item) => item.role === role);
  }

  if (sport && sport !== 'All') {
    results = results.filter((item) => item.sport === sport || item.specialization?.includes(sport));
  }

  if (minScore && Number(minScore) > 0) {
    results = results.filter((item) => (item.overallScore || 80) >= Number(minScore));
  }

  if (region && region !== 'All') {
    results = results.filter((item) => item.region === region);
  }

  if (query && query.trim() !== '') {
    const q = query.toLowerCase().trim();
    results = results.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        (item.sport && item.sport.toLowerCase().includes(q)) ||
        (item.academy && item.academy.toLowerCase().includes(q)) ||
        (item.organization && item.organization.toLowerCase().includes(q))
    );
  }

  res.status(200).json({
    success: true,
    count: results.length,
    results,
  });
});

module.exports = router;
