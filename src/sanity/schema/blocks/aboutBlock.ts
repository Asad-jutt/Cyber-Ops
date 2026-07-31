export const aboutBlock = {
  name: 'aboutBlock',
  title: 'About & Security Pillars Section',
  type: 'object',
  groups: [
    { name: 'header', title: 'Section Header', default: true },
    { name: 'story', title: 'Story / Bio' },
    { name: 'pillars', title: 'Security Pillars' },
    { name: 'stats', title: 'Track Record Stats' },
  ],
  fields: [
    {
      name: 'badgeText',
      title: 'Badge / Eyebrow Text',
      type: 'string',
      group: 'header',
      initialValue: 'ORIGIN & DOCTRINE // EXECUTIVE SUMMARY',
    },
    {
      name: 'sectionTitle',
      title: 'Section Title',
      type: 'string',
      group: 'header',
      initialValue: 'ENGINEERED FOR UNCOMPROMISING DIGITAL SURVIVAL',
    },
    {
      name: 'storyHeadline',
      title: 'Story Headline',
      type: 'string',
      group: 'story',
      description: 'Headline above the bio paragraphs',
      initialValue: 'COMBAT-TESTED CYBERSECURITY ARCHITECTS',
    },
    {
      name: 'bio',
      title: 'Bio / Manifesto Paragraphs',
      type: 'array',
      group: 'story',
      description: '2 manifesto paragraphs displayed in 2-column layout',
      of: [{ type: 'text', rows: 5 }],
      initialValue: [
        'Cyber Ops operates at the frontier of offensive red teaming, post-quantum cryptography, and autonomous SOC threat intelligence. We assume initial compromise and engineer resilient zero-trust perimeters that deny unauthorized lateral movement across all infrastructure layers.',
        'Every microsegmentation policy, lattice key exchange, and AI SIEM playbook is engineered to safeguard mission-critical banking, aerospace, defense, and healthcare assets against state-sponsored Advanced Persistent Threats (APTs).',
      ],
      validation: (Rule: any) => Rule.min(1).warning('Add at least one bio paragraph'),
    },
    {
      name: 'pillars',
      title: 'Security Pillars',
      type: 'array',
      group: 'pillars',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', type: 'string', title: 'Pillar Title', validation: (Rule: any) => Rule.required() },
            { name: 'description', type: 'text', title: 'Description', rows: 3 },
            { name: 'iconName', type: 'string', title: 'Icon Name (e.g. Lock, Shield, ShieldAlert)' },
          ],
          preview: {
            select: { title: 'title', subtitle: 'description' },
          },
        },
      ],
      initialValue: [
        {
          title: 'ZERO-TRUST ARCHITECTURE (ZTNA)',
          description: 'Eliminating implicit trust through ephemeral mTLS authentication, continuous device posture evaluation, and granular microsegmentation policies.',
          iconName: 'Lock',
        },
        {
          title: 'POST-QUANTUM CRYPTOGRAPHY',
          description: 'Deploying NIST-approved lattice encryption algorithms (Kyber & Dilithium) inside cloud HSMs to neutralize future quantum decryption harvest attacks.',
          iconName: 'Shield',
        },
        {
          title: 'AUTONOMOUS AI SOC & RED TEAMING',
          description: 'Combining simulated APT red-team campaigns with sub-second AI threat hunting to detect and neutralize zero-days before adversaries exploit them.',
          iconName: 'ShieldAlert',
        },
      ],
    },
    {
      name: 'stats',
      title: 'Key Track Record Stats',
      type: 'array',
      group: 'stats',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'value', type: 'string', title: 'Stat Value (e.g. $18.4B+)' },
            { name: 'label', type: 'string', title: 'Stat Label (e.g. ASSETS SHIELDED)' },
            { name: 'description', type: 'text', title: 'Detailed Context', rows: 2 },
          ],
          preview: {
            select: { title: 'value', subtitle: 'label' },
          },
        },
      ],
      initialValue: [
        { value: '$18.4B+', label: 'ASSETS SHIELDED', description: 'Global banking & enterprise liquidity protected' },
        { value: '< 1.2s', label: 'MTTD REMEDIATION', description: 'Autonomous AI SOC threat detection speed' },
        { value: '2.5B+', label: 'DAILY LOGS ANALYZED', description: 'Real-time telemetry event stream processing' },
        { value: '99.999%', label: 'THREAT DEFLECTION', description: 'ISO 27001 & SOC 2 Type II certified' },
      ],
    },
    {
      name: 'image',
      title: 'Team / Office Image',
      type: 'image',
      group: 'story',
      description: 'Optional image displayed alongside the bio',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Alt text' }],
    },
  ],
  preview: {
    select: { title: 'sectionTitle', subtitle: 'badgeText' },
    prepare({ title, subtitle }: { title?: string; subtitle?: string }) {
      return { title: title || 'About Section', subtitle: subtitle || 'Philosophy' };
    },
  },
};
