import { createClient } from '@sanity/client';

// Extract environment variables or use safe fallback values
export const projectId = import.meta.env.VITE_SANITY_PROJECT_ID || 'cyber-ops-project';
export const dataset = import.meta.env.VITE_SANITY_DATASET || 'production';
export const apiVersion = import.meta.env.VITE_SANITY_API_VERSION || '2024-03-01';
export const studioUrl = import.meta.env.VITE_SANITY_STUDIO_URL || 'http://localhost:3333';

// Configure Sanity Client with Stega enabled for visual click-to-edit overlays
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  stega: {
    enabled: true,
    studioUrl,
  },
});

// Types for Sanity Page Builder
export interface SanityHeroBlock {
  _type: 'heroBlock';
  _key?: string;
  statusBadge?: string;
  headlinePrimary?: string;
  headlineAccent?: string;
  subheadline?: string;
  ctaPrimaryText?: string;
  ctaSecondaryText?: string;
  statPills?: Array<{ value: string; label: string }>;
  terminalQuickCommand?: string;
}

export interface SanityWorksBlock {
  _type: 'worksBlock';
  _key?: string;
  badgeText?: string;
  sectionTitle?: string;
  subtitle?: string;
  projects?: Array<{
    id: string;
    title: string;
    category: string;
    description: string;
    fullDescription: string;
    imageUrl?: string;
    mainImage?: any;
    tags: string[];
    year: string;
    client: string;
    role: string;
    metrics: Array<{ label: string; value: string }>;
    accentColor?: string;
    terminalCommand?: string;
  }>;
}

export interface SanityTechStackBlock {
  _type: 'techStackBlock';
  _key?: string;
  badgeText?: string;
  sectionTitle?: string;
  subtitle?: string;
  capabilities?: Array<{
    id: string;
    title: string;
    description: string;
    iconName: string;
    accentHex: string;
    tags: string[];
    telemetryMetrics?: Array<{ label: string; val: string }>;
  }>;
}

export interface SanityLabBlock {
  _type: 'labBlock';
  _key?: string;
  badgeText?: string;
  sectionTitle?: string;
  subtitle?: string;
  defaultGeometry?: string;
  primaryColorHex?: string;
  accentColorHex?: string;
}

export interface SanityAboutBlock {
  _type: 'aboutBlock';
  _key?: string;
  badgeText?: string;
  sectionTitle?: string;
  storyHeadline?: string;
  storyParagraphs?: string[];
  bio?: string[];
  pillars?: Array<{ title?: string; desc?: string; description?: string; iconName?: string }>;
  stats?: Array<{ value?: string; label?: string; desc?: string; description?: string }>;
}

export interface SanityContactBlock {
  _type: 'contactBlock';
  _key?: string;
  badgeText?: string;
  sectionTitle?: string;
  subtext?: string;
  directEmail?: string;
  email?: string;
  pgpFingerprint?: string;
  phone?: string;
  auditQuestions?: {
    organizationTypes?: string[];
    scopeOptions?: string[];
    timelineOptions?: string[];
  };
}

export interface SanityShaderSectionBlock {
  _type: 'shaderSectionBlock';
  _key?: string;
  title?: string;
  description?: string;
  color1?: string;
  color2?: string;
}

export interface SanityFooterBlock {
  _type: 'footerBlock';
  _key?: string;
  brandName?: string;
  tagline?: string;
  copyrightNotice?: string;
  copyrightText?: string;
  statusText?: string;
}

export type SanityBlock =
  | SanityHeroBlock
  | SanityWorksBlock
  | SanityTechStackBlock
  | SanityLabBlock
  | SanityAboutBlock
  | SanityContactBlock
  | SanityShaderSectionBlock
  | SanityFooterBlock;

export interface SanityPage {
  title: string;
  slug?: { current: string };
  globalTheme?: {
    primaryHex?: string;
    secondaryHex?: string;
    backgroundHex?: string;
  };
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
  navigation?: Array<{ label: string; sectionId: string }>;
  blocks: SanityBlock[];
}

// GROQ Query for fetching complete page document with blocks
export const PAGE_BUILDER_GROQ = `*[_type == "page" && (slug.current == $slug || _id == "frontpage")][0]{
  title,
  slug,
  globalTheme,
  seo,
  navigation,
  blocks[]{
    ...,
    _type == "worksBlock" => {
      ...,
      projects[]{
        ...,
        "imageUrl": mainImage.asset->url
      }
    }
  }
}`;

// Default Fallback Page Data ensuring out-of-the-box working application
export const DEFAULT_SANITY_PAGE_DATA: SanityPage = {
  title: 'Cyber Ops // Zero-Trust Cyber Security Consulting',
  globalTheme: {
    primaryHex: '#00f0ff',
    secondaryHex: '#d946ef',
    backgroundHex: '#0b0f19',
  },
  seo: {
    metaTitle: 'Cyber Ops | Zero-Trust & Post-Quantum Defense',
    metaDescription: 'Elite cybersecurity consulting firm delivering zero-trust architecture, red team penetration testing, and post-quantum encryption.',
  },
  navigation: [
    { label: '// 01. WORK', sectionId: 'work' },
    { label: '// 02. STACK', sectionId: 'stack' },
    { label: '// 03. LAB', sectionId: 'lab' },
    { label: '// 04. ABOUT', sectionId: 'about' },
    { label: '// 05. AUDIT', sectionId: 'contact' },
  ],
  blocks: [
    {
      _type: 'heroBlock',
      _key: 'hero_1',
      statusBadge: 'SYSTEM STATUS // ALL SYSTEMS HARDENED',
      headlinePrimary: 'ZERO-TRUST ARCHITECTURE &',
      headlineAccent: 'QUANTUM-RESISTANT CYBER OPS',
      subheadline:
        'Engineering military-grade perimeter defense, kernel-level filter hooks, and cloud infrastructure audit pipelines for Fortune 500 enterprises and defense contractors.',
      ctaPrimaryText: 'INITIATE AUDIT WIZARD',
      ctaSecondaryText: 'LAUNCH LAB SIMULATOR',
      statPills: [
        { value: '99.999%', label: 'Uptime SLA' },
        { value: '<0.4ms', label: 'Triage Response' },
        { value: 'Zero', label: 'Breach Record' },
      ],
      terminalQuickCommand: 'cyber-ops --audit --level=maximum',
    },
    {
      _type: 'worksBlock',
      _key: 'works_1',
      badgeText: 'ENTERPRISE ENGAGEMENTS // PORTFOLIO',
      sectionTitle: 'MISSION-CRITICAL CYBER OPS & RED TEAM SIMULATIONS',
      subtitle:
        'Explore real-world case studies detailing custom exploit remediation, quantum cryptography deployments, and zero-day threat elimination.',
    },
    {
      _type: 'techStackBlock',
      _key: 'stack_1',
      badgeText: 'CORE CAPABILITIES // STACK MATRIX',
      sectionTitle: 'DEFENSE-GRADE CYBERSECURITY CAPABILITIES',
      subtitle:
        'Custom-engineered threat intelligence feeds, hardware security modules, and automated incident response pipelines.',
    },
    {
      _type: 'labBlock',
      _key: 'lab_1',
      badgeText: 'LAB SIMULATOR // INTERACTIVE 3D WIREFRAME',
      sectionTitle: 'QUANTUM GEOMETRY & TOPOLOGY CONTROL LABORATORY',
      subtitle:
        'Manipulate 3D spatial field parameters, WebGL bloom thresholds, and particle dispersion vector dynamics in real-time.',
      defaultGeometry: 'crystalMatrix',
      primaryColorHex: '#00f0ff',
      accentColorHex: '#d946ef',
    },
    {
      _type: 'aboutBlock',
      _key: 'about_1',
      badgeText: 'ORIGIN & DOCTRINE // EXECUTIVE SUMMARY',
      sectionTitle: 'ENGINEERED FOR UNCOMPROMISING DIGITAL SURVIVAL',
      storyHeadline: 'COMBAT-TESTED CYBERSECURITY ARCHITECTS',
      storyParagraphs: [
        'Founded by former intelligence agency security directors and principal cryptography engineers, Cyber Ops operates on a singular mandate: complete digital immunity.',
        'We do not rely on passive signature scanners or off-the-shelf antivirus rulesets. We engineer bespoke, kernel-level kernel hooks, zero-trust cryptographic handshakes, and quantum-safe key distribution systems that neutralize attacks before payload execution.',
      ],
      pillars: [
        {
          title: 'Quantum-Resistant Enclaves',
          desc: 'Post-quantum key exchange algorithms (Kyber-1024, Dilithium) hardening communication channels against future decryption attacks.',
          iconName: 'Shield',
        },
        {
          title: 'Zero-Trust Mesh Networks',
          desc: 'Micro-segmented perimeter security enforcing continuous identity verification and ephemeral access tokens at every API boundary.',
          iconName: 'Lock',
        },
        {
          title: 'Autonomous Red Teaming',
          desc: 'AI-driven adversarial agents constantly probing cloud infrastructure, SCADA networks, and smart contracts for zero-day vulnerabilities.',
          iconName: 'Cpu',
        },
      ],
      stats: [
        { value: '$4.2B+', label: 'Protected Assets', desc: 'Enterprise capital shielded from nation-state ransomware and state-sponsored espionage.' },
        { value: '1,420+', label: 'Zero-Days Patched', desc: 'Kernel-level vulnerabilities identified and neutralized prior to public disclosure.' },
        { value: '<0.4ms', label: 'Telemetry Latency', desc: 'Real-time neural threat detection and sub-second automated remediation.' },
        { value: '100%', label: 'Audit Success', desc: 'Flawless compliance scores across SOC 2 Type II, ISO 27001, and FedRAMP High.' },
      ],
    },
    {
      _type: 'contactBlock',
      _key: 'contact_1',
      badgeText: 'CONFIDENTIAL TRIAGE // INITIATE ENGAGEMENT',
      sectionTitle: 'COMMISSION A COMPREHENSIVE CYBERSECURITY AUDIT',
      subtext:
        'Ready to fortify your enterprise infrastructure against nation-state APTs and quantum decryption threats? Complete our 4-step confidential audit wizard below for immediate triage by our principal architects.',
      directEmail: 'triage@cyberops.sec',
      pgpFingerprint: '4F8A 9B2C 11E3 D09A 7782 559C 3341 A10B 9901 882E',
    },
    {
      _type: 'footerBlock',
      _key: 'footer_1',
      brandName: 'CYBER OPS // ZERO-TRUST LABS',
      tagline:
        'Next-generation cybersecurity engineering, zero-trust infrastructure, and post-quantum cryptography solutions.',
      copyrightNotice: '© 2026 CYBER OPS CONSULTING INC. ALL RIGHTS RESERVED.',
      statusText: 'DEFCON 5 // ALL NODES SECURE',
    },
  ],
};

// Async Page Loader with Fallback
export async function getSanityPageData(slug = 'home'): Promise<SanityPage> {
  try {
    const data = await sanityClient.fetch<SanityPage>(PAGE_BUILDER_GROQ, { slug });
    if (data && data.blocks && data.blocks.length > 0) {
      return data;
    }
  } catch (err) {
    console.warn('Sanity Client fetch info (using fallback schema data):', err);
  }
  return DEFAULT_SANITY_PAGE_DATA;
}
