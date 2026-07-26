export const footerBlock = {
  name: 'footerBlock',
  title: 'Footer Block',
  type: 'object',
  fields: [
    {
      name: 'brandName',
      title: 'Brand Name',
      type: 'string',
      initialValue: 'CYBER OPS // ZERO-TRUST LABS',
    },
    {
      name: 'tagline',
      title: 'Brand Tagline',
      type: 'text',
      rows: 2,
      initialValue:
        'Next-generation cybersecurity engineering, zero-trust infrastructure, and post-quantum cryptography solutions.',
    },
    {
      name: 'copyrightNotice',
      title: 'Copyright Notice',
      type: 'string',
      initialValue: '© 2026 CYBER OPS CONSULTING INC. ALL RIGHTS RESERVED.',
    },
    {
      name: 'statusText',
      title: 'Security Status Text',
      type: 'string',
      initialValue: 'DEFCON 5 // ALL NODES SECURE',
    },
  ],
};
