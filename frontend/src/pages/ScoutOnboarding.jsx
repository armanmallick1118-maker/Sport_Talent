import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const input = 'mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500';

export default function ScoutOnboarding() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ organization: '', organization_type: 'Club', sports: '', specialization: '', region: '', bio: '', experience_years: '', metrics_sought: '', contact_email: '', linkedin_url: '' });
  const [credential, setCredential] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const submit = async (event) => {
    event.preventDefault(); setError(''); setSaving(true);
    try {
      await API.put('/api/v1/scouts/me', { ...form, experience_years: form.experience_years ? Number(form.experience_years) : null, sports: form.sports.split(',').map((x) => x.trim()).filter(Boolean), specialization: form.specialization.split(',').map((x) => x.trim()).filter(Boolean) });
      if (credential) {
        const body = new FormData(); body.append('credential', credential);
        await API.post('/api/v1/scouts/me/credential', body, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      navigate('/scout/dashboard');
    } catch (err) { setError(err.response?.data?.error || 'Could not save your verification details.'); }
    finally { setSaving(false); }
  };
  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  return <main className="mx-auto max-w-2xl px-4 py-8">
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">Verification required</span>
      <h1 className="mt-4 text-2xl font-semibold text-slate-900">Set up your Scout profile</h1>
      <p className="mt-2 text-sm text-slate-500">Your profile stays hidden from athletes until an administrator verifies your credentials.</p>
      {error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <form onSubmit={submit} className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium text-slate-700">Organisation<input required name="organization" value={form.organization} onChange={update} className={input} placeholder="e.g. Manchester United" /></label>
        <label className="text-sm font-medium text-slate-700">Organisation type<select name="organization_type" value={form.organization_type} onChange={update} className={input}><option>Club</option><option>National</option><option>Independent</option><option>Academy</option></select></label>
        <label className="text-sm font-medium text-slate-700">Sports<input required name="sports" value={form.sports} onChange={update} className={input} placeholder="Football, Cricket" /></label>
        <label className="text-sm font-medium text-slate-700">Region<input required name="region" value={form.region} onChange={update} className={input} placeholder="Kolkata, West Bengal" /></label>
        <label className="text-sm font-medium text-slate-700 sm:col-span-2">Specialisations<input required name="specialization" value={form.specialization} onChange={update} className={input} placeholder="Youth Talent, Goalkeepers" /></label>
        <label className="text-sm font-medium text-slate-700">Years of experience<input min="0" type="number" name="experience_years" value={form.experience_years} onChange={update} className={input} /></label>
        <label className="text-sm font-medium text-slate-700">Contact email<input type="email" name="contact_email" value={form.contact_email} onChange={update} className={input} /></label>
        <label className="text-sm font-medium text-slate-700 sm:col-span-2">LinkedIn URL<input type="url" name="linkedin_url" value={form.linkedin_url} onChange={update} className={input} /></label>
        <label className="text-sm font-medium text-slate-700 sm:col-span-2">What metrics do you look for?<input name="metrics_sought" value={form.metrics_sought} onChange={update} className={input} placeholder="Speed, technical ability, match awareness" /></label>
        <label className="text-sm font-medium text-slate-700 sm:col-span-2">Professional bio<textarea required name="bio" value={form.bio} onChange={update} className={input} rows="4" /></label>
        <label className="text-sm font-medium text-slate-700 sm:col-span-2">Credential for review<input required type="file" accept=".pdf,image/*" onChange={(e) => setCredential(e.target.files?.[0] || null)} className="mt-2 block w-full text-sm" /></label>
        <button disabled={saving} className="sm:col-span-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white disabled:opacity-60">{saving ? 'Submitting…' : 'Submit for verification'}</button>
      </form>
    </div>
  </main>;
}
