export const heroBlock = {
  name: 'heroBlock',
  title: 'Hero Block',
  type: 'object',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'background', title: 'Background' },
    { name: 'stats', title: 'Stat Pills' },
  ],
  fields: [
    {
      name: 'statusBadge',
      title: 'Status Badge',
      type: 'string',
      group: 'content',
      description: 'Eyebrow text shown above the headline',
      initialValue: 'SYSTEM STATUS // ALL SYSTEMS HARDENED',
    },
    {
      name: 'headlinePrimary',
      title: 'Headline – Primary Line',
      type: 'string',
      group: 'content',
      initialValue: 'ADVANCED SECURITY ARCHITECTURE &',
    },
    {
      name: 'headlineAccent',
      title: 'Headline – Accent Glow Line',
      type: 'string',
      group: 'content',
      initialValue: 'QUANTUM-RESISTANT CYBER OPS',
    },
    {
      name: 'subheadline',
      title: 'Subheadline Description',
      type: 'text',
      rows: 3,
      group: 'content',
      initialValue:
        'Engineering military-grade perimeter defense, kernel-level kernel filters, and cloud infrastructure audit pipelines for Fortune 500 enterprises and defense contractors.',
    },
    {
      name: 'ctaPrimaryText',
      title: 'Primary CTA Button Text',
      type: 'string',
      group: 'content',
      initialValue: 'INITIATE AUDIT WIZARD',
    },
    {
      name: 'ctaSecondaryText',
      title: 'Secondary CTA Button Text',
      type: 'string',
      group: 'content',
      initialValue: 'LAUNCH LAB SIMULATOR',
    },
    {
      name: 'terminalQuickCommand',
      title: 'Quick Terminal Command',
      type: 'string',
      group: 'content',
      description: 'Command shown in the terminal drawer when user clicks CTA',
      initialValue: 'cyber-ops --audit --level=maximum',
    },
    {
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      group: 'background',
      description: 'Full-screen hero background image (optional, 3D scene used if empty)',
      options: { hotspot: true },
      fields: [
        { name: 'alt', type: 'string', title: 'Alt text' },
      ],
    },
    {
      name: 'backgroundOverlay',
      title: 'Background Overlay Opacity',
      type: 'number',
      group: 'background',
      description: 'Dark overlay opacity 0-1 (default 0.6)',
      options: { range: { min: 0, max: 1, step: 0.1 } },
      initialValue: 0.6,
    },
    {
      name: 'statPills',
      title: 'Stat Pills',
      type: 'array',
      group: 'stats',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'value', type: 'string', title: 'Metric Value' },
            { name: 'label', type: 'string', title: 'Metric Label' },
          ],
          preview: {
            select: { title: 'value', subtitle: 'label' },
          },
        },
      ],
      initialValue: [
        { value: '99.999%', label: 'Uptime SLA' },
        { value: '<0.4ms', label: 'Triage Response' },
        { value: 'Zero', label: 'Breach Record' },
      ],
    },
  ],
  preview: {
    select: {
      title: 'headlinePrimary',
      subtitle: 'headlineAccent',
      media: 'backgroundImage',
    },
    prepare({ title, subtitle, media }: { title?: string; subtitle?: string; media?: any }) {
      return {
        title: title || 'Hero Block',
        subtitle: subtitle || 'No headline set',
        media,
      };
    },
  },
};
