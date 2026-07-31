export const techStackBlock = {
  name: 'techStackBlock',
  title: 'Tech Stack & Capabilities Section',
  type: 'object',
  groups: [
    { name: 'header', title: 'Section Header', default: true },
    { name: 'capabilities', title: 'Capability Cards' },
  ],
  fields: [
    {
      name: 'badgeText',
      title: 'Badge / Eyebrow Text',
      type: 'string',
      group: 'header',
      initialValue: 'CORE CAPABILITIES // STACK MATRIX',
    },
    {
      name: 'sectionTitle',
      title: 'Section Title',
      type: 'string',
      group: 'header',
      initialValue: 'DEFENSE-GRADE CYBERSECURITY CAPABILITIES',
    },
    {
      name: 'subtitle',
      title: 'Subtitle / Description',
      type: 'text',
      rows: 2,
      group: 'header',
      initialValue:
        'Custom-engineered threat intelligence feeds, hardware security modules, and automated incident response pipelines.',
    },
    {
      name: 'capabilities',
      title: 'Capability Cards',
      type: 'array',
      group: 'capabilities',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'id', type: 'string', title: 'Card ID' },
            { name: 'title', type: 'string', title: 'Capability Title', validation: (Rule: any) => Rule.required() },
            { name: 'description', type: 'text', title: 'Description', rows: 3 },
            { name: 'iconName', type: 'string', title: 'Lucide Icon Name (e.g. Shield, Lock, Cpu)' },
            { name: 'accentHex', type: 'string', title: 'Accent Hex Color' },
            {
              name: 'tags',
              type: 'array',
              of: [{ type: 'string' }],
              title: 'Technologies & Frameworks',
            },
            {
              name: 'telemetryMetrics',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    { name: 'label', type: 'string', title: 'Label' },
                    { name: 'val', type: 'string', title: 'Value' },
                  ],
                },
              ],
              title: 'Telemetry Metrics',
            },
          ],
          preview: {
            select: { title: 'title', subtitle: 'description' },
          },
        },
      ],
    },
  ],
  preview: {
    select: { title: 'sectionTitle', subtitle: 'badgeText' },
    prepare({ title, subtitle }: { title?: string; subtitle?: string }) {
      return { title: title || 'Tech Stack Section', subtitle: subtitle || 'Capabilities' };
    },
  },
};
