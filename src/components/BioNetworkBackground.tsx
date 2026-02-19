"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

function NetworkParticles(props: any) {
    const ref = useRef<THREE.Points>(null!);

    const [positions, colors] = useMemo(() => {
        const count = 5000;
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const color = new THREE.Color();

        for (let i = 0; i < count; i++) {
            const r = 20 * Math.cbrt(Math.random());
            const theta = Math.random() * 2 * Math.PI;
            const phi = Math.acos(2 * Math.random() - 1);

            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.sin(phi) * Math.sin(theta);
            const z = r * Math.cos(phi);

            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z; // Simplified

            // Mix of cyan and magenta
            if (Math.random() > 0.5) {
                color.set('#00f3ff');
            } else {
                color.set('#ff00ff');
            }

            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }

        return [positions, colors];
    }, []);

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 10;
            ref.current.rotation.y -= delta / 15;
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={positions} colors={colors} stride={3} frustumCulled={false} {...props}>
                <PointMaterial
                    transparent
                    vertexColors
                    size={0.05}
                    sizeAttenuation={true}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </Points>
        </group>
    );
}

export default function BioNetworkBackground() {
    return (
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
            <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
                <ambientLight intensity={0.5} />
                <group>
                    <NetworkParticles />
                </group>
                <fog attach="fog" args={['#000000', 5, 30]} />
            </Canvas>
        </div>
    );
}
