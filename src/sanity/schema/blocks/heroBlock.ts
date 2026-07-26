export const heroBlock = {
  name: 'heroBlock',
  title: 'Hero Block',
  type: 'object',
  fields: [
    {
      name: 'statusBadge',
      title: 'Status Badge Text',
      type: 'string',
      initialValue: 'SYSTEM STATUS // ALL SYSTEMS HARDENED',
    },
    {
      name: 'headlinePrimary',
      title: 'Headline Primary Line',
      type: 'string',
      initialValue: 'ADVANCED SECURITY ARCHITECTURE &',
    },
    {
      name: 'headlineAccent',
      title: 'Headline Accent Line (Glow)',
      type: 'string',
      initialValue: 'QUANTUM-RESISTANT CYBER OPS',
    },
    {
      name: 'subheadline',
      title: 'Subheadline',
      type: 'text',
      rows: 3,
      initialValue:
        'Engineering military-grade perimeter defense, kernel-level kernel filters, and cloud infrastructure audit pipelines for Fortune 500 enterprises and defense contractors.',
    },
    {
      name: 'ctaPrimaryText',
      title: 'Primary CTA Text',
      type: 'string',
      initialValue: 'INITIATE AUDIT WIZARD',
    },
    {
      name: 'ctaSecondaryText',
      title: 'Secondary CTA Text',
      type: 'string',
      initialValue: 'LAUNCH LAB SIMULATOR',
    },
    {
      name: 'statPills',
      title: 'Stat Pills',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'value', type: 'string', title: 'Metric Value' },
            { name: 'label', type: 'string', title: 'Metric Label' },
          ],
        },
      ],
      initialValue: [
        { value: '99.999%', label: 'Uptime SLA' },
        { value: '<0.4ms', label: 'Triage Response' },
        { value: 'Zero', label: 'Breach Record' },
      ],
    },
    {
      name: 'terminalQuickCommand',
      title: 'Quick Terminal Command',
      type: 'string',
      initialValue: 'cyber-ops --audit --level=maximum',
    },
  ],
};
