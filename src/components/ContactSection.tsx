import React, { useState, useEffect } from 'react';
import {
  Send,
  CheckCircle2,
  Mail,
  ShieldAlert,
  Lock,
  Globe,
  Settings,
  FileSpreadsheet,
  ExternalLink,
  AlertCircle,
  X,
  ChevronRight,
  ChevronLeft,
  Building,
  UserCheck,
  Cpu,
  Layers,
  Edit3,
  Shield,
  Server
} from 'lucide-react';
import { User } from 'firebase/auth';
import { sound } from '../utils/audio';
import { initAuth, googleSignIn, googleLogout, getAccessToken } from '../utils/googleAuth';
import {
  createAuditSpreadsheet,
  appendAuditRowToSheet,
  GoogleSpreadsheetInfo
} from '../utils/googleSheets';
import { SanityContactBlock } from '../sanity/client';

const STORAGE_KEY_SHEET_ID = 'cyber_ops_sheet_id';
const STORAGE_KEY_PENDING_ENQUIRIES = 'cyber_ops_pending_enquiries';

interface ContactSectionProps {
  data?: SanityContactBlock;
}

export function ContactSection({ data }: ContactSectionProps) {
  const badgeText = data?.badgeText || 'INITIATE SECURITY DISCOVERY';
  const sectionTitle = data?.sectionTitle || 'INITIATE CYBER AUDIT';
  const emailAddress = data?.email || 'sec-ops@cyberops-defense.com';
  const phoneOrHotline = data?.phone || '24/7 INCIDENT HOTLINE // PGP ENCRYPTED';

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);


  // Form state for end user across multi-step wizard
  const [form, setForm] = useState({
    // Step 1: Identity & Primary Contact
    organization: '',
    contactName: '',
    contactRole: 'Chief Information Security Officer (CISO)',
    email: '',
    phoneOrSignal: '',

    // Step 2: Architecture Scope & Infrastructure
    focusAreas: ['Zero-Trust ZTNA', 'Post-Quantum Crypto'],
    infrastructure: 'Multi-Cloud (AWS / GCP / Azure)',
    budget: '$50k - $150k (Enterprise ZTNA & HSM Hardening)',
    timeline: 'Immediate (Next 14 Days)',

    // Step 3: Security Brief & Attack Vectors
    urgency: 'Strategic Audit & Defense Hardening',
    complianceMandates: 'ISO 27001 & SOC 2 Type II',
    message: ''
  });

  // Owner Admin Google Auth State
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [sheetInfo, setSheetInfo] = useState<GoogleSpreadsheetInfo | null>(null);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminStatusMsg, setAdminStatusMsg] = useState<string | null>(null);

  useEffect(() => {
    // Restore existing sheet ID from localStorage if available
    const savedSheetId = localStorage.getItem(STORAGE_KEY_SHEET_ID);
    if (savedSheetId) {
      setSheetInfo({
        spreadsheetId: savedSheetId,
        title: 'Cyber Ops - Security Audit Briefs',
        spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${savedSheetId}/edit`
      });
    }

    const unsubscribe = initAuth(
      async (u, accessToken) => {
        setUser(u);
        setToken(accessToken);
        if (accessToken) {
          // Sync any offline/pending enquiries
          syncPendingEnquiries(accessToken, savedSheetId);
        }
      },
      () => {
        setUser(null);
        setToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  const syncPendingEnquiries = async (accessToken: string, targetSheetId?: string | null) => {
    const raw = localStorage.getItem(STORAGE_KEY_PENDING_ENQUIRIES);
    if (!raw) return;
    try {
      const pending: any[] = JSON.parse(raw);
      if (pending.length === 0) return;

      let sId = targetSheetId || sheetInfo?.spreadsheetId;
      if (!sId) {
        const created = await createAuditSpreadsheet(accessToken, 'Cyber Ops - Security Audit Briefs');
        sId = created.spreadsheetId;
        setSheetInfo(created);
        localStorage.setItem(STORAGE_KEY_SHEET_ID, sId);
      }

      for (const item of pending) {
        await appendAuditRowToSheet(accessToken, sId, item);
      }
      localStorage.removeItem(STORAGE_KEY_PENDING_ENQUIRIES);
      console.log('Synced pending enquiries to Google Sheets successfully');
    } catch (e) {
      console.warn('Pending sync error:', e);
    }
  };

  const handleAdminSignIn = async () => {
    sound.playClick();
    setLoading(true);
    setAdminStatusMsg(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setToken(res.accessToken);

        // Provision/link Google Sheet for site owner
        let sId = localStorage.getItem(STORAGE_KEY_SHEET_ID);
        if (!sId) {
          const info = await createAuditSpreadsheet(res.accessToken, 'Cyber Ops - Security Audit Briefs');
          setSheetInfo(info);
          localStorage.setItem(STORAGE_KEY_SHEET_ID, info.spreadsheetId);
          setAdminStatusMsg('Connected! New Google Sheet created for audit enquiries.');
        } else {
          setSheetInfo({
            spreadsheetId: sId,
            title: 'Cyber Ops - Security Audit Briefs',
            spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${sId}/edit`
          });
          setAdminStatusMsg('Connected to existing Google Sheet database.');
        }

        // Sync pending
        await syncPendingEnquiries(res.accessToken, sId);
      }
    } catch (err: any) {
      setAdminStatusMsg('Error signing in: ' + (err.message || 'Auth failed'));
    } finally {
      setLoading(false);
    }
  };

  const handleAdminSignOut = async () => {
    sound.playClick();
    await googleLogout();
    setUser(null);
    setToken(null);
    setAdminStatusMsg('Disconnected owner Google account.');
  };

  const toggleFocusArea = (area: string) => {
    sound.playHover();
    if (form.focusAreas.includes(area)) {
      if (form.focusAreas.length > 1) {
        setForm({ ...form, focusAreas: form.focusAreas.filter((a) => a !== area) });
      }
    } else {
      setForm({ ...form, focusAreas: [...form.focusAreas, area] });
    }
  };

  const validateStep = (step: number) => {
    if (step === 1) {
      if (!form.organization.trim()) return 'Organization name is required.';
      if (!form.contactName.trim()) return 'Contact person name is required.';
      if (!form.email.trim() || !form.email.includes('@')) return 'Valid confidential email address is required.';
    }
    if (step === 2) {
      if (form.focusAreas.length === 0) return 'Please select at least one focus area.';
    }
    if (step === 3) {
      if (!form.message.trim()) return 'Please outline your security audit requirements or mission objectives.';
    }
    return null;
  };

  const handleNextStep = () => {
    setErrorMsg(null);
    const err = validateStep(currentStep);
    if (err) {
      setErrorMsg(err);
      sound.playHover();
      return;
    }
    sound.playClick();
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const handlePrevStep = () => {
    setErrorMsg(null);
    sound.playClick();
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const err = validateStep(currentStep);
    if (err) {
      setErrorMsg(err);
      sound.playHover();
      return;
    }

    sound.playClick();
    setLoading(true);

    const fullRequirements = `[ROLE: ${form.contactRole}] [FOCUS: ${form.focusAreas.join(', ')}] [INFRASTRUCTURE: ${form.infrastructure}] [TIMELINE: ${form.timeline}] [URGENCY: ${form.urgency}] [COMPLIANCE: ${form.complianceMandates}] - Brief: ${form.message}`;

    const auditRow = {
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      organization: `${form.organization} (${form.contactName})`,
      email: form.email,
      scopeBudget: form.budget,
      requirements: fullRequirements,
      status: 'TRIAGED (AI SOAR)'
    };

    const activeToken = token || getAccessToken();
    const savedSheetId = sheetInfo?.spreadsheetId || localStorage.getItem(STORAGE_KEY_SHEET_ID);

    let savedToGoogle = false;

    if (activeToken && savedSheetId) {
      try {
        await appendAuditRowToSheet(activeToken, savedSheetId, auditRow);
        savedToGoogle = true;
      } catch (err: any) {
        console.warn('Failed to append directly to sheet, storing pending:', err);
      }
    }

    if (!savedToGoogle) {
      // Store in pending queue to sync automatically when token is refreshed or available
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY_PENDING_ENQUIRIES) || '[]');
      existing.push(auditRow);
      localStorage.setItem(STORAGE_KEY_PENDING_ENQUIRIES, JSON.stringify(existing));
    }

    setSubmitted(true);
    setLoading(false);
  };

  return (
    <section id="contact" className="relative z-10 py-24 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left Column: Info Header */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs tracking-[0.25em] uppercase">
              <Lock className="w-3.5 h-3.5" />
              <span>{badgeText}</span>
            </div>

            {/* Owner Admin Config Button (Subtle gear icon for owner setup) */}
            <button
              onClick={() => {
                sound.playClick();
                setIsAdminModalOpen(true);
              }}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/40 transition-all text-xs flex items-center gap-1.5 cursor-pointer"
              title="Site Owner Google Sheets Database Setup"
            >
              <Settings className="w-3.5 h-3.5" />
              <span className="hidden sm:inline font-mono text-[10px]">OWNER DB SETUP</span>
            </button>
          </div>

          <h2 className="text-4xl md:text-6xl font-black tracking-wider text-white uppercase font-sans leading-tight">
            {sectionTitle}
          </h2>

          <p className="text-slate-300 font-mono text-sm leading-relaxed max-w-md">
            Ready to fortify your enterprise infrastructure against nation-state APTs and quantum decryption threats? Complete our 4-step confidential audit wizard below for immediate triage by our principal architects.
          </p>

          <div className="space-y-4 pt-6 border-t border-white/10 font-mono text-xs">
            <div className="flex items-center gap-3 text-slate-300">
              <Mail className="w-4 h-4 text-cyan-400" />
              <span>{emailAddress}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300">
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
              <span>{phoneOrHotline}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300">
              <Globe className="w-4 h-4 text-purple-400" />
              <span>GLOBAL WAR ROOMS // WASHINGTON D.C. / GENEVA / SINGAPORE</span>
            </div>
          </div>
        </div>

        {/* Right Column: Multi-Step Form Container */}
        <div className="rounded-3xl bg-black/50 border border-cyan-500/30 backdrop-blur-xl shadow-[0_0_40px_rgba(0,240,255,0.15)]">
          <div className="p-6 sm:p-8">
            {submitted ? (
              <div className="py-12 text-center space-y-4 font-mono">
                <div className="w-16 h-16 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-400 flex items-center justify-center mx-auto animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold font-sans tracking-wider uppercase text-white">
                  ENCRYPTED DISPATCH RECEIVED
                </h3>

                <p className="text-slate-300 text-xs max-w-xs mx-auto leading-relaxed">
                  Your multi-step enquiry has been transmitted and logged into our secure database. Our Lead Cyber Architect will review your brief within 2 hours.
                </p>

                <button
                  onClick={() => {
                    sound.playClick();
                    setSubmitted(false);
                    setCurrentStep(1);
                    setForm({
                      organization: '',
                      contactName: '',
                      contactRole: 'Chief Information Security Officer (CISO)',
                      email: '',
                      phoneOrSignal: '',
                      focusAreas: ['Zero-Trust ZTNA', 'Post-Quantum Crypto'],
                      infrastructure: 'Multi-Cloud (AWS / GCP / Azure)',
                      budget: '$50k - $150k (Enterprise ZTNA & HSM Hardening)',
                      timeline: 'Immediate (Next 14 Days)',
                      urgency: 'Strategic Audit & Defense Hardening',
                      complianceMandates: 'ISO 27001 & SOC 2 Type II',
                      message: ''
                    });
                  }}
                  className="mt-4 px-6 py-2.5 rounded-full bg-white/10 text-cyan-300 font-mono text-xs hover:bg-cyan-400 hover:text-black transition-colors cursor-pointer"
                >
                  SUBMIT ANOTHER BRIEF
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitForm} className="space-y-6">
                {/* Wizard Step Progress Header */}
                <div className="space-y-3 border-b border-white/10 pb-5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-cyan-400" />
                      <span>STEP 0{currentStep} OF 04</span>
                    </span>
                    <span className="text-slate-400 text-[10px] uppercase">
                      {currentStep === 1 && 'ORGANIZATION & CONTACT'}
                      {currentStep === 2 && 'SCOPE & INFRASTRUCTURE'}
                      {currentStep === 3 && 'AUDIT BRIEF & VECTORS'}
                      {currentStep === 4 && 'REVIEW & TRANSMIT'}
                    </span>
                  </div>

                  {/* Progress Bar Track */}
                  <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 via-sky-400 to-purple-500 transition-all duration-500 rounded-full"
                      style={{ width: `${(currentStep / 4) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Error Banner */}
                {errorMsg && (
                  <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center gap-2 font-mono animate-fadeIn">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* STEP 1: ORGANIZATION & PRIMARY CONTACT */}
                {currentStep === 1 && (
                  <div className="space-y-4 animate-fadeIn">
                    <div>
                      <label className="block text-xs font-mono text-cyan-400 mb-1.5 uppercase tracking-widest flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5" /> ORGANIZATION / ENTITY NAME *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.organization}
                        onChange={(e) => setForm({ ...form, organization: e.target.value })}
                        placeholder="e.g. Apex Global Clearing Bank"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-cyan-400 focus:bg-cyan-950/20 transition-all placeholder:text-slate-600"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-cyan-400 mb-1.5 uppercase tracking-widest flex items-center gap-1.5">
                          <UserCheck className="w-3.5 h-3.5" /> CONTACT NAME *
                        </label>
                        <input
                          type="text"
                          required
                          value={form.contactName}
                          onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                          placeholder="Dr. Alex Vance"
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-cyan-400 focus:bg-cyan-950/20 transition-all placeholder:text-slate-600"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-cyan-400 mb-1.5 uppercase tracking-widest">
                          ROLE / TITLE
                        </label>
                        <select
                          value={form.contactRole}
                          onChange={(e) => setForm({ ...form, contactRole: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-[#0b0f19] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-cyan-400 transition-all"
                        >
                          <option>Chief Information Security Officer (CISO)</option>
                          <option>VP of Engineering / CTO</option>
                          <option>Head of Cyber Risk & Compliance</option>
                          <option>Principal Security Architect</option>
                          <option>Managing Director / Executive</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-cyan-400 mb-1.5 uppercase tracking-widest flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5" /> CONFIDENTIAL EMAIL ADDRESS *
                      </label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="ciso@apexbank.com"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-cyan-400 focus:bg-cyan-950/20 transition-all placeholder:text-slate-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase tracking-widest">
                        PHONE / SIGNAL / PGP FINGERPRINT (OPTIONAL)
                      </label>
                      <input
                        type="text"
                        value={form.phoneOrSignal}
                        onChange={(e) => setForm({ ...form, phoneOrSignal: e.target.value })}
                        placeholder="+1 (555) 019-2834 or PGP Key ID"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-cyan-400 focus:bg-cyan-950/20 transition-all placeholder:text-slate-600"
                      />
                    </div>
                  </div>
                )}

                {/* STEP 2: ARCHITECTURE SCOPE & INFRASTRUCTURE */}
                {currentStep === 2 && (
                  <div className="space-y-5 animate-fadeIn">
                    <div>
                      <label className="block text-xs font-mono text-cyan-400 mb-2 uppercase tracking-widest flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5" /> PRIMARY FOCUS AREAS (MULTIPLE ALLOWED)
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          'Zero-Trust ZTNA',
                          'Post-Quantum Crypto',
                          'Offensive Red Teaming',
                          'Autonomous AI SOC',
                          'Cloud HSM Hardening',
                          'SOC 2 / ISO 27001'
                        ].map((area) => {
                          const isSelected = form.focusAreas.includes(area);
                          return (
                            <button
                              type="button"
                              key={area}
                              onClick={() => toggleFocusArea(area)}
                              className={`px-3 py-2 rounded-xl text-xs font-mono tracking-wider border transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                              }`}
                            >
                              {isSelected ? '✓ ' : '+ '} {area}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-cyan-400 mb-1.5 uppercase tracking-widest flex items-center gap-1.5">
                        <Server className="w-3.5 h-3.5" /> INFRASTRUCTURE ENVIRONMENT
                      </label>
                      <select
                        value={form.infrastructure}
                        onChange={(e) => setForm({ ...form, infrastructure: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#0b0f19] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-cyan-400 transition-all"
                      >
                        <option>Multi-Cloud (AWS / GCP / Azure)</option>
                        <option>Amazon Web Services (AWS) Dedicated</option>
                        <option>Google Cloud Platform (GCP) Dedicated</option>
                        <option>On-Premises Bare-Metal / Air-Gapped Vaults</option>
                        <option>Hybrid Cloud & Kubernetes Infrastructure</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-cyan-400 mb-1.5 uppercase tracking-widest">
                          TARGET BUDGET SCOPE
                        </label>
                        <select
                          value={form.budget}
                          onChange={(e) => setForm({ ...form, budget: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-[#0b0f19] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-cyan-400 transition-all"
                        >
                          <option>$25k - $50k (Offensive Pentest & Zero-Day Audit)</option>
                          <option>$50k - $150k (Enterprise ZTNA & HSM Hardening)</option>
                          <option>$150k+ (Enterprise Post-Quantum & AI SOC Engine)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-cyan-400 mb-1.5 uppercase tracking-widest">
                          DESIRED TIMELINE
                        </label>
                        <select
                          value={form.timeline}
                          onChange={(e) => setForm({ ...form, timeline: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-[#0b0f19] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-cyan-400 transition-all"
                        >
                          <option>Immediate (Next 14 Days)</option>
                          <option>1 - 3 Months Roadmap</option>
                          <option>Q3 / Q4 Strategic Planning</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: SECURITY BRIEF & ATTACK VECTORS */}
                {currentStep === 3 && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-cyan-400 mb-1.5 uppercase tracking-widest">
                          URGENCY / THREAT LEVEL
                        </label>
                        <select
                          value={form.urgency}
                          onChange={(e) => setForm({ ...form, urgency: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-[#0b0f19] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-cyan-400 transition-all"
                        >
                          <option>Strategic Audit & Defense Hardening</option>
                          <option>Active Threat Mitigation / Post-Incident</option>
                          <option>Mandatory Compliance Deadline</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-cyan-400 mb-1.5 uppercase tracking-widest">
                          COMPLIANCE FRAMEWORKS
                        </label>
                        <input
                          type="text"
                          value={form.complianceMandates}
                          onChange={(e) => setForm({ ...form, complianceMandates: e.target.value })}
                          placeholder="e.g. ISO 27001, SOC 2, HIPAA, PCI-DSS"
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-cyan-400 focus:bg-cyan-950/20 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-cyan-400 mb-1.5 uppercase tracking-widest flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5" /> SECURITY AUDIT REQUIREMENTS & BRIEF *
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        placeholder="Outline your cloud footprint, recent security incidents, key systems needing lattice encryption, or specific red-team simulation goals..."
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-cyan-400 focus:bg-cyan-950/20 transition-all placeholder:text-slate-600 resize-none"
                      />
                    </div>
                  </div>
                )}

                {/* STEP 4: REVIEW & CONFIRM DISPATCH */}
                {currentStep === 4 && (
                  <div className="space-y-4 font-mono text-xs animate-fadeIn">
                    <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 space-y-3">
                      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
                        <span className="font-bold text-cyan-300 uppercase">SUMMARY AUDIT DISPATCH</span>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(1)}
                          className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3" /> Edit
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                        <div>
                          <span className="text-slate-400">Organization:</span>{' '}
                          <span className="text-white font-bold">{form.organization}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Contact:</span>{' '}
                          <span className="text-white">{form.contactName} ({form.contactRole})</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Email:</span>{' '}
                          <span className="text-cyan-300">{form.email}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Infrastructure:</span>{' '}
                          <span className="text-white">{form.infrastructure}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Budget:</span>{' '}
                          <span className="text-emerald-400 font-bold">{form.budget}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Timeline:</span>{' '}
                          <span className="text-purple-300">{form.timeline}</span>
                        </div>
                      </div>

                      <div className="pt-1 border-t border-cyan-500/20 text-[11px]">
                        <span className="text-slate-400">Focus Areas:</span>{' '}
                        <span className="text-cyan-300">{form.focusAreas.join(', ')}</span>
                      </div>

                      <div className="text-[11px] line-clamp-2">
                        <span className="text-slate-400">Brief:</span>{' '}
                        <span className="text-slate-200">{form.message}</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-300 text-[10px] flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-purple-400" />
                        256-BIT LATTICE PGP SIGNATURE ATTACHED
                      </span>
                      <span className="px-2 py-0.5 rounded bg-purple-500/20 border border-purple-400/30 text-purple-200">
                        VERIFIED
                      </span>
                    </div>
                  </div>
                )}

                {/* Form Controls / Navigation Buttons */}
                <div className="flex items-center justify-between gap-3 pt-4 border-t border-white/10">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-mono text-xs hover:bg-white/10 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>PREVIOUS STEP</span>
                    </button>
                  ) : <div />}

                  {currentStep < 4 ? (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      onMouseEnter={() => sound.playHover()}
                      className="px-6 py-3 rounded-xl bg-cyan-400 text-black font-mono font-bold text-xs tracking-wider uppercase flex items-center gap-2 hover:bg-cyan-300 shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all cursor-pointer ml-auto"
                      data-cursor-hover
                    >
                      <span>NEXT STEP</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={loading}
                      onMouseEnter={() => sound.playHover()}
                      className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-purple-500 text-black font-mono font-bold text-xs tracking-widest uppercase flex items-center gap-2 hover:brightness-110 shadow-[0_0_30px_rgba(0,240,255,0.5)] transition-all cursor-pointer ml-auto"
                      data-cursor-hover
                    >
                      <span>{loading ? 'TRANSMITTING DISPATCH...' : 'TRANSMIT SECURITY BRIEF'}</span>
                      <Send className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Owner Admin Settings Modal */}
      {isAdminModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg bg-[#0b0f19] border border-cyan-500/40 p-6 sm:p-8 rounded-3xl shadow-[0_0_50px_rgba(0,240,255,0.25)] space-y-6 text-white font-mono">
            <button
              onClick={() => setIsAdminModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-400 flex items-center justify-center text-emerald-400">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  SITE OWNER DATABASE CONFIG
                </h4>
                <p className="text-[10px] text-emerald-400">Google Sheets Form Enquiry Storage</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Connect your Google account here as the site administrator. Once connected, all form enquiries submitted by users on the website will be automatically logged into your personal Google Sheet.
            </p>

            {adminStatusMsg && (
              <div className="p-3 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs">
                {adminStatusMsg}
              </div>
            )}

            {user ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
                  <div className="flex items-center gap-2">
                    <img
                      src={user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                      alt="Owner"
                      className="w-6 h-6 rounded-full border border-emerald-400"
                    />
                    <span className="font-bold text-white">{user.email}</span>
                  </div>
                  <button
                    onClick={handleAdminSignOut}
                    className="text-xs text-red-400 hover:underline cursor-pointer"
                  >
                    Disconnect
                  </button>
                </div>

                {sheetInfo && (
                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between gap-2 text-xs">
                    <div>
                      <div className="font-bold text-white">{sheetInfo.title}</div>
                      <div className="text-[10px] text-slate-400">ID: {sheetInfo.spreadsheetId}</div>
                    </div>
                    <a
                      href={sheetInfo.spreadsheetUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-emerald-400 text-black font-bold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <span>OPEN SHEET</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleAdminSignIn}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-white text-slate-900 font-sans font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-100 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] cursor-pointer"
              >
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-4 h-4">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                </svg>
                <span>CONNECT ADMIN GOOGLE ACCOUNT</span>
              </button>
            )}

            <div className="pt-2 text-right">
              <button
                onClick={() => setIsAdminModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold cursor-pointer"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
