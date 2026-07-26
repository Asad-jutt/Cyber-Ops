import React, { useEffect } from 'react';
import { VisualEditing } from '@sanity/visual-editing/react';

export function VisualEditingOverlay() {
  return (
    <>
      <VisualEditing portal={true} />
    </>
  );
}
