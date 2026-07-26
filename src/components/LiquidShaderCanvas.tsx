import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

interface LiquidShaderCanvasProps {
  className?: string;
  isHovered?: boolean;
  mousePos?: { x: number; y: number };
  imageSrc?: string;
  color1?: string;
  color2?: string;
}

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform float uHover;
  uniform vec2 uMouse;
  uniform vec2 uResolution;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  varying vec2 vUv;

  // Simplex 2D noise for fluid distortion
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
            -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 st = vUv;
    vec2 mouse = uMouse;
    
    // Distance from current pixel to mouse location
    float dist = distance(st, mouse);
    
    // Liquid wave displacement calculations based on mouse position & time
    float wave = sin(dist * 20.0 - uTime * 3.5) * exp(-dist * 4.0) * uHover;
    float noiseVal = snoise(st * 4.0 + vec2(uTime * 0.4, uTime * 0.3)) * 0.15 * uHover;
    
    vec2 offset = vec2(wave * 0.04 + noiseVal, wave * 0.04 - noiseVal);
    vec2 distortedSt = st + offset;

    // Fluid liquid gradient light dispersion effect
    float liquidPattern = snoise(distortedSt * 6.0 + uTime * 0.5) * 0.5 + 0.5;
    
    // Chromatic edge dispersion
    vec3 baseColor = mix(uColor1, uColor2, liquidPattern);
    float edgeGlow = smoothstep(0.4, 0.0, dist) * uHover * 0.8;
    
    vec3 finalColor = baseColor + vec3(0.0, 0.8, 1.0) * edgeGlow * (wave + 0.5);
    float alpha = clamp((liquidPattern * 0.25 + edgeGlow * 0.6) * uHover, 0.0, 0.7);

    gl_FragColor = vec4(finalColor, alpha);
  }
`;

export function LiquidShaderCanvas({
  className = '',
  isHovered = false,
  mousePos = { x: 0.5, y: 0.5 },
  color1 = '#00f0ff',
  color2 = '#d946ef'
}: LiquidShaderCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasContextError, setHasContextError] = useState(false);

  const isHoveredRef = useRef(isHovered);
  const mousePosRef = useRef(mousePos);
  const color1Ref = useRef(color1);
  const color2Ref = useRef(color2);
  const uniformsRef = useRef<any>(null);

  useEffect(() => {
    isHoveredRef.current = isHovered;
  }, [isHovered]);

  useEffect(() => {
    mousePosRef.current = mousePos;
  }, [mousePos.x, mousePos.y]);

  useEffect(() => {
    color1Ref.current = color1;
    color2Ref.current = color2;
    if (uniformsRef.current) {
      try {
        uniformsRef.current.uColor1.value.set(color1);
        uniformsRef.current.uColor2.value.set(color2);
      } catch {
        // Ignore color update error
      }
    }
  }, [color1, color2]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || hasContextError) return;

    let animId: number;
    let renderer: THREE.WebGLRenderer | null = null;

    try {
      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: false,
        powerPreference: 'low-power'
      });

      const width = container.clientWidth || 300;
      const height = container.clientHeight || 200;
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));

      // Handle context lost
      const handleContextLost = (e: Event) => {
        e.preventDefault();
        setHasContextError(true);
      };
      renderer.domElement.addEventListener('webglcontextlost', handleContextLost, false);

      container.appendChild(renderer.domElement);

      const uniforms = {
        uTime: { value: 0 },
        uHover: { value: 0 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uResolution: { value: new THREE.Vector2(width, height) },
        uColor1: { value: new THREE.Color(color1Ref.current) },
        uColor2: { value: new THREE.Color(color2Ref.current) }
      };
      uniformsRef.current = uniforms;

      const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms,
        transparent: true,
        blending: THREE.AdditiveBlending
      });

      const geometry = new THREE.PlaneGeometry(2, 2);
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      let currentHover = 0.0;
      const clock = new THREE.Clock();

      const animate = () => {
        animId = requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        const targetHover = isHoveredRef.current ? 1.0 : 0.0;
        currentHover += (targetHover - currentHover) * 0.1;

        uniforms.uTime.value = elapsedTime;
        uniforms.uHover.value = currentHover;
        uniforms.uMouse.value.set(mousePosRef.current.x, 1.0 - mousePosRef.current.y);

        if (renderer) {
          renderer.render(scene, camera);
        }
      };

      animate();

      const handleResize = () => {
        if (!container || !renderer) return;
        const newW = container.clientWidth;
        const newH = container.clientHeight;
        renderer.setSize(newW, newH);
        uniforms.uResolution.value.set(newW, newH);
      };

      window.addEventListener('resize', handleResize);

      return () => {
        cancelAnimationFrame(animId);
        window.removeEventListener('resize', handleResize);
        if (renderer) {
          renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
          if (container.contains(renderer.domElement)) {
            container.removeChild(renderer.domElement);
          }
          renderer.dispose();
        }
        geometry.dispose();
        material.dispose();
      };
    } catch (e) {
      console.warn('WebGL Liquid Shader creation error:', e);
      setHasContextError(true);
    }
  }, [hasContextError]);

  if (hasContextError) {
    return (
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-500 rounded-inherit overflow-hidden ${
          isHovered ? 'opacity-30' : 'opacity-0'
        }`}
        style={{
          background: `radial-gradient(circle at ${mousePos.x * 100}% ${
            mousePos.y * 100
          }%, ${color1}55 0%, ${color2}22 50%, transparent 80%)`
        }}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none rounded-inherit overflow-hidden ${className}`}
    />
  );
}
