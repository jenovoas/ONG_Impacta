import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Sphere, Stars, Float } from '@react-three/drei';
import * as THREE from 'three';

const Earth = () => {
  const earthRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);

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
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y = elapsedTime * 0.06;
      atmosphereRef.current.rotation.x = 0.2;
    }
  });

  return (
    <group scale={1.4}>
      {/* Superficie de la Tierra con relieve, reflejos y luces de ciudad */}
      <Sphere ref={earthRef} args={[1, 64, 64]}>
        <meshPhongMaterial
          map={colorMap}
          normalMap={normalMap}
          specularMap={specularMap}
          specular={new THREE.Color('grey')}
          shininess={15}
          emissiveMap={lightsMap}
          emissive={new THREE.Color(0xffffea)}
          emissiveIntensity={1.2}
        />
      </Sphere>

      {/* Nubes */}
      <Sphere args={[1.01, 64, 64]}>
        <meshPhongMaterial
          map={cloudsMap}
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </Sphere>

      {/* Halo Atmosférico (Fresnel) */}
      <Sphere ref={atmosphereRef} args={[1.05, 64, 64]}>
        <meshStandardMaterial
          color="#0066ff"
          transparent
          opacity={0.2}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </Sphere>

      {/* Resplandor exterior suave */}
      <Sphere args={[1.15, 64, 64]}>
        <meshBasicMaterial
          color="#0088ff"
          transparent
          opacity={0.06}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </Sphere>

      {/* Iluminación global (Brillante) */}
      <ambientLight intensity={0.15} />
      <directionalLight position={[4, 2, 3]} intensity={2.5} color="#ffffff" />
      <pointLight position={[-5, -3, -5]} intensity={0.5} color="#00d4aa" />
    </group>
  );
};

export const EarthBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 bg-transparent overflow-hidden pointer-events-none">
      <Canvas camera={{ position: [0, 0, 3.5], fov: 45 }}>
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
