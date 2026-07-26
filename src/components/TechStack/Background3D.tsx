import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

interface Background3DProps {
  mousePos?: { x: number; y: number };
}

// Central Complex Wireframe & Crystalline Network Sphere
function CentralTechSphere() {
  const outerGroupRef = useRef<THREE.Group>(null);
  const coreMeshRef = useRef<THREE.Mesh>(null);
  const wireframeRef = useRef<THREE.Mesh>(null);
  const ringGroupRef = useRef<THREE.Group>(null);

  // Generate vertex points for node spheres
  const nodePositions = useMemo(() => {
    const geom = new THREE.IcosahedronGeometry(2.2, 1);
    const posAttr = geom.attributes.position;
    const coords: [number, number, number][] = [];
    const set = new Set<string>();

    for (let i = 0; i < posAttr.count; i++) {
      const x = Number(posAttr.getX(i).toFixed(3));
      const y = Number(posAttr.getY(i).toFixed(3));
      const z = Number(posAttr.getZ(i).toFixed(3));
      const key = `${x},${y},${z}`;
      if (!set.has(key)) {
        set.add(key);
        coords.push([x, y, z]);
      }
    }
    return coords;
  }, []);

  useFrame((state, delta) => {
    if (outerGroupRef.current) {
      outerGroupRef.current.rotation.y += delta * 0.25;
      outerGroupRef.current.rotation.x += delta * 0.1;
    }
    if (coreMeshRef.current) {
      coreMeshRef.current.rotation.y -= delta * 0.35;
      const pulse = 1 + Math.sin(state.clock.getElapsedTime() * 2.5) * 0.05;
      coreMeshRef.current.scale.set(pulse, pulse, pulse);
    }
    if (wireframeRef.current) {
      wireframeRef.current.rotation.z += delta * 0.15;
    }
    if (ringGroupRef.current) {
      ringGroupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.3;
      ringGroupRef.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <group ref={outerGroupRef}>
        {/* Inner Crystalline Core */}
        <mesh ref={coreMeshRef}>
          <icosahedronGeometry args={[1.5, 1]} />
          <meshPhysicalMaterial
            color="#00f0ff"
            emissive="#00f0ff"
            emissiveIntensity={0.6}
            metalness={0.9}
            roughness={0.1}
            transmission={0.6}
            thickness={1.0}
            ior={1.6}
            transparent
            opacity={0.85}
          />
        </mesh>

        {/* Outer Tech Wireframe Matrix */}
        <mesh ref={wireframeRef} scale={[1.15, 1.15, 1.15]}>
          <icosahedronGeometry args={[2.2, 1]} />
          <meshBasicMaterial
            color="#d946ef"
            wireframe
            transparent
            opacity={0.5}
          />
        </mesh>

        {/* Vertex Glowing Nodes */}
        {nodePositions.map((pos, idx) => (
          <mesh key={idx} position={pos}>
            <sphereGeometry args={[0.07, 16, 16]} />
            <meshBasicMaterial color={idx % 2 === 0 ? '#00f0ff' : '#d946ef'} />
          </mesh>
        ))}

        {/* Orbital Gyroscope Rings */}
        <group ref={ringGroupRef}>
          <mesh rotation={[Math.PI / 3, 0, 0]}>
            <torusGeometry args={[3.2, 0.02, 16, 100]} />
            <meshBasicMaterial color="#00f0ff" transparent opacity={0.6} />
          </mesh>
          <mesh rotation={[-Math.PI / 4, Math.PI / 4, 0]}>
            <torusGeometry args={[3.6, 0.015, 16, 100]} />
            <meshBasicMaterial color="#d946ef" transparent opacity={0.5} />
          </mesh>
        </group>
      </group>
    </Float>
  );
}

// Particle Dust Matrix
function DustParticles({ count = 1200 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const cCyan = new THREE.Color('#00f0ff');
    const cMagenta = new THREE.Color('#d946ef');
    const cWhite = new THREE.Color('#ffffff');

    for (let i = 0; i < count; i++) {
      const radius = 2.5 + Math.random() * 10;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

      const r = Math.random();
      const chosenColor = r < 0.6 ? cCyan : r < 0.85 ? cMagenta : cWhite;
      col[i * 3] = chosenColor.r;
      col[i * 3 + 1] = chosenColor.g;
      col[i * 3 + 2] = chosenColor.b;
    }
    return [pos, col];
  }, [count]);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.04;
      pointsRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.03;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        vertexColors
        transparent
        opacity={0.75}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

// Parallax Controller Rig
function ParallaxCameraRig({ mousePos }: { mousePos?: { x: number; y: number } }) {
  const { camera } = useThree();
  const targetVec = useRef(new THREE.Vector3(0, 0, 7.5));

  useFrame((_, delta) => {
    if (mousePos) {
      // Moves slightly in opposite direction of mouse cursor
      const targetX = -(mousePos.x - 0.5) * 1.5;
      const targetY = (mousePos.y - 0.5) * 1.0;
      targetVec.current.set(targetX, targetY, 7.5);
    }
    camera.position.lerp(targetVec.current, delta * 3.0);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

export function Background3D({ mousePos }: Background3DProps) {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 7.5], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#0b0f19']} />
        <fog attach="fog" args={['#0b0f19', 5, 16]} />

        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 8]} intensity={2.5} color="#ffffff" />
        <pointLight position={[0, 4, 4]} intensity={3.0} color="#00f0ff" distance={15} />
        <pointLight position={[-4, -4, -4]} intensity={2.5} color="#d946ef" distance={15} />

        <CentralTechSphere />
        <DustParticles count={1400} />
        <ParallaxCameraRig mousePos={mousePos} />
      </Canvas>
    </div>
  );
}
