export const siteSettingsSchema = {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  groups: [
    { name: 'brand', title: 'Branding', default: true },
    { name: 'nav', title: 'Navigation' },
    { name: 'seo', title: 'SEO & Social' },
  ],
  fields: [
    {
      name: 'title',
      title: 'Site Title',
      type: 'string',
      group: 'brand',
      initialValue: 'Cyber Ops // Enterprise Cyber Security Consulting',
    },
    {
      name: 'brandShortName',
      title: 'Brand Short Name (Navbar)',
      type: 'string',
      group: 'brand',
      description: 'First line of the navbar brand (e.g. CYBER OPS)',
      initialValue: 'CYBER OPS',
    },
    {
      name: 'brandSubtitle',
      title: 'Brand Subtitle (Navbar)',
      type: 'string',
      group: 'brand',
      description: 'Second line of the navbar brand (e.g. DEFENSE CONSULTING)',
      initialValue: 'DEFENSE CONSULTING',
    },
    {
      name: 'logo',
      title: 'Logo Image',
      type: 'image',
      group: 'brand',
      description: 'Optional logo image (replaces the Shield icon in navbar)',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Alt text' }],
    },
    {
      name: 'favicon',
      title: 'Favicon',
      type: 'image',
      group: 'brand',
    },
    {
      name: 'navigation',
      title: 'Navigation Links',
      type: 'array',
      group: 'nav',
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
        { label: 'ENGAGEMENTS', sectionId: 'work' },
        { label: 'CAPABILITIES', sectionId: 'stack' },
        { label: 'WAR ROOM', sectionId: 'lab' },
        { label: 'PHILOSOPHY', sectionId: 'about' },
        { label: 'AUDIT BRIEF', sectionId: 'contact' },
      ],
    },
    {
      name: 'seo',
      title: 'Default SEO Metadata',
      type: 'object',
      group: 'seo',
      fields: [
        {
          name: 'metaTitle',
          title: 'Default Meta Title',
          type: 'string',
          initialValue: 'Cyber Ops | Enterprise & Post-Quantum Defense',
        },
        {
          name: 'metaDescription',
          title: 'Default Meta Description',
          type: 'text',
          rows: 3,
          initialValue:
            'Elite cybersecurity consulting firm delivering advanced architecture, red team penetration testing, and post-quantum encryption.',
        },
        {
          name: 'ogImage',
          title: 'Open Graph / Social Share Image',
          type: 'image',
          options: { hotspot: true },
        },
      ],
    },
  ],
  preview: {
    select: { title: 'title', subtitle: 'brandShortName' },
    prepare({ title, subtitle }: { title?: string; subtitle?: string }) {
      return { title: title || 'Site Settings', subtitle: subtitle || 'Cyber Ops' };
    },
  },
};
