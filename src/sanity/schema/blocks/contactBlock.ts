export const contactBlock = {
  name: 'contactBlock',
  title: 'Contact & Audit Wizard Block',
  type: 'object',
  fields: [
    {
      name: 'badgeText',
      title: 'Badge Text',
      type: 'string',
      initialValue: 'CONFIDENTIAL TRIAGE // INITIATE ENGAGEMENT',
    },
    {
      name: 'sectionTitle',
      title: 'Section Title',
      type: 'string',
      initialValue: 'COMMISSION A COMPREHENSIVE CYBERSECURITY AUDIT',
    },
    {
      name: 'subtext',
      title: 'Subtext',
      type: 'text',
      rows: 2,
      initialValue:
        'Ready to fortify your enterprise infrastructure against nation-state APTs and quantum decryption threats? Complete our 4-step confidential audit wizard below for immediate triage by our principal architects.',
    },
    {
      name: 'directEmail',
      title: 'Direct Security Email',
      type: 'string',
      initialValue: 'triage@cyberops.sec',
    },
    {
      name: 'pgpFingerprint',
      title: 'PGP Key Fingerprint',
      type: 'string',
      initialValue: '4F8A 9B2C 11E3 D09A 7782 559C 3341 A10B 9901 882E',
    },
    {
      name: 'auditQuestions',
      title: 'Audit Form Default Values & Options',
      type: 'object',
      fields: [
        {
          name: 'organizationTypes',
          type: 'array',
          of: [{ type: 'string' }],
          title: 'Organization Types',
        },
        {
          name: 'scopeOptions',
          type: 'array',
          of: [{ type: 'string' }],
          title: 'Scope Options',
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
};
