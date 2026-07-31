export const worksBlock = {
  name: 'worksBlock',
  title: 'Works & Case Studies Section',
  type: 'object',
  groups: [
    { name: 'header', title: 'Section Header', default: true },
    { name: 'projects', title: 'Projects' },
  ],
  fields: [
    {
      name: 'badgeText',
      title: 'Badge / Eyebrow Text',
      type: 'string',
      group: 'header',
      initialValue: 'ENTERPRISE ENGAGEMENTS // PORTFOLIO',
    },
    {
      name: 'sectionTitle',
      title: 'Section Title',
      type: 'string',
      group: 'header',
      initialValue: 'MISSION-CRITICAL CYBER OPS & RED TEAM SIMULATIONS',
    },
    {
      name: 'subtitle',
      title: 'Subtitle / Description',
      type: 'text',
      rows: 2,
      group: 'header',
      initialValue:
        'Explore real-world case studies detailing custom exploit remediation, quantum cryptography deployments, and zero-day threat elimination.',
    },
    {
      name: 'projects',
      title: 'Featured Projects / Case Studies',
      type: 'array',
      group: 'projects',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'id', type: 'string', title: 'Project ID' },
            { name: 'title', type: 'string', title: 'Project Title', validation: (Rule: any) => Rule.required() },
            { name: 'category', type: 'string', title: 'Category' },
            { name: 'description', type: 'text', title: 'Short Description (Card)' },
            { name: 'fullDescription', type: 'text', title: 'Full Technical Case Study' },
            {
              name: 'mainImage',
              type: 'image',
              title: 'Project Image',
              options: { hotspot: true },
              fields: [{ name: 'alt', type: 'string', title: 'Alt text' }],
            },
            { name: 'imageUrl', type: 'url', title: 'Fallback Image URL' },
            {
              name: 'tags',
              type: 'array',
              of: [{ type: 'string' }],
              title: 'Tech Tags',
            },
            { name: 'year', type: 'string', title: 'Engagement Year' },
            { name: 'client', type: 'string', title: 'Client Entity' },
            { name: 'role', type: 'string', title: 'Your Role' },
            {
              name: 'metrics',
              type: 'array',
              title: 'Key Metrics (displayed in modal)',
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
            { name: 'accentColor', type: 'string', title: 'Accent Hex Color (e.g. #00f0ff)' },
            { name: 'terminalCommand', type: 'string', title: 'Terminal Demo Command' },
          ],
          preview: {
            select: { title: 'title', subtitle: 'category', media: 'mainImage' },
            prepare({ title, subtitle, media }: { title?: string; subtitle?: string; media?: any }) {
              return { title: title || 'Untitled Project', subtitle: subtitle || '', media };
            },
          },
        },
      ],
    },
  ],
  preview: {
    select: { title: 'sectionTitle', subtitle: 'badgeText' },
    prepare({ title, subtitle }: { title?: string; subtitle?: string }) {
      return {
        title: title || 'Works Section',
        subtitle: subtitle || 'Case Studies',
      };
    },
  },
};
