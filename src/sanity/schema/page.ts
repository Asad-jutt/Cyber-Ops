export const pageSchema = {
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Page Title',
      type: 'string',
      initialValue: 'Cyber Ops // Zero-Trust Cyber Security Consulting',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    },
    {
      name: 'globalTheme',
      title: 'Global Cyber Theme Colors',
      type: 'object',
      fields: [
        {
          name: 'primaryHex',
          title: 'Primary Cyber Hex (#00f0ff)',
          type: 'string',
          initialValue: '#00f0ff',
        },
        {
          name: 'secondaryHex',
          title: 'Secondary Accent Hex (#d946ef)',
          type: 'string',
          initialValue: '#d946ef',
        },
        {
          name: 'backgroundHex',
          title: 'Background Dark Hex (#0b0f19)',
          type: 'string',
          initialValue: '#0b0f19',
        },
      ],
    },
    {
      name: 'seo',
      title: 'SEO Metadata',
      type: 'object',
      fields: [
        {
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
          initialValue: 'Cyber Ops | Zero-Trust & Post-Quantum Defense',
        },
        {
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          rows: 3,
          initialValue:
            'Elite cybersecurity consulting firm delivering zero-trust architecture, red team penetration testing, and post-quantum encryption.',
        },
      ],
    },
    {
      name: 'navigation',
      title: 'Navigation Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', type: 'string', title: 'Link Label' },
            { name: 'sectionId', type: 'string', title: 'Target Section ID' },
          ],
        },
      ],
      initialValue: [
        { label: '// 01. WORK', sectionId: 'work' },
        { label: '// 02. STACK', sectionId: 'stack' },
        { label: '// 03. LAB', sectionId: 'lab' },
        { label: '// 04. ABOUT', sectionId: 'about' },
        { label: '// 05. AUDIT', sectionId: 'contact' },
      ],
    },
    {
      name: 'blocks',
      title: 'Page Builder Blocks',
      type: 'array',
      description: 'Add, reorder, or customize page blocks dynamically in the Sanity Visual Editor.',
      of: [
        { type: 'heroBlock' },
        { type: 'worksBlock' },
        { type: 'techStackBlock' },
        { type: 'labBlock' },
        { type: 'aboutBlock' },
        { type: 'contactBlock' },
        { type: 'shaderSectionBlock' },
        { type: 'footerBlock' },
      ],
    },
  ],
};
