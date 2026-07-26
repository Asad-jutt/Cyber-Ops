export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  fullDescription: string;
  image: string;
  tags: string[];
  year: string;
  client: string;
  role: string;
  metrics: { label: string; value: string }[];
  color: string;
}

export interface LabSettings {
  geometry: 'icosahedron' | 'octahedron' | 'torusKnot' | 'dodecahedron' | 'crystalMatrix';
  wireframe: boolean;
  rotationSpeed: number;
  particleCount: number;
  primaryColor: string;
  accentColor: string;
  metalness: number;
  roughness: number;
  bloomIntensity: number;
  lightIntensity: number;
}

export type NavSection = 'home' | 'work' | 'stack' | 'lab' | 'about' | 'contact';
