const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const publicSelect = {
  id: true, organization: true, organization_type: true, sports: true,
  specialization: true, region: true, bio: true, experience_years: true,
  metrics_sought: true, contact_email: true, linkedin_url: true, verification_status: true,
  user: { select: { profile: { select: { full_name: true, avatar_url: true } } } },
};

const requireRole = (req, res, role) => {
  if (req.user.role !== role) {
    res.status(403).json({ error: 'You do not have permission for this action.' });
    return false;
  }
  return true;
};

const getScouts = async (req, res) => {
  try {
    const { search, sport, region, organization_type } = req.query;
    const where = { verification_status: 'VERIFIED', visibility: 'PUBLIC' };
    if (sport) where.sports = { has: sport };
    if (region) where.region = { contains: region, mode: 'insensitive' };
    if (organization_type) where.organization_type = organization_type;
    if (search) {
      where.OR = [
        { organization: { contains: search, mode: 'insensitive' } },
        { specialization: { has: search } },
        { user: { profile: { full_name: { contains: search, mode: 'insensitive' } } } },
      ];
    }
    const scouts = await prisma.scoutProfile.findMany({ where, select: publicSelect, orderBy: { updated_at: 'desc' } });
    res.json(scouts);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const getScoutById = async (req, res) => {
  try {
    const scout = await prisma.scoutProfile.findFirst({
      where: { id: req.params.id, verification_status: 'VERIFIED', visibility: 'PUBLIC' }, select: publicSelect,
    });
    if (!scout) return res.status(404).json({ error: 'Scout not found.' });
    res.json(scout);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const getMyProfile = async (req, res) => {
  if (!requireRole(req, res, 'scout')) return;
  const profile = await prisma.scoutProfile.findUnique({ where: { user_id: req.user.uid } });
  res.json(profile);
};

const updateMyProfile = async (req, res) => {
  if (!requireRole(req, res, 'scout')) return;
  try {
    const fields = ['organization', 'organization_type', 'region', 'bio', 'experience_years', 'metrics_sought', 'contact_email', 'linkedin_url', 'visibility'];
    const data = Object.fromEntries(fields.filter((field) => req.body[field] !== undefined).map((field) => [field, req.body[field]]));
    for (const field of ['sports', 'specialization']) if (Array.isArray(req.body[field])) data[field] = req.body[field];
    const profile = await prisma.scoutProfile.upsert({
      where: { user_id: req.user.uid }, update: data,
      create: { user_id: req.user.uid, sports: data.sports || [], specialization: data.specialization || [], ...data },
    });
    res.json(profile);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const uploadCredential = async (req, res) => {
  if (!requireRole(req, res, 'scout')) return;
  if (!req.file) return res.status(400).json({ error: 'Please choose a credential file.' });
  const profile = await prisma.scoutProfile.update({ where: { user_id: req.user.uid }, data: { credential_url: `/uploads/${req.file.filename}`, verification_status: 'PENDING' } });
  res.json(profile);
};

const updateVerification = async (req, res) => {
  if (!requireRole(req, res, 'admin')) return;
  const status = req.body.verification_status;
  if (!['PENDING', 'VERIFIED', 'REJECTED'].includes(status)) return res.status(400).json({ error: 'Invalid verification status.' });
  const profile = await prisma.scoutProfile.update({ where: { id: req.params.id }, data: { verification_status: status } });
  res.json(profile);
};

const getVerificationQueue = async (req, res) => {
  if (!requireRole(req, res, 'admin')) return;
  try {
    const profiles = await prisma.scoutProfile.findMany({
      where: req.query.status ? { verification_status: req.query.status } : undefined,
      select: {
        id: true, organization: true, organization_type: true, sports: true,
        specialization: true, region: true, bio: true, experience_years: true,
        contact_email: true, linkedin_url: true, credential_url: true,
        verification_status: true, visibility: true, created_at: true,
        user: { select: { email: true, profile: { select: { full_name: true } } } },
      },
      orderBy: { created_at: 'asc' },
    });
    res.json(profiles);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const requestEvaluation = async (req, res) => {
  if (!requireRole(req, res, 'athlete')) return;
  const scout = await prisma.scoutProfile.findFirst({ where: { id: req.params.id, verification_status: 'VERIFIED', visibility: 'PUBLIC' } });
  if (!scout) return res.status(404).json({ error: 'Scout not found.' });
  const request = await prisma.evaluationRequest.create({ data: { athlete_id: req.user.uid, scout_profile_id: scout.id, message: req.body.message, assessment_data: req.body.assessment_data ? JSON.stringify(req.body.assessment_data) : null } });
  res.status(201).json(request);
};

module.exports = { getScouts, getScoutById, getMyProfile, updateMyProfile, uploadCredential, updateVerification, getVerificationQueue, requestEvaluation };
