import React, { useRef } from 'react';
import {
  SanityPage,
  SanityHeroBlock,
  SanityWorksBlock,
  SanityTechStackBlock,
  SanityLabBlock,
  SanityAboutBlock,
  SanityContactBlock,
  SanityShaderSectionBlock,
  SanityFooterBlock,
} from './client';
import { HeroContent } from '../components/HeroContent';
import { WorksSection } from '../components/WorksSection';
import { TechStackSection } from '../components/TechStack/TechStackSection';
import { LabSection } from '../components/LabSection';
import { AboutSection } from '../components/AboutSection';
import { ContactSection } from '../components/ContactSection';
import { Footer } from '../components/Footer';
import { LiquidCard } from '../components/LiquidCard';
import { useSectionReveal } from '../utils/scrollReveal';
import { LabSettings, NavSection } from '../types';

function ShaderSection({ data }: { data: SanityShaderSectionBlock }) {
  const sectionRef = useRef<HTMLElement>(null);
  useSectionReveal(sectionRef, { y: 40, blur: 8, duration: 0.9, start: 'top 85%' });

  return (
    <section ref={sectionRef} className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
      <LiquidCard
        color1={data.color1 || '#00f0ff'}
        color2={data.color2 || '#d946ef'}
        className="rounded-3xl p-8 bg-black/60 border border-cyan-500/30 backdrop-blur-xl text-center space-y-4"
      >
        <h3 className="text-2xl md:text-3xl font-mono font-bold text-white tracking-wider">
          {data.title || 'QUANTUM FLUID FIELD VISUALIZER'}
        </h3>
        <p className="text-sm font-mono text-cyan-300/80 max-w-2xl mx-auto">
          {data.description ||
            'Interactive WebGL fluid simulation powered by custom fragment shaders depicting real-time encryption entropy.'}
        </p>
      </LiquidCard>
    </section>
  );
}

interface PageBuilderProps {
  pageData: SanityPage;
  labSettings: LabSettings;
  onUpdateLabSettings: (settings: LabSettings) => void;
  onNavigateSection: (section: NavSection) => void;
  onOpenTerminalWithCommand: (cmd: string) => void;
}

export function PageBuilder({
  pageData,
  labSettings,
  onUpdateLabSettings,
  onNavigateSection,
  onOpenTerminalWithCommand,
}: PageBuilderProps) {
  const blocks = pageData.blocks || [];

  return (
    <div className="relative w-full">
      {blocks.map((block, index) => {
        const key = block._key || `block_${block._type}_${index}`;

        switch (block._type) {
          case 'heroBlock': {
            const heroData = block as SanityHeroBlock;
            return (
              <HeroContent
                key={key}
                data={heroData}
                onBeginExploration={() => onNavigateSection('work')}
                onOpenLab={() => onNavigateSection('lab')}
              />
            );
          }

          case 'worksBlock': {
            const worksData = block as SanityWorksBlock;
            return (
              <WorksSection
                key={key}
                data={worksData}
                onOpenLiveDemo={(cmd) => onOpenTerminalWithCommand(cmd)}
              />
            );
          }

          case 'techStackBlock': {
            const stackData = block as SanityTechStackBlock;
            return (
              <TechStackSection
                key={key}
                data={stackData}
                onExploreServices={() => onNavigateSection('contact')}
              />
            );
          }

          case 'labBlock': {
            const labData = block as SanityLabBlock;
            return (
              <LabSection
                key={key}
                data={labData}
                labSettings={labSettings}
                onUpdateSettings={onUpdateLabSettings}
              />
            );
          }

          case 'aboutBlock': {
            const aboutData = block as SanityAboutBlock;
            return <AboutSection key={key} data={aboutData} />;
          }

          case 'contactBlock': {
            const contactData = block as SanityContactBlock;
            return <ContactSection key={key} data={contactData} />;
          }

          case 'shaderSectionBlock': {
            const shaderData = block as SanityShaderSectionBlock;
            return <ShaderSection key={key} data={shaderData} />;
          }

          case 'footerBlock': {
            const footerData = block as SanityFooterBlock;
            return <Footer key={key} data={footerData} />;
          }

          default:
            return null;
        }
      })}
    </div>
  );
}
