export const worksBlock = {
  name: 'worksBlock',
  title: 'Works & Case Studies Section',
  type: 'object',
  fields: [
    {
      name: 'badgeText',
      title: 'Badge Text',
      type: 'string',
      initialValue: 'ENTERPRISE ENGAGEMENTS // PORTFOLIO',
    },
    {
      name: 'sectionTitle',
      title: 'Section Title',
      type: 'string',
      initialValue: 'MISSION-CRITICAL CYBER OPS & RED TEAM SIMULATIONS',
    },
    {
      name: 'subtitle',
      title: 'Subtitle',
      type: 'text',
      rows: 2,
      initialValue:
        'Explore real-world case studies detailing custom exploit remediation, quantum cryptography deployments, and zero-day threat elimination.',
    },
    {
      name: 'projects',
      title: 'Featured Projects',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'id', type: 'string', title: 'Project ID' },
            { name: 'title', type: 'string', title: 'Title' },
            { name: 'category', type: 'string', title: 'Category' },
            { name: 'description', type: 'text', title: 'Short Description' },
            { name: 'fullDescription', type: 'text', title: 'Full Technical Case Study' },
            {
              name: 'mainImage',
              type: 'image',
              title: 'Project Image',
              options: { hotspot: true },
            },
            { name: 'imageUrl', type: 'url', title: 'Fallback Image URL' },
            {
              name: 'tags',
              type: 'array',
              of: [{ type: 'string' }],
              title: 'Tech Tags',
            },
            { name: 'year', type: 'string', title: 'Year' },
            { name: 'client', type: 'string', title: 'Client' },
            { name: 'role', type: 'string', title: 'Role' },
            {
              name: 'metrics',
              type: 'array',
              title: 'Key Metrics',
              of: [
                {
                  type: 'object',
                  fields: [
                    { name: 'label', type: 'string', title: 'Metric Label' },
                    { name: 'value', type: 'string', title: 'Metric Value' },
                  ],
                },
              ],
            },
            { name: 'accentColor', type: 'string', title: 'Accent Hex Color' },
            { name: 'terminalCommand', type: 'string', title: 'Terminal Demo Command' },
          ],
        },
      ],
    },
  ],
};
