import React, { useState, useEffect } from 'react';
import { CustomCursor } from './components/CustomCursor';
import { Navbar } from './components/Navbar';
import { Hero3DCanvas } from './components/Hero3DCanvas';
import { HeroContent } from './components/HeroContent';
import { WorksSection } from './components/WorksSection';
import { TechStackSection } from './components/TechStack/TechStackSection';
import { LabSection } from './components/LabSection';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { SearchModal } from './components/SearchModal';
import { CyberTerminalDrawer } from './components/CyberTerminalDrawer';
import { Footer } from './components/Footer';
import { LabSettings, NavSection } from './types';

export default function App() {
  const [activeSection, setActiveSection] = useState<NavSection>('home');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState<boolean>(false);
  const [terminalCommand, setTerminalCommand] = useState<string>('');
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

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
    <div className="relative min-h-screen bg-[#0b0f19] text-white selection:bg-cyan-500/30 selection:text-cyan-300 font-sans overflow-hidden">
      {/* Fluid Lerped Custom Cursor */}
      <CustomCursor />

      {/* Glassmorphic Navbar */}
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenTerminal={() => handleOpenTerminalWithCommand('')}
      />

      {/* Hero Container with Split 3D Canvas Background & Content */}
      <div className="relative w-full min-h-screen flex items-center overflow-hidden">
        {/* 3D WebGL Canvas Layer */}
        <div className="absolute inset-0 z-0 opacity-90">
          <Hero3DCanvas labSettings={labSettings} mousePosition={mousePos} />
        </div>

        {/* Ambient Dark Gradient Overlays for Readability */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[#0b0f19] via-[#0b0f19]/60 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 h-40 z-[1] bg-gradient-to-t from-[#0b0f19] to-transparent pointer-events-none" />

        {/* Hero Content Section */}
        <HeroContent
          onBeginExploration={() => handleNavigate('work')}
          onOpenLab={() => handleNavigate('lab')}
        />
      </div>

      {/* Main Sections */}
      <main className="relative z-10 space-y-12">
        <WorksSection onOpenLiveDemo={(cmd) => handleOpenTerminalWithCommand(cmd)} />
        <TechStackSection onExploreServices={() => handleNavigate('contact')} />
        <LabSection
          labSettings={labSettings}
          onUpdateSettings={(newSettings) => setLabSettings(newSettings)}
        />
        <AboutSection />
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Search Overlay */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProject={(id) => {
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
