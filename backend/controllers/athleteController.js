// controllers/athleteController.js, Sensei
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAthleteProfile = async (req, res) => {
  try {
    const userId = req.user.uid;
    const profile = await prisma.profile.findUnique({
      where: { user_id: userId }
    });
    
    if (!profile) {
      return res.status(404).json({ message: 'Athlete profile not found, Sensei' });
    }
    
    res.status(200).json({
      ...profile,
      name: profile.full_name || '',
      primarySport: profile.sport || 'Football',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateAthleteProfile = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { name, full_name, location, sport, primarySport, position } = req.body;
    const fullName = name || full_name || '';
    const selectedSport = sport || primarySport || 'Football';
    
    const profile = await prisma.profile.upsert({
      where: { user_id: userId },
      update: {
        full_name: fullName,
        location,
        sport: selectedSport,
        position,
      },
      create: {
        user_id: userId,
        full_name: fullName,
        location,
        sport: selectedSport,
        position,
      }
    });
    
    res.status(200).json({
      message: 'Athlete profile updated successfully, Sensei',
      profile: {
        ...profile,
        name: profile.full_name || '',
        primarySport: profile.sport || 'Football',
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAthleteProfile, updateAthleteProfile };
