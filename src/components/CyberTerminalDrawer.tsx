import React, { useState, useEffect, useRef } from 'react';
import { Terminal, X, Send, Play, ShieldAlert, Cpu, CheckCircle2, CornerDownLeft } from 'lucide-react';
import { sound } from '../utils/audio';

interface CyberTerminalDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialCommand?: string;
  onNavigateSection?: (section: string) => void;
}

interface LogEntry {
  id: string;
  type: 'input' | 'output' | 'error' | 'success' | 'system';
  text: string;
  time: string;
}

export function CyberTerminalDrawer({
  isOpen,
  onClose,
  initialCommand = '',
  onNavigateSection
}: CyberTerminalDrawerProps) {
  const [inputVal, setInputVal] = useState('');
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: '1',
      type: 'system',
      text: 'CYBER OPS // AUTONOMOUS WAR ROOM TERMINAL v4.8.2-SEC',
      time: new Date().toLocaleTimeString('en-US', { hour12: false })
    },
    {
      id: '2',
      type: 'system',
      text: 'mTLS Handshake: OK | PGP Key: 0x9F3B...4C1A | Zero-Trust Mesh: ACTIVE',
      time: new Date().toLocaleTimeString('en-US', { hour12: false })
    },
    {
      id: '3',
      type: 'system',
      text: 'Type "help" or click quick commands below to execute security diagnostics.',
      time: new Date().toLocaleTimeString('en-US', { hour12: false })
    }
  ]);

  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  useEffect(() => {
    if (initialCommand && isOpen) {
      executeCommand(initialCommand);
    }
  }, [initialCommand, isOpen]);

  const addLog = (type: LogEntry['type'], text: string) => {
    const time = new Date().toLocaleTimeString('en-US', { hour12: false });
    setLogs((prev) => [...prev, { id: Math.random().toString(36).substr(2, 9), type, text, time }]);
  };

  const executeCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    sound.playClick();
    addLog('input', `$ ${trimmed}`);
    setInputVal('');

    const lower = trimmed.toLowerCase();

    if (lower === 'clear') {
      setLogs([]);
      return;
    }

    if (lower === 'help') {
      addLog('output', 'AVAILABLE WAR ROOM COMMANDS:');
      addLog('output', '  scan           - Run full-spectrum zero-trust pentest scan');
      addLog('output', '  status         - Display live SOC telemetry & PGP encryption state');
      addLog('output', '  quantum        - Verify NIST Kyber & Dilithium HSM lattice keys');
      addLog('output', '  audit          - Launch confidential security discovery brief form');
      addLog('output', '  clear          - Wipe terminal console buffer');
      return;
    }

    if (lower === 'scan') {
      addLog('system', '[+] Initializing Kernel Zero-Day & Network Microsegmentation Audit...');
      setTimeout(() => addLog('output', '  [1/4] Port Sweep (1-65535)... 0 open unauthenticated ports.'), 400);
      setTimeout(() => addLog('output', '  [2/4] Ephemeral mTLS Posture Check... PASS (100% compliant).'), 800);
      setTimeout(() => addLog('output', '  [3/4] AI SOAR Threat Correlation... 0 active exploits detected.'), 1200);
      setTimeout(() => addLog('success', '  [4/4] SCAN COMPLETE: Infrastructure fortified with 0 vulnerabilities.'), 1600);
      return;
    }

    if (lower === 'status') {
      addLog('output', 'SYSTEM POSTURE TELEMETRY:');
      addLog('output', '  - Shield Status: IMPERVIOUS (100% Uptime)');
      addLog('output', '  - Active SOC Triage Speed: < 1.2s MTTD');
      addLog('output', '  - Daily Log Ingestion Rate: 2.5 Billion Events/day');
      addLog('success', '  - Compliance Verification: ISO 27001 & SOC 2 Type II CERTIFIED');
      return;
    }

    if (lower === 'quantum') {
      addLog('output', 'POST-QUANTUM CRYPTOGRAPHY STATUS:');
      addLog('output', '  - Lattice Algorithm: ML-KEM-768 (Kyber) + ML-DSA-65 (Dilithium)');
      addLog('output', '  - HSM Key State: Hardened / Hardware Rotated 14m ago');
      addLog('success', '  - Decryption Deflect Rating: 100% Quantum Resistant');
      return;
    }

    if (lower === 'audit') {
      addLog('success', '[+] Navigating to confidential Security Audit Brief section...');
      if (onNavigateSection) {
        onNavigateSection('contact');
      }
      setTimeout(() => onClose(), 600);
      return;
    }

    // Default response for custom queries
    addLog('output', `Executing payload for "${trimmed}"...`);
    setTimeout(() => {
      addLog('success', `Command "${trimmed}" executed successfully. System state secured.`);
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex justify-end bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl h-full bg-[#0b0f19] border-l border-cyan-500/30 p-6 flex flex-col shadow-[0_0_60px_rgba(0,240,255,0.25)] text-white font-mono">
        {/* Terminal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-400 flex items-center justify-center text-cyan-400">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold tracking-widest text-white uppercase">
                WAR ROOM CONSOLE
              </div>
              <div className="text-[10px] text-cyan-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>INTERACTIVE CLI DIAGNOSTICS</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2 rounded-xl bg-white/5 hover:bg-cyan-400 hover:text-black transition-all cursor-pointer"
            data-cursor-hover
            data-cursor-text="CLOSE"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Action Pills */}
        <div className="py-3 flex flex-wrap gap-2 border-b border-white/10">
          {[
            { label: 'RUN SCAN', cmd: 'scan', icon: ShieldAlert },
            { label: 'SYSTEM STATUS', cmd: 'status', icon: Cpu },
            { label: 'QUANTUM KEYS', cmd: 'quantum', icon: CheckCircle2 },
            { label: 'AUDIT BRIEF', cmd: 'audit', icon: CornerDownLeft }
          ].map((item) => (
            <button
              key={item.cmd}
              onClick={() => executeCommand(item.cmd)}
              onMouseEnter={() => sound.playHover()}
              className="px-3 py-1.5 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-400 hover:text-black text-[11px] font-bold tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <item.icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Terminal Logs Area */}
        <div
          ref={logContainerRef}
          className="flex-1 overflow-y-auto py-4 space-y-2 text-xs font-mono select-text"
        >
          {logs.map((log) => (
            <div key={log.id} className="flex items-start gap-2 leading-relaxed">
              <span className="text-slate-600 shrink-0 text-[10px] pt-0.5">{log.time}</span>
              <span
                className={
                  log.type === 'input'
                    ? 'text-cyan-300 font-bold'
                    : log.type === 'success'
                    ? 'text-emerald-400 font-bold'
                    : log.type === 'error'
                    ? 'text-red-400'
                    : log.type === 'system'
                    ? 'text-purple-300'
                    : 'text-slate-300'
                }
              >
                {log.text}
              </span>
            </div>
          ))}
        </div>

        {/* Command Input Prompt */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            executeCommand(inputVal);
          }}
          className="pt-4 border-t border-white/10 flex items-center gap-2"
        >
          <span className="text-cyan-400 font-bold">$</span>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Type command (e.g. scan, status, quantum, audit)..."
            className="flex-1 bg-transparent text-white text-xs font-mono focus:outline-none placeholder:text-slate-600"
          />
          <button
            type="submit"
            className="p-2.5 rounded-xl bg-cyan-400 text-black font-bold hover:bg-cyan-300 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
