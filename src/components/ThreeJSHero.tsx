"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { EffectComposer } from "three-stdlib";
import { RenderPass } from "three-stdlib";
import { UnrealBloomPass } from "three-stdlib";
import { ShaderPass } from "three-stdlib";

const ThreeJSHero = () => {
    const mountRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const composerRef = useRef<EffectComposer | null>(null);
    const animationIdRef = useRef<number | null>(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!isClient || !mountRef.current) return;

        // Scene setup
        const scene = new THREE.Scene();
        sceneRef.current = scene;

        // Camera setup
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.set(0, 0, 2.5);

        // Renderer setup
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 1);
        renderer.toneMapping = THREE.ReinhardToneMapping;
        renderer.toneMappingExposure = 2;
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        rendererRef.current = renderer;
        mountRef.current.appendChild(renderer.domElement);

        // Post-processing setup
        const composer = new EffectComposer(renderer);
        composerRef.current = composer;

        const renderPass = new RenderPass(scene, camera);
        composer.addPass(renderPass);

        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            1.5, // strength
            0.4, // radius
            0.85 // threshold
        );
        bloomPass.threshold = 0;
        bloomPass.strength = 2;
        bloomPass.radius = 0.8;
        composer.addPass(bloomPass);

        // Blur pass (camera blur effect)
        const blurPass = new ShaderPass(
            new THREE.ShaderMaterial({
                uniforms: {
                    tDiffuse: { value: null },
                    resolution: {
                        value: new THREE.Vector2(
                            window.innerWidth,
                            window.innerHeight
                        ),
                    },
                    blurAmount: { value: 2.0 },
                },
                vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
                fragmentShader: `
          uniform sampler2D tDiffuse;
          uniform vec2 resolution;
          uniform float blurAmount;
          varying vec2 vUv;
          
          void main() {
            vec2 texelSize = 1.0 / resolution;
            vec4 color = vec4(0.0);
            float total = 0.0;
            
            // Gaussian blur
            for (float x = -4.0; x <= 4.0; x += 1.0) {
              for (float y = -4.0; y <= 4.0; y += 1.0) {
                vec2 offset = vec2(x, y) * texelSize * blurAmount;
                float weight = exp(-(x*x + y*y) / 8.0);
                color += texture2D(tDiffuse, vUv + offset) * weight;
                total += weight;
              }
            }
            
            gl_FragColor = color / total;
          }
        `,
            })
        );
        composer.addPass(blurPass);

        const shapes: any[] = [];

        // 4D rotation and projection helper functions
        function rotate4D(
            vertex: any,
            angleXY: number,
            angleXZ: number,
            angleXW: number,
            angleYZ: number,
            angleYW: number,
            angleZW: number
        ) {
            let { x, y, z, w } = vertex;

            // Rotation in XY plane
            const cosXY = Math.cos(angleXY),
                sinXY = Math.sin(angleXY);
            let newX = x * cosXY - y * sinXY;
            let newY = x * sinXY + y * cosXY;
            x = newX;
            y = newY;

            // Rotation in XZ plane
            const cosXZ = Math.cos(angleXZ),
                sinXZ = Math.sin(angleXZ);
            newX = x * cosXZ - z * sinXZ;
            let newZ = x * sinXZ + z * cosXZ;
            x = newX;
            z = newZ;

            // Rotation in XW plane
            const cosXW = Math.cos(angleXW),
                sinXW = Math.sin(angleXW);
            newX = x * cosXW - w * sinXW;
            let newW = x * sinXW + w * cosXW;
            x = newX;
            w = newW;

            // Rotation in YZ plane
            const cosYZ = Math.cos(angleYZ),
                sinYZ = Math.sin(angleYZ);
            newY = y * cosYZ - z * sinYZ;
            newZ = y * sinYZ + z * cosYZ;
            y = newY;
            z = newZ;

            // Rotation in YW plane
            const cosYW = Math.cos(angleYW),
                sinYW = Math.sin(angleYW);
            newY = y * cosYW - w * sinYW;
            newW = y * sinYW + w * cosYW;
            y = newY;
            w = newW;

            // Rotation in ZW plane
            const cosZW = Math.cos(angleZW),
                sinZW = Math.sin(angleZW);
            newZ = z * cosZW - w * sinZW;
            newW = z * sinZW + w * cosZW;
            z = newZ;
            w = newW;

            return { x, y, z, w };
        }

        function project4DTo3D(vertex: any) {
            const distance = 5;
            const scale = distance / (distance + vertex.w);
            return {
                x: vertex.x * scale,
                y: vertex.y * scale,
                z: vertex.z * scale,
            };
        }

        // Hypercube generation
        const hypercubeVertices = [];
        const hypercubeLines = [];

        // Generate hypercube vertices
        for (let i = 0; i < 16; i++) {
            const x = i & 1 ? 1 : -1;
            const y = i & 2 ? 1 : -1;
            const z = i & 4 ? 1 : -1;
            const w = i & 8 ? 1 : -1;
            hypercubeVertices.push({ x, y, z, w });
        }

        // Connect vertices that differ by exactly one coordinate
        for (let i = 0; i < 16; i++) {
            for (let j = i + 1; j < 16; j++) {
                const v1 = hypercubeVertices[i];
                const v2 = hypercubeVertices[j];

                // Count differences in coordinates
                let differences = 0;
                if (v1.x !== v2.x) differences++;
                if (v1.y !== v2.y) differences++;
                if (v1.z !== v2.z) differences++;
                if (v1.w !== v2.w) differences++;

                // If exactly one coordinate differs, they're connected
                if (differences === 1) {
                    hypercubeLines.push([i, j]);
                }
            }
        }

        // Create hypercube wireframe with cylinders
        const hypercubeGroup = new THREE.Group();
        const cylinderGeometry = new THREE.CylinderGeometry(0.02, 0.02, 1, 8);
        const material = new THREE.MeshBasicMaterial({ color: 0xffe484 });

        // Create cylinders for edges
        const cylinders = [];
        for (
            let lineIndex = 0;
            lineIndex < hypercubeLines.length;
            lineIndex++
        ) {
            const cylinder = new THREE.Mesh(cylinderGeometry, material);
            hypercubeGroup.add(cylinder);
            cylinders.push({
                mesh: cylinder,
                vertexIndices: hypercubeLines[lineIndex],
            });
        }

        scene.add(hypercubeGroup);
        shapes.push({
            group: hypercubeGroup,
            cylinders,
            vertices: hypercubeVertices,
            lines: hypercubeLines,
        });

        // Animation loop
        const animate = () => {
            animationIdRef.current = requestAnimationFrame(animate);

            const time = Date.now() * 0.001;

            // Animate hypercube
            if (shapes[0]) {
                const shape = shapes[0];
                const rotationSpeed = 0.05;
                const angleXY = time * rotationSpeed;
                const angleXZ = time * rotationSpeed * 0.7;
                const angleXW = time * rotationSpeed * 0.5;
                const angleYZ = time * rotationSpeed * 0.3;
                const angleYW = time * rotationSpeed * 0.4;
                const angleZW = time * rotationSpeed * 0.6;

                shape.cylinders.forEach(({ mesh, vertexIndices }: any) => {
                    const [i, j] = vertexIndices;
                    const v1 = shape.vertices[i];
                    const v2 = shape.vertices[j];

                    const proj1 = project4DTo3D(
                        rotate4D(
                            v1,
                            angleXY,
                            angleXZ,
                            angleXW,
                            angleYZ,
                            angleYW,
                            angleZW
                        )
                    );
                    const proj2 = project4DTo3D(
                        rotate4D(
                            v2,
                            angleXY,
                            angleXZ,
                            angleXW,
                            angleYZ,
                            angleYW,
                            angleZW
                        )
                    );

                    const midpoint = new THREE.Vector3(
                        (proj1.x + proj2.x) / 2,
                        (proj1.y + proj2.y) / 2,
                        (proj1.z + proj2.z) / 2
                    );
                    mesh.position.copy(midpoint);

                    const length = new THREE.Vector3(
                        proj1.x,
                        proj1.y,
                        proj1.z
                    ).distanceTo(new THREE.Vector3(proj2.x, proj2.y, proj2.z));
                    mesh.scale.y = length;

                    const direction = new THREE.Vector3(
                        proj2.x - proj1.x,
                        proj2.y - proj1.y,
                        proj2.z - proj1.z
                    ).normalize();

                    const up = new THREE.Vector3(0, 1, 0);
                    const quaternion =
                        new THREE.Quaternion().setFromUnitVectors(
                            up,
                            direction
                        );
                    mesh.setRotationFromQuaternion(quaternion);
                });
            }

            composer.render();
        };

        animate();

        // Handle window resize
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            composer.setSize(window.innerWidth, window.innerHeight);

            const newResolution = new THREE.Vector2(
                window.innerWidth,
                window.innerHeight
            );
            const blurPassIndex = composer.passes.findIndex(
                (pass) => pass instanceof ShaderPass
            );
            if (blurPassIndex !== -1) {
                const blurPass = composer.passes[blurPassIndex] as ShaderPass;
                if (blurPass.material && blurPass.material.uniforms) {
                    blurPass.material.uniforms.resolution.value = newResolution;
                }
            }
        };

        window.addEventListener("resize", handleResize);

        // Cleanup
        return () => {
            const currentMount = mountRef.current;

            window.removeEventListener("resize", handleResize);

            if (animationIdRef.current) {
                cancelAnimationFrame(animationIdRef.current);
            }

            shapes.forEach((shape) => {
                if (shape.group) {
                    shape.group.traverse((child: any) => {
                        if (child.geometry) child.geometry.dispose();
                        if (child.material) child.material.dispose();
                    });
                }
            });

            composer.dispose();
            renderer.dispose();

            if (currentMount && renderer.domElement) {
                currentMount.removeChild(renderer.domElement);
            }
        };
    }, [isClient]);

    if (!isClient) {
        return (
            <div
                className="absolute inset-0 z-0"
                style={{
                    width: "100vw",
                    height: "100vh",
                    backgroundColor: "#000000",
                }}
            />
        );
    }

    return (
        <div
            ref={mountRef}
            className="absolute inset-0 z-0"
            style={{ width: "100vw", height: "100vh" }}
        />
    );
};

export default ThreeJSHero;
