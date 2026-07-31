export const contactBlock = {
  name: 'contactBlock',
  title: 'Contact & Audit Wizard Block',
  type: 'object',
  groups: [
    { name: 'header', title: 'Section Header', default: true },
    { name: 'contactInfo', title: 'Contact Information' },
    { name: 'formDefaults', title: 'Form Defaults' },
  ],
  fields: [
    {
      name: 'badgeText',
      title: 'Badge / Eyebrow Text',
      type: 'string',
      group: 'header',
      initialValue: 'CONFIDENTIAL TRIAGE // INITIATE ENGAGEMENT',
    },
    {
      name: 'sectionTitle',
      title: 'Section Title',
      type: 'string',
      group: 'header',
      initialValue: 'COMMISSION A COMPREHENSIVE CYBERSECURITY AUDIT',
    },
    {
      name: 'subtext',
      title: 'Subtext / Description',
      type: 'text',
      rows: 2,
      group: 'header',
      initialValue:
        'Ready to fortify your enterprise infrastructure against nation-state APTs and quantum decryption threats? Complete our 4-step confidential audit wizard below for immediate triage by our principal architects.',
    },
    {
      name: 'email',
      title: 'Contact Email Address',
      type: 'string',
      group: 'contactInfo',
      initialValue: 'cyberops@gmail.com',
    },
    {
      name: 'phone',
      title: 'Phone / Hotline',
      type: 'string',
      group: 'contactInfo',
      description: 'Displayed next to the email in the contact section',
      initialValue: '24/7 INCIDENT HOTLINE // PGP ENCRYPTED',
    },
    {
      name: 'pgpFingerprint',
      title: 'PGP Key Fingerprint',
      type: 'string',
      group: 'contactInfo',
      initialValue: '4F8A 9B2C 11E3 D09A 7782 559C 3341 A10B 9901 882E',
    },
    {
      name: 'locations',
      title: 'Global Office Locations',
      type: 'array',
      group: 'contactInfo',
      of: [{ type: 'string' }],
      initialValue: ['WASHINGTON D.C.', 'GENEVA', 'SINGAPORE'],
    },
    {
      name: 'auditQuestions',
      title: 'Audit Form Default Values & Options',
      type: 'object',
      group: 'formDefaults',
      fields: [
        {
          name: 'organizationTypes',
          type: 'array',
          of: [{ type: 'string' }],
          title: 'Organization Type Options',
        },
        {
          name: 'scopeOptions',
          type: 'array',
          of: [{ type: 'string' }],
          title: 'Scope Option Labels',
        },
        {
          name: 'timelineOptions',
          type: 'array',
          of: [{ type: 'string' }],
          title: 'Timeline Options',
        },
      ],
    },
  ],
  preview: {
    select: { title: 'sectionTitle', subtitle: 'email' },
    prepare({ title, subtitle }: { title?: string; subtitle?: string }) {
      return { title: title || 'Contact Section', subtitle: subtitle || 'No email set' };
    },
  },
};
