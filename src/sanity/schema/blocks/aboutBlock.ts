export const aboutBlock = {
  name: 'aboutBlock',
  title: 'About & Security Pillars Section',
  type: 'object',
  fields: [
    {
      name: 'badgeText',
      title: 'Badge Text',
      type: 'string',
      initialValue: 'ORIGIN & DOCTRINE // EXECUTIVE SUMMARY',
    },
    {
      name: 'sectionTitle',
      title: 'Section Title',
      type: 'string',
      initialValue: 'ENGINEERED FOR UNCOMPROMISING DIGITAL SURVIVAL',
    },
    {
      name: 'storyHeadline',
      title: 'Story Headline',
      type: 'string',
      initialValue: 'COMBAT-TESTED CYBERSECURITY ARCHITECTS',
    },
    {
      name: 'storyParagraphs',
      title: 'Story Paragraphs',
      type: 'array',
      of: [{ type: 'text' }],
      initialValue: [
        'Founded by former intelligence agency security directors and principal cryptography engineers, Cyber Ops operates on a singular mandate: complete digital immunity.',
        'We do not rely on passive signature scanners or off-the-shelf antivirus rulesets. We engineer bespoke, kernel-level kernel hooks, zero-trust cryptographic handshakes, and quantum-safe key distribution systems that neutralize attacks before payload execution.',
      ],
    },
    {
      name: 'pillars',
      title: 'Security Pillars',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', type: 'string', title: 'Pillar Title' },
            { name: 'desc', type: 'text', title: 'Description' },
            { name: 'iconName', type: 'string', title: 'Icon Name' },
          ],
        },
      ],
    },
    {
      name: 'stats',
      title: 'Key Track Record Stats',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'value', type: 'string', title: 'Stat Value' },
            { name: 'label', type: 'string', title: 'Stat Label' },
            { name: 'desc', type: 'string', title: 'Detailed Context' },
          ],
        },
      ],
    },
  ],
};
