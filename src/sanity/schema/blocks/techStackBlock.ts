export const techStackBlock = {
  name: 'techStackBlock',
  title: 'Tech Stack & Capabilities Section',
  type: 'object',
  fields: [
    {
      name: 'badgeText',
      title: 'Badge Text',
      type: 'string',
      initialValue: 'CORE CAPABILITIES // STACK MATRIX',
    },
    {
      name: 'sectionTitle',
      title: 'Section Title',
      type: 'string',
      initialValue: 'DEFENSE-GRADE CYBERSECURITY CAPABILITIES',
    },
    {
      name: 'subtitle',
      title: 'Subtitle',
      type: 'text',
      rows: 2,
      initialValue:
        'Custom-engineered threat intelligence feeds, hardware security modules, and automated incident response pipelines.',
    },
    {
      name: 'capabilities',
      title: 'Capability Cards',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'id', type: 'string', title: 'Card ID' },
            { name: 'title', type: 'string', title: 'Capability Title' },
            { name: 'description', type: 'text', title: 'Description' },
            { name: 'iconName', type: 'string', title: 'Lucide Icon Name' },
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
        },
      ],
    },
  ],
};
