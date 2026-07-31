import React, { useEffect } from 'react';
import { VisualEditing } from '@sanity/visual-editing/react';

export function VisualEditingOverlay() {
  if (import.meta.env.PROD) return null;

  return (
    <>
      <VisualEditing portal={true} />
    </>
  );
}
