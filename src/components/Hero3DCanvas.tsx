import React, { useRef, useMemo, useEffect, useState, Component, ReactNode } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { LabSettings } from '../types';
import { Shield, Cpu, Activity } from 'lucide-react';

interface Hero3DCanvasProps {
  labSettings?: LabSettings;
  mousePosition?: { x: number; y: number };
}

// Deterministic seeded PRNG so the 3D scene renders identically on every load
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Default lab settings if not provided
const defaultSettings: LabSettings = {
  geometry: 'crystalMatrix',
  wireframe: false,
  rotationSpeed: 0.6,
  particleCount: 1200,
  primaryColor: '#00f0ff',
  accentColor: '#d946ef',
  metalness: 0.85,
  roughness: 0.15,
  bloomIntensity: 1.2,
  lightIntensity: 2.5
};

// React Error Boundary for WebGL Context Creation Failures
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class WebGLErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any) {
    console.warn('WebGL Context rendering exception handled gracefully:', error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Stylish CSS 3D Cyber Matrix Fallback when WebGL Context is disabled or lost
function CyberMatrixCSSFallback({ labSettings }: { labSettings: LabSettings }) {
  const primaryColor = labSettings.primaryColor || '#00f0ff';
  const accentColor = labSettings.accentColor || '#d946ef';

  return (
    <div className="relative w-full h-full min-h-[500px] flex items-center justify-center overflow-hidden">
      {/* Ambient Radial Glow */}
      <div
        className="absolute w-96 h-96 rounded-full blur-[100px] opacity-40 animate-pulse pointer-events-none"
        style={{ backgroundColor: primaryColor }}
      />
      <div
        className="absolute w-80 h-80 rounded-full blur-[80px] opacity-30 animate-pulse pointer-events-none"
        style={{ backgroundColor: accentColor, animationDelay: '1s' }}
      />

      {/* 3D Rotating CSS Wireframe Polyhedron */}
      <div className="relative w-72 h-72 flex items-center justify-center perspective-[1000px]">
        {/* Outer Orbit Ring */}
        <div
          className="absolute inset-0 rounded-full border border-dashed animate-[spin_20s_linear_infinite]"
          style={{ borderColor: primaryColor, opacity: 0.4 }}
        />
        <div
          className="absolute inset-4 rounded-full border border-dotted animate-[spin_12s_linear_infinite_reverse]"
          style={{ borderColor: accentColor, opacity: 0.5 }}
        />

        {/* Central Rotating Cyber Core */}
        <div className="relative w-48 h-48 animate-[spin_10s_linear_infinite] [transform-style:preserve-3d]">
          <div
            className="absolute inset-0 border-2 rounded-2xl flex items-center justify-center backdrop-blur-sm [transform:rotateX(45deg)_rotateY(45deg)] shadow-[0_0_30px_rgba(0,240,255,0.3)] transition-all"
            style={{ borderColor: primaryColor, backgroundColor: `${primaryColor}10` }}
          >
            <Shield className="w-16 h-16 animate-pulse" style={{ color: primaryColor }} />
          </div>

          <div
            className="absolute inset-2 border-2 rounded-2xl flex items-center justify-center [transform:rotateX(-45deg)_rotateY(45deg)]"
            style={{ borderColor: accentColor, backgroundColor: `${accentColor}10` }}
          >
            <Cpu className="w-12 h-12" style={{ color: accentColor }} />
          </div>

          <div
            className="absolute inset-6 border border-cyan-400/60 rounded-full flex items-center justify-center [transform:rotateY(90deg)] animate-ping"
            style={{ animationDuration: '3s' }}
          >
            <Activity className="w-8 h-8 text-cyan-300" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Outer Orbiting Crystal Shards
function OrbitingShards({ primaryColor, accentColor }: { primaryColor: string; accentColor: string }) {
  const groupRef = useRef<THREE.Group>(null);

  const shardData = useMemo(() => {
    const rng = mulberry32(1337);
    const shards = [];
    const count = 14;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 3.2 + rng() * 2.0;
      const yOffset = (rng() - 0.5) * 2.2;
      const scale = 0.12 + rng() * 0.2;
      const speed = (0.2 + rng() * 0.3) * (i % 2 === 0 ? 1 : -1);
      const isPrimary = i % 2 === 0;
      shards.push({ angle, radius, yOffset, scale, speed, isPrimary });
    }
    return shards;
  }, []);

  const shardRefs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
    }
    shardRefs.current.forEach((mesh, idx) => {
      if (mesh) {
        mesh.rotation.x += delta * 0.4;
        mesh.rotation.z += delta * 0.3;
        const data = shardData[idx];
        if (data) {
          const currentAngle = data.angle + state.clock.getElapsedTime() * data.speed * 0.3;
          mesh.position.x = Math.cos(currentAngle) * data.radius;
          mesh.position.z = Math.sin(currentAngle) * data.radius;
          mesh.position.y = data.yOffset + Math.sin(state.clock.getElapsedTime() * 1.5 + idx) * 0.2;
        }
      }
    });
  });

  return (
    <group ref={groupRef}>
      {shardData.map((data, i) => (
        <mesh
          key={i}
          ref={(el) => { shardRefs.current[i] = el; }}
          scale={[data.scale, data.scale * 1.8, data.scale]}
        >
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color={data.isPrimary ? primaryColor : accentColor}
            metalness={0.8}
            roughness={0.2}
            emissive={data.isPrimary ? primaryColor : accentColor}
            emissiveIntensity={0.4}
            transparent
            opacity={0.85}
          />
        </mesh>
      ))}
    </group>
  );
}

// Particle Dust Matrix
function ParticleField({ count = 1000, primaryColor, accentColor }: { count: number; primaryColor: string; accentColor: string }) {
  const pointsRef = useRef<THREE.Points>(null);
  const safeCount = Math.min(count, 1200);

  const [positions, colors] = useMemo(() => {
    const rng = mulberry32(4242);
    const pos = new Float32Array(safeCount * 3);
    const col = new Float32Array(safeCount * 3);
    const color1 = new THREE.Color(primaryColor);
    const color2 = new THREE.Color(accentColor);
    const color3 = new THREE.Color('#ffffff');

    for (let i = 0; i < safeCount; i++) {
      const radius = 2 + rng() * 10;
      const theta = rng() * Math.PI * 2;
      const phi = Math.acos((rng() * 2) - 1);

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = (rng() - 0.5) * 8;
      pos[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

      const rand = rng();
      const mixedColor = rand < 0.6 ? color1 : rand < 0.9 ? color2 : color3;
      col[i * 3] = mixedColor.r;
      col[i * 3 + 1] = mixedColor.g;
      col[i * 3 + 2] = mixedColor.b;
    }
    return [pos, col];
  }, [safeCount, primaryColor, accentColor]);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.03;
      pointsRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.05;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        vertexColors
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

// Central Main Artifact
function MainArtifact({ settings }: { settings: LabSettings }) {
  const mainRef = useRef<THREE.Group>(null);
  const coreMeshRef = useRef<THREE.Mesh>(null);
  const innerMeshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const speed = settings.rotationSpeed;
    if (mainRef.current) {
      mainRef.current.rotation.y += delta * 0.3 * speed;
      mainRef.current.rotation.x += delta * 0.1 * speed;
    }
    if (coreMeshRef.current) {
      coreMeshRef.current.rotation.y -= delta * 0.2 * speed;
      coreMeshRef.current.rotation.z += delta * 0.15 * speed;
    }
    if (innerMeshRef.current) {
      innerMeshRef.current.rotation.x += delta * 0.5 * speed;
      const pulse = 1 + Math.sin(state.clock.getElapsedTime() * 2) * 0.08;
      innerMeshRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  const renderMainGeometry = () => {
    switch (settings.geometry) {
      case 'octahedron':
        return <octahedronGeometry args={[2, 1]} />;
      case 'torusKnot':
        return <torusKnotGeometry args={[1.2, 0.35, 64, 16]} />;
      case 'dodecahedron':
        return <dodecahedronGeometry args={[2, 0]} />;
      case 'icosahedron':
      case 'crystalMatrix':
      default:
        return <icosahedronGeometry args={[2, 1]} />;
    }
  };

  return (
    <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.6}>
      <group ref={mainRef}>
        {/* Outer Shell Matrix */}
        <mesh ref={coreMeshRef}>
          {renderMainGeometry()}
          <meshStandardMaterial
            color={settings.primaryColor}
            metalness={settings.metalness}
            roughness={settings.roughness}
            wireframe={settings.wireframe}
            transparent
            opacity={0.85}
            emissive={settings.primaryColor}
            emissiveIntensity={0.3}
          />
        </mesh>

        {/* Wireframe Outer Cage */}
        <mesh scale={[1.08, 1.08, 1.08]}>
          {renderMainGeometry()}
          <meshBasicMaterial
            color={settings.accentColor}
            wireframe
            transparent
            opacity={0.4}
          />
        </mesh>

        {/* Inner Core */}
        <mesh ref={innerMeshRef} scale={[0.85, 0.85, 0.85]}>
          <icosahedronGeometry args={[1.2, 0]} />
          <meshStandardMaterial
            color={settings.accentColor}
            emissive={settings.accentColor}
            emissiveIntensity={settings.bloomIntensity * 1.2}
            roughness={0.2}
            metalness={0.8}
            wireframe={settings.wireframe}
          />
        </mesh>
      </group>
    </Float>
  );
}

// Camera Mouse Rig
function CameraParallaxRig({ mousePosition }: { mousePosition?: { x: number; y: number } }) {
  const { camera } = useThree();
  const targetVec = useRef(new THREE.Vector3(0, 0, 7));

  useEffect(() => {
    if (mousePosition) {
      const targetX = (mousePosition.x - 0.5) * 1.8;
      const targetY = -(mousePosition.y - 0.5) * 1.2;
      targetVec.current.set(targetX, targetY, 7);
    }
  }, [mousePosition]);

  useFrame((_, delta) => {
    camera.position.lerp(targetVec.current, delta * 2.5);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// Scene Lighting
function SceneLighting({ settings }: { settings: LabSettings }) {
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (lightRef.current) {
      const t = state.clock.getElapsedTime();
      lightRef.current.position.x = Math.sin(t * 0.8) * 5;
      lightRef.current.position.z = Math.cos(t * 0.8) * 5;
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 8]} intensity={settings.lightIntensity} color="#ffffff" />
      <pointLight ref={lightRef} position={[0, 3, 4]} intensity={3.0} color={settings.primaryColor} distance={15} />
      <pointLight position={[-5, -4, -4]} intensity={2.0} color={settings.accentColor} distance={15} />
    </>
  );
}

function WebGL3DScene({ labSettings, mousePosition }: { labSettings: LabSettings; mousePosition?: { x: number; y: number } }) {
  const [contextLost, setContextLost] = useState(false);

  if (contextLost) {
    return <CyberMatrixCSSFallback labSettings={labSettings} />;
  }

  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 45 }}
      gl={{
        antialias: true,
        powerPreference: 'default',
        failIfMajorPerformanceCaveat: false,
        alpha: true
      }}
      dpr={[1, 1.5]}
      onCreated={({ gl }) => {
        const canvas = gl.domElement;
        const handleContextLost = (e: Event) => {
          e.preventDefault();
          console.warn('WebGL context lost event captured. Switching to CSS 3D fallback.');
          setContextLost(true);
        };
        canvas.addEventListener('webglcontextlost', handleContextLost, false);
      }}
    >
      <color attach="background" args={['#0b0f19']} />
      <fog attach="fog" args={['#0b0f19', 6, 18]} />

      <SceneLighting settings={labSettings} />
      <MainArtifact settings={labSettings} />
      <OrbitingShards primaryColor={labSettings.primaryColor} accentColor={labSettings.accentColor} />
      <ParticleField
        count={labSettings.particleCount}
        primaryColor={labSettings.primaryColor}
        accentColor={labSettings.accentColor}
      />
      <CameraParallaxRig mousePosition={mousePosition} />
    </Canvas>
  );
}

export function Hero3DCanvas({ labSettings = defaultSettings, mousePosition }: Hero3DCanvasProps) {
  return (
    <div className="relative w-full h-full min-h-[500px] pointer-events-auto">
      <WebGLErrorBoundary fallback={<CyberMatrixCSSFallback labSettings={labSettings} />}>
        <WebGL3DScene labSettings={labSettings} mousePosition={mousePosition} />
      </WebGLErrorBoundary>
    </div>
  );
}
