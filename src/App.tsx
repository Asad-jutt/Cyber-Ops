import React, { useState, useEffect } from 'react';
import { CustomCursor } from './components/CustomCursor';
import { Navbar } from './components/Navbar';
import { Hero3DCanvas } from './components/Hero3DCanvas';
import { SearchModal } from './components/SearchModal';
import { CyberTerminalDrawer } from './components/CyberTerminalDrawer';
import { PageBuilder } from './sanity/PageBuilder';
import { getSanityPageData, DEFAULT_SANITY_PAGE_DATA, SanityPage } from './sanity/client';
import { VisualEditingOverlay } from './sanity/VisualEditingOverlay';
import { LabSettings, NavSection } from './types';

export default function App() {
  const [activeSection, setActiveSection] = useState<NavSection>('home');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState<boolean>(false);
  const [terminalCommand, setTerminalCommand] = useState<string>('');
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [pageData, setPageData] = useState<SanityPage | null>(null);
  const [isLoadingPage, setIsLoadingPage] = useState<boolean>(false);

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
  const refreshSanityData = async () => {
    setIsLoadingPage(true);
    try {
      const data = await getSanityPageData('home');
      const isFallback = JSON.stringify(data) === JSON.stringify(DEFAULT_SANITY_PAGE_DATA);
      if (data && !isFallback) {
        setPageData(data);
      } else {
        setPageData(DEFAULT_SANITY_PAGE_DATA);
      }
    } catch (err) {
      console.error('Failed to load Sanity page data:', err);
      setPageData(DEFAULT_SANITY_PAGE_DATA);
    } finally {
      setIsLoadingPage(false);
    }
  };

  useEffect(() => {
    refreshSanityData();
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
        <Hero3DCanvas mousePosition={mousePos} />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b0f19]/40 via-[#0b0f19]/75 to-[#0b0f19]" />
      </div>

      {/* Dynamic Page Builder Stream */}
      {pageData ? (
        <main className="relative z-10 pt-20">
          <PageBuilder
            pageData={pageData}
            labSettings={labSettings}
            onUpdateLabSettings={(newSettings) => setLabSettings(newSettings)}
            onNavigateSection={handleNavigate}
            onOpenTerminalWithCommand={handleOpenTerminalWithCommand}
          />
        </main>
      ) : (
        <main className="relative z-10 pt-20">
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="space-y-4 text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
              <p className="font-mono text-xs tracking-widest text-cyan-300/80">
                SYNCING SANITY CMS DATA...
              </p>
            </div>
          </div>
        </main>
      )}

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

      {/* Sanity Live Visual Editing Overlay */}
      <VisualEditingOverlay />
    </div>
  );
}
