import React, { useEffect, useState } from 'react';
import { BadgeCheck, FileText, ShieldCheck, XCircle } from 'lucide-react';
import API from '../services/api';

const statusStyle = {
  PENDING: 'bg-amber-50 text-amber-700',
  VERIFIED: 'bg-emerald-50 text-emerald-700',
  REJECTED: 'bg-red-50 text-red-700',
};

export default function AdminDashboard() {
  const [profiles, setProfiles] = useState([]);
  const [status, setStatus] = useState('PENDING');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const response = await API.get('/api/v1/scouts/admin/verification-queue', { params: { status } });
      setProfiles(response.data);
    } catch (error) {
      setNotice(error.response?.data?.error || 'Could not load the verification queue.');
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [status]);

  const decide = async (id, verification_status) => {
    try {
      await API.patch(`/api/v1/scouts/${id}/verification`, { verification_status });
      setNotice(verification_status === 'VERIFIED' ? 'Scout verified and now visible to athletes.' : 'Scout verification request rejected.');
      setProfiles((current) => current.filter((profile) => profile.id !== id));
    } catch (error) {
      setNotice(error.response?.data?.error || 'Could not update the Scout status.');
    }
  };

  return <main className="mx-auto max-w-5xl px-4 py-8">
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div><p className="text-sm font-semibold text-blue-600">Administration</p><h1 className="mt-1 text-3xl font-semibold tracking-tight">Scout verification</h1><p className="mt-2 text-sm text-slate-500">Approve only credentials you have reviewed. Verified public profiles become discoverable by athletes.</p></div>
      <select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"><option value="PENDING">Pending</option><option value="VERIFIED">Verified</option><option value="REJECTED">Rejected</option></select>
    </div>
    {notice && <p className="mb-4 rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-800">{notice}</p>}
    {loading ? <p className="text-sm text-slate-500">Loading verification requests…</p> : profiles.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">No {status.toLowerCase()} Scout profiles.</div> : <div className="space-y-4">{profiles.map((profile) => <article key={profile.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><div className="flex items-center gap-2"><h2 className="font-semibold text-slate-900">{profile.user.profile?.full_name || 'Unnamed Scout'}</h2><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyle[profile.verification_status]}`}>{profile.verification_status}</span></div><p className="mt-1 text-sm text-slate-500">{profile.user.email} · {profile.organization || 'No organisation'} · {profile.region || 'No region'}</p><p className="mt-3 text-sm leading-6 text-slate-600">{profile.bio || 'No biography supplied.'}</p><div className="mt-3 flex flex-wrap gap-2">{profile.sports.map((item) => <span key={item} className="rounded-full bg-blue-50 px-2.5 py-1 text-xs text-blue-700">{item}</span>)}{profile.specialization.map((item) => <span key={item} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">{item}</span>)}</div></div><div className="flex shrink-0 flex-col gap-2">{profile.credential_url ? <a href={`http://localhost:8000${profile.credential_url}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700"><FileText size={16}/> View credential</a> : <span className="text-xs text-red-600">No credential uploaded</span>}{profile.verification_status === 'PENDING' && <><button onClick={() => decide(profile.id, 'VERIFIED')} className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white"><ShieldCheck size={16}/> Approve</button><button onClick={() => decide(profile.id, 'REJECTED')} className="flex items-center justify-center gap-2 rounded-xl border border-red-200 px-3 py-2 text-sm font-semibold text-red-700"><XCircle size={16}/> Reject</button></>}</div></div></article>)}</div>}
    <div className="mt-6 flex items-center gap-2 text-xs text-slate-500"><BadgeCheck size={15} className="text-blue-600"/> Approval makes a public Scout profile visible in Find Scouts.</div>
  </main>;
}
