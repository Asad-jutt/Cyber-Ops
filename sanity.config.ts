import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { presentationTool } from '@sanity/presentation';
import { schemaTypes } from './src/sanity/schema';

export default defineConfig({
  name: 'cyber-ops',
  title: 'Cyber Ops',
  projectId: '6tm6vd42',
  dataset: 'production',
  plugins: [
    structureTool(),
    visionTool(),
    presentationTool({
      previewUrl: {
        origin: process.env.SANITY_STUDIO_PREVIEW_URL || 'http://localhost:4321',
        previewMode: {
          enable: '/api/preview',
        },
      },
    }),
  ],
  schema: {
    types: schemaTypes,
  },
  document: {
    newDocumentOptions: (prev, { creationContext }) => {
      if (creationContext.type === 'global') {
        return prev.filter(
          (template) => template.templateId !== 'siteSettings'
        );
      }
      return prev;
    },
  },
});
