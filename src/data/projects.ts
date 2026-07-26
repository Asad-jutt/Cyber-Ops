import { Project } from '../types';

import imgQuantumVault from '../assets/images/quantum_encryption_vault_1785027160090.jpg';
import imgSocCenter from '../assets/images/soc_command_center_1785027181641.jpg';
import imgZeroTrust from '../assets/images/zero_trust_mesh_1785027200123.jpg';
import imgPentestCore from '../assets/images/pentest_security_core_1785027212724.jpg';

export const PROJECTS: Project[] = [
  {
    id: 'quantum-vault-shield',
    title: 'QUANTUM VAULT // LATTICE DEFENSE',
    category: 'Post-Quantum Cryptography',
    description: 'NIST-compliant post-quantum encryption vault defending banking cloud infrastructures against quantum decryption threats.',
    fullDescription: 'Comprehensive post-quantum cryptography overhaul for a Tier-1 global financial network. We deployed lattice-based algorithms (Kyber & Dilithium) into cloud hardware security modules (HSMs), safeguarding $18B in active liquidity against future quantum harvest attacks.',
    image: imgQuantumVault,
    tags: ['Post-Quantum Crypto', 'HSM Hardening', 'Lattice Encryption', 'Zero-Trust'],
    year: '2026',
    client: 'Apex Global Clearing Bank',
    role: 'Lead Cryptographic Architect',
    metrics: [
      { label: 'Liquidity Shielded', value: '$18.4 Billion' },
      { label: 'Encryption Latency', value: '< 0.8 ms' },
      { label: 'Quantum Resistance', value: '256-bit Lattice' }
    ],
    color: '#00f0ff'
  },
  {
    id: 'aegis-soc-intelligence',
    title: 'AEGIS SOC // AUTONOMOUS AI SIEM',
    category: 'AI Threat Intelligence & SIEM',
    description: 'Real-time neural threat detection engine processing 2.5B telemetry events daily with sub-second automated remediation.',
    fullDescription: 'Deployed an autonomous AI Security Operations Center (SOC) for a global aerospace manufacturer. The system ingests cloud-wide endpoint, network, and IAM logs, deploying auto-quarantine playbooks that reduced Mean Time to Detect (MTTD) from 45 minutes to 1.2 seconds.',
    image: imgSocCenter,
    tags: ['Autonomous SOC', 'AI Threat Hunting', 'SIEM & SOAR', 'Incident Response'],
    year: '2026',
    client: 'Orbital Dynamics Defense',
    role: 'Principal Incident Handler',
    metrics: [
      { label: 'Daily Logs Analyzed', value: '2.5B Events' },
      { label: 'Detection Speed', value: '1.2 Seconds' },
      { label: 'False Positive Reduction', value: '98.4%' }
    ],
    color: '#00e5ff'
  },
  {
    id: 'zero-trust-mesh-architecture',
    title: 'ZERO-TRUST SENTINEL // HYBRID MESH',
    category: 'Enterprise Zero-Trust & IAM',
    description: 'Complete microsegmentation and continuous identity verification across multi-cloud infrastructure and remote access nodes.',
    fullDescription: 'Architected a frictionless Zero-Trust Network Access (ZTNA) model for 45,000 distributed enterprise employees. Implemented ephemeral mTLS session tokens, real-time device posture health checks, and granular microsegmentation policies.',
    image: imgZeroTrust,
    tags: ['Zero-Trust (ZTNA)', 'Microsegmentation', 'mTLS Verification', 'Cloud Security'],
    year: '2025',
    client: 'Veritas Healthcare Group',
    role: 'Chief Cyber Architect',
    metrics: [
      { label: 'Active Endpoints', value: '45,000 Devices' },
      { label: 'Access Policy Delay', value: '< 2 ms' },
      { label: 'Attack Surface Cut', value: '92.3%' }
    ],
    color: '#d946ef'
  },
  {
    id: 'offensive-pentest-core',
    title: 'OFFENSIVE MATRIX // RED TEAM AUDIT',
    category: 'Offensive Security & Pentesting',
    description: 'Simulated Advanced Persistent Threat (APT) attack vector campaign exposing zero-day vulnerabilities before adversary exploit.',
    fullDescription: 'Full-scope Red Team attack simulation targeting critical infrastructure SCADA systems and cloud API gateways. Discovered and remediated 14 high-severity zero-day vector pathways, engineering kernel-level hardening filters.',
    image: imgPentestCore,
    tags: ['Red Teaming', 'Zero-Day Discovery', 'SCADA Hardening', 'API Security'],
    year: '2025',
    client: 'National Energy Grid Corp',
    role: 'Lead Penetration Tester',
    metrics: [
      { label: 'Zero-Days Patched', value: '14 Vectors' },
      { label: 'SCADA Hardening', value: '100% Covered' },
      { label: 'Audit Clearance', value: 'ISO 27001' }
    ],
    color: '#8b5cf6'
  }
];
