export const labBlock = {
  name: 'labBlock',
  title: 'Cyber Lab / War Room Simulator Block',
  type: 'object',
  groups: [
    { name: 'header', title: 'Section Header', default: true },
    { name: 'controls', title: 'Default Controls' },
  ],
  fields: [
    {
      name: 'badgeText',
      title: 'Badge / Eyebrow Text',
      type: 'string',
      group: 'header',
      initialValue: 'LAB SIMULATOR // INTERACTIVE 3D WIREFRAME',
    },
    {
      name: 'sectionTitle',
      title: 'Section Title',
      type: 'string',
      group: 'header',
      initialValue: 'QUANTUM GEOMETRY & TOPOLOGY CONTROL LABORATORY',
    },
    {
      name: 'subtitle',
      title: 'Subtitle / Description',
      type: 'text',
      rows: 2,
      group: 'header',
      initialValue:
        'Manipulate 3D spatial field parameters, WebGL bloom thresholds, and particle dispersion vector dynamics in real-time.',
    },
    {
      name: 'defaultGeometry',
      title: 'Default 3D Geometry',
      type: 'string',
      group: 'controls',
      options: {
        list: [
          { title: 'Lattice Vault (Crystal Matrix)', value: 'crystalMatrix' },
          { title: 'Icosa Shield (Icosahedron)', value: 'icosahedron' },
          { title: 'SOC Matrix (Octahedron)', value: 'octahedron' },
          { title: 'Torus Node (Torus Knot)', value: 'torusKnot' },
          { title: 'Dodeca Cell (Dodecahedron)', value: 'dodecahedron' },
        ],
      },
      initialValue: 'crystalMatrix',
    },
    {
      name: 'primaryColorHex',
      title: 'Primary Particle Color (Hex)',
      type: 'string',
      group: 'controls',
      initialValue: '#00f0ff',
    },
    {
      name: 'accentColorHex',
      title: 'Accent Particle Color (Hex)',
      type: 'string',
      group: 'controls',
      initialValue: '#d946ef',
    },
  ],
  preview: {
    select: { title: 'sectionTitle', subtitle: 'badgeText' },
    prepare({ title, subtitle }: { title?: string; subtitle?: string }) {
      return { title: title || 'Lab Section', subtitle: subtitle || 'War Room Simulator' };
    },
  },
};
