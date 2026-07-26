import React, { useState } from 'react';
import { Database, ExternalLink, Code, RefreshCw, Settings, CheckCircle2, ShieldCheck } from 'lucide-react';
import { projectId, dataset, studioUrl, apiVersion } from './client';

interface SanityVisualEditorBarProps {
  onRefreshData: () => void;
  isLoading: boolean;
  pageData: any;
}

export function SanityVisualEditorBar({ onRefreshData, isLoading, pageData }: SanityVisualEditorBarProps) {
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-[#0d1527]/90 border border-cyan-500/40 backdrop-blur-xl px-3.5 py-2 rounded-xl text-xs font-mono shadow-[0_10px_25px_rgba(0,240,255,0.25)] text-white">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-cyan-300 font-bold hidden sm:inline">SANITY STEGA CMS</span>
          <span className="text-slate-400 text-[10px] hidden md:inline">({projectId}:{dataset})</span>
        </div>

        <div className="h-3 w-px bg-white/20 mx-1" />

        <button
          onClick={onRefreshData}
          disabled={isLoading}
          className="p-1 rounded hover:bg-white/10 text-cyan-400 transition-colors cursor-pointer flex items-center gap-1"
          title="Re-query Sanity GROQ"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-cyan-300' : ''}`} />
          <span className="hidden sm:inline text-[10px]">SYNC</span>
        </button>

        <button
          onClick={() => setShowJsonModal(true)}
          className="p-1 rounded hover:bg-white/10 text-purple-400 transition-colors cursor-pointer flex items-center gap-1"
          title="View Sanity GROQ JSON schema"
        >
          <Code className="w-3.5 h-3.5" />
          <span className="hidden sm:inline text-[10px]">GROQ JSON</span>
        </button>

        <button
          onClick={() => setShowConfigModal(true)}
          className="p-1 rounded hover:bg-white/10 text-emerald-400 transition-colors cursor-pointer flex items-center gap-1"
          title="Sanity Connection Settings"
        >
          <Settings className="w-3.5 h-3.5" />
          <span className="hidden sm:inline text-[10px]">CONFIG</span>
        </button>

        <a
          href={studioUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-2.5 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/30 flex items-center gap-1.5 text-[10px] transition-all font-bold"
        >
          <span>SANITY STUDIO</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* JSON Modal */}
      {showJsonModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#0b0f19] border border-cyan-500/40 rounded-2xl p-6 max-w-3xl w-full max-h-[80vh] flex flex-col font-mono text-xs shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2 text-cyan-300 font-bold">
                <Database className="w-4 h-4 text-cyan-400" />
                <span>SANITY PAGE BUILDER GROQ RESULT</span>
              </div>
              <button
                onClick={() => setShowJsonModal(false)}
                className="text-slate-400 hover:text-white text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-auto bg-black/60 p-4 rounded-xl text-emerald-400 text-[11px] leading-relaxed border border-white/5">
              <pre>{JSON.stringify(pageData, null, 2)}</pre>
            </div>
            <div className="mt-4 flex justify-between items-center text-[10px] text-slate-400 pt-2 border-t border-white/5">
              <span>Stega Click-to-edit Metadata Active</span>
              <button
                onClick={() => setShowJsonModal(false)}
                className="px-4 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 cursor-pointer"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sanity Studio Connection Config Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#0b0f19] border border-cyan-500/40 rounded-2xl p-6 max-w-2xl w-full flex flex-col font-mono text-xs shadow-2xl text-white space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2 text-cyan-300 font-bold">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                <span className="text-sm">SANITY STUDIO CONNECTION DISCOVERY</span>
              </div>
              <button
                onClick={() => setShowConfigModal(false)}
                className="text-slate-400 hover:text-white text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <div className="text-[10px] text-slate-400 uppercase tracking-widest">Active Connection Status</div>
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>CONNECTED TO SANITY CLIENT (STEGA READY)</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-black/60 border border-white/10">
                  <div className="text-[10px] text-slate-400 uppercase">PROJECT ID</div>
                  <div className="text-cyan-300 font-bold font-mono">{projectId}</div>
                </div>
                <div className="p-3 rounded-xl bg-black/60 border border-white/10">
                  <div className="text-[10px] text-slate-400 uppercase">DATASET</div>
                  <div className="text-purple-300 font-bold font-mono">{dataset}</div>
                </div>
                <div className="p-3 rounded-xl bg-black/60 border border-white/10">
                  <div className="text-[10px] text-slate-400 uppercase">API VERSION</div>
                  <div className="text-emerald-300 font-bold font-mono">{apiVersion}</div>
                </div>
                <div className="p-3 rounded-xl bg-black/60 border border-white/10">
                  <div className="text-[10px] text-slate-400 uppercase">SANITY STUDIO URL</div>
                  <div className="text-sky-300 font-bold font-mono truncate">{studioUrl}</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 space-y-2 text-slate-300 text-[11px] leading-relaxed">
                <div className="font-bold text-cyan-300 uppercase">Connecting Your Own Sanity Studio:</div>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Deploy your Sanity Studio schemas from <code className="text-cyan-200 bg-black/40 px-1 py-0.5 rounded">/src/sanity/schema</code>.</li>
                  <li>Set <code className="text-cyan-200 bg-black/40 px-1 py-0.5 rounded">VITE_SANITY_PROJECT_ID</code> and <code className="text-cyan-200 bg-black/40 px-1 py-0.5 rounded">VITE_SANITY_DATASET</code> in your environment.</li>
                  <li>In Sanity Manage, add <code className="text-cyan-200 bg-black/40 px-1 py-0.5 rounded">{window.location.origin}</code> as an allowed CORS origin with credentials enabled.</li>
                </ol>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-between items-center">
              <a
                href="https://sanity.io/manage"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 font-bold text-[11px] flex items-center gap-1.5"
              >
                <span>SANITY MANAGEMENT PORTAL</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => setShowConfigModal(false)}
                className="px-5 py-2 rounded-xl bg-cyan-400 text-black font-bold text-xs cursor-pointer hover:bg-cyan-300 transition-colors"
              >
                DONE
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

