import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Sphere, Stars, Float } from '@react-three/drei';
import * as THREE from 'three';

const Earth = () => {
  const earthRef = useRef<THREE.Mesh>(null);

  // Carga de texturas locales
  const [colorMap, normalMap, specularMap, cloudsMap, lightsMap] = useLoader(THREE.TextureLoader, [
    '/textures/earth.jpg',
    '/textures/earth_normal.jpg',
    '/textures/earth_specular.jpg',
    '/textures/earth_clouds.png',
    '/textures/earth_lights.png'
  ]);

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    if (earthRef.current) {
      earthRef.current.rotation.y = elapsedTime * 0.05;
      earthRef.current.rotation.x = 0.2; // Inclinación natural
    }
  });

  return (
    <group scale={1.4}>
      {/* Núcleo Negro Absoluto para garantizar opacidad total */}
      <mesh>
        <sphereGeometry args={[0.995, 64, 64]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Superficie de la Tierra con material Standard para mejor realismo y opacidad */}
      <Sphere ref={earthRef} args={[1, 64, 64]}>
        <meshStandardMaterial
          map={colorMap}
          normalMap={normalMap}
          roughnessMap={specularMap}
          roughness={0.7}
          metalness={0.2}
          emissiveMap={lightsMap}
          emissive={new THREE.Color(0xffffea)}
          emissiveIntensity={1.5}
        />
      </Sphere>

      {/* Capa de Nubes con transparencia clásica (evitando AdditiveBlending que puede transparentar el fondo) */}
      <Sphere args={[1.01, 64, 64]}>
        <meshStandardMaterial
          map={cloudsMap}
          transparent={true}
          opacity={0.4}
          depthWrite={false}
        />
      </Sphere>

      {/* Iluminación Cinematográfica */}
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#0088ff" />
    </group>
  );
};

export const EarthBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 bg-transparent overflow-hidden pointer-events-none">
      <Canvas 
        camera={{ position: [0, 0, 3.5], fov: 45 }}
        gl={{ antialias: true, alpha: false, stencil: false, depth: true }}
      >
        <color attach="background" args={['#050505']} />
        
        <Stars 
          radius={100} 
          depth={50} 
          count={5000} 
          factor={4} 
          saturation={0} 
          fade 
          speed={1} 
        />
        
        <Suspense fallback={null}>
          <Float 
            speed={1.5} 
            rotationIntensity={0.2} 
            floatIntensity={0.2}
          >
            <Earth />
          </Float>
        </Suspense>
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />
    </div>
  );
};
