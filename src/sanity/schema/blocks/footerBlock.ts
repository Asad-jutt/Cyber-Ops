export const footerBlock = {
  name: 'footerBlock',
  title: 'Footer Block',
  type: 'object',
  groups: [
    { name: 'brand', title: 'Brand', default: true },
    { name: 'legal', title: 'Legal' },
  ],
  fields: [
    {
      name: 'brandName',
      title: 'Brand Name',
      type: 'string',
      group: 'brand',
      description: 'Displayed in the footer (e.g. CYBER OPS // CYBERSECURITY LABS)',
      initialValue: 'CYBER OPS // CYBERSECURITY LABS',
    },
    {
      name: 'tagline',
      title: 'Brand Tagline',
      type: 'text',
      rows: 2,
      group: 'brand',
      description: 'Short tagline or mission statement',
      initialValue:
        'Next-generation cybersecurity engineering, resilient enterprise infrastructure, and post-quantum cryptography solutions.',
    },
    {
      name: 'statusText',
      title: 'Security Status Text',
      type: 'string',
      group: 'brand',
      initialValue: 'DEFCON 5 // ALL NODES SECURE',
    },
    {
      name: 'copyrightNotice',
      title: 'Copyright Notice',
      type: 'string',
      group: 'legal',
      initialValue: '© 2026 CYBER OPS CONSULTING INC. ALL RIGHTS RESERVED.',
    },
    {
      name: 'socialLinks',
      title: 'Social / External Links',
      type: 'array',
      group: 'brand',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', type: 'string', title: 'Label (e.g. GitHub)' },
            { name: 'url', type: 'url', title: 'URL' },
          ],
        },
      ],
    },
  ],
  preview: {
    select: { title: 'brandName', subtitle: 'copyrightNotice' },
    prepare({ title, subtitle }: { title?: string; subtitle?: string }) {
      return { title: title || 'Footer Block', subtitle: subtitle || 'No copyright set' };
    },
  },
};
