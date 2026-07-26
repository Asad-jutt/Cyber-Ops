export const labBlock = {
  name: 'labBlock',
  title: 'Cyber Lab Simulator Block',
  type: 'object',
  fields: [
    {
      name: 'badgeText',
      title: 'Badge Text',
      type: 'string',
      initialValue: 'LAB SIMULATOR // INTERACTIVE 3D WIREFRAME',
    },
    {
      name: 'sectionTitle',
      title: 'Section Title',
      type: 'string',
      initialValue: 'QUANTUM GEOMETRY & TOPOLOGY CONTROL LABORATORY',
    },
    {
      name: 'subtitle',
      title: 'Subtitle',
      type: 'text',
      rows: 2,
      initialValue:
        'Manipulate 3D spatial field parameters, WebGL bloom thresholds, and particle dispersion vector dynamics in real-time.',
    },
    {
      name: 'defaultGeometry',
      title: 'Default Geometry',
      type: 'string',
      options: {
        list: [
          { title: 'Crystal Matrix', value: 'crystalMatrix' },
          { title: 'Icosahedron', value: 'icosahedron' },
          { title: 'Octahedron', value: 'octahedron' },
          { title: 'Torus Knot', value: 'torusKnot' },
          { title: 'Dodecahedron', value: 'dodecahedron' },
        ],
      },
      initialValue: 'crystalMatrix',
    },
    {
      name: 'primaryColorHex',
      title: 'Primary Particle Color',
      type: 'string',
      initialValue: '#00f0ff',
    },
    {
      name: 'accentColorHex',
      title: 'Accent Particle Color',
      type: 'string',
      initialValue: '#d946ef',
    },
  ],
};
