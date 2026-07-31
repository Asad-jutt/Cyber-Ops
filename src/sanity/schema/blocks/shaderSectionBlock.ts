export const shaderSectionBlock = {
  name: 'shaderSectionBlock',
  title: 'Liquid Shader Feature Block',
  type: 'object',
  fields: [
    {
      name: 'title',
      title: 'Section Title',
      type: 'string',
      initialValue: 'QUANTUM FLUID FIELD VISUALIZER',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
      initialValue:
        'Interactive WebGL fluid simulation powered by custom fragment shaders depicting real-time encryption entropy.',
    },
    {
      name: 'color1',
      title: 'Primary Fluid Hex Color',
      type: 'string',
      initialValue: '#00f0ff',
    },
    {
      name: 'color2',
      title: 'Secondary Fluid Hex Color',
      type: 'string',
      initialValue: '#d946ef',
    },
  ],
  preview: {
    select: { title: 'title' },
    prepare({ title }: { title?: string }) {
      return { title: title || 'Shader Feature Block' };
    },
  },
};
