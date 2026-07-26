import React, { useState, useEffect } from 'react';
import { CustomCursor } from './components/CustomCursor';
import { Navbar } from './components/Navbar';
import { Hero3DCanvas } from './components/Hero3DCanvas';
import { SearchModal } from './components/SearchModal';
import { CyberTerminalDrawer } from './components/CyberTerminalDrawer';
import { PageBuilder } from './sanity/PageBuilder';
import { getSanityPageData, DEFAULT_SANITY_PAGE_DATA, SanityPage } from './sanity/client';
import { LabSettings, NavSection } from './types';

export default function App() {
  const [activeSection, setActiveSection] = useState<NavSection>('home');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState<boolean>(false);
  const [terminalCommand, setTerminalCommand] = useState<string>('');
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [pageData, setPageData] = useState<SanityPage>(DEFAULT_SANITY_PAGE_DATA);

  const [labSettings, setLabSettings] = useState<LabSettings>({
    geometry: 'crystalMatrix',
    wireframe: false,
    rotationSpeed: 0.6,
    particleCount: 1500,
    primaryColor: '#00f0ff',
    accentColor: '#d946ef',
    metalness: 0.85,
    roughness: 0.15,
    bloomIntensity: 1.2,
    lightIntensity: 2.5
  });

  // Load Sanity GROQ Page Builder Data
  useEffect(() => {
    async function loadPage() {
      const data = await getSanityPageData('home');
      if (data) {
        setPageData(data);
      }
    }
    loadPage();
  }, []);

  // Track global normalized mouse position for 3D parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleNavigate = (section: NavSection) => {
    setActiveSection(section);
    if (section === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById(section);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleOpenTerminalWithCommand = (cmd: string = '') => {
    setTerminalCommand(cmd);
    setIsTerminalOpen(true);
  };

  return (
    <div className="relative min-h-screen bg-[#0b0f19] text-white selection:bg-cyan-500/30 selection:text-cyan-300 font-sans overflow-x-hidden">
      {/* Fluid Lerped Custom Cursor */}
      <CustomCursor />

      {/* Glassmorphic Navbar */}
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenTerminal={() => handleOpenTerminalWithCommand('')}
      />

      {/* 3D WebGL Canvas Layer (Fixed Background for Hero) */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-80">
        <Hero3DCanvas labSettings={labSettings} mousePosition={mousePos} />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b0f19]/40 via-[#0b0f19]/75 to-[#0b0f19]" />
      </div>

      {/* Dynamic Page Builder Stream */}
      <main className="relative z-10 pt-20">
        <PageBuilder
          pageData={pageData}
          labSettings={labSettings}
          onUpdateLabSettings={(newSettings) => setLabSettings(newSettings)}
          onNavigateSection={handleNavigate}
          onOpenTerminalWithCommand={handleOpenTerminalWithCommand}
        />
      </main>

      {/* Search Overlay */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProject={() => {
          handleNavigate('work');
        }}
        onNavigateSection={(sec) => handleNavigate(sec as NavSection)}
      />

      {/* Cyber Terminal / CLI Drawer */}
      <CyberTerminalDrawer
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
        initialCommand={terminalCommand}
        onNavigateSection={(sec) => handleNavigate(sec as NavSection)}
      />
    </div>
  );
}
