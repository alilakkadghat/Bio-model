"use client";

import React, { useRef, useEffect } from "react";

interface SimulationProps {
    antCount: number; // Used for initial "Blue Patch" agents speed/quantity
    infectionRate: number; // Speed of "Red Hacker"
    isSeveringMode: boolean;
    isPlaying?: boolean;
}

export default function PatchPropagationSimulation({
    antCount = 100,
    infectionRate = 5,
    isSeveringMode = false,
    isPlaying = true
}: SimulationProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const p5Instance = useRef<any>(null);

    const nodes = useRef<any[]>([]);
    const edges = useRef<any[]>([]);
    const agents = useRef<any[]>([]);
    const propsRef = useRef({ antCount, infectionRate, isSeveringMode, isPlaying });

    const NODE_COUNT = 500;

    useEffect(() => {
        propsRef.current = { antCount, infectionRate, isSeveringMode, isPlaying };
    }, [antCount, infectionRate, isSeveringMode, isPlaying]);

    useEffect(() => {
        let myP5: any = null;

        const Sketch = (p5: any) => {
            p5.setup = () => {
                const w = containerRef.current?.clientWidth || 800;
                const h = containerRef.current?.clientHeight || 600;
                p5.createCanvas(w, h);
                p5.frameRate(60);
                initialMap(p5);
            };

            const initialMap = (p5: any) => {
                nodes.current = [];
                edges.current = [];
                agents.current = [];

                // City-scale map (Clusters)
                const CLUSTERS = 5;
                for (let c = 0; c < CLUSTERS; c++) {
                    let cx = p5.random(p5.width * 0.1, p5.width * 0.9);
                    let cy = p5.random(p5.height * 0.1, p5.height * 0.9);

                    for (let i = 0; i < NODE_COUNT / CLUSTERS; i++) {
                        nodes.current.push({
                            id: nodes.current.length,
                            x: cx + p5.random(-200, 200),
                            y: cy + p5.random(-200, 200),
                            status: 'vulnerable', // vulnerable (grey), infected (red), patched (blue)
                            progress: 0, // 0-100 for conversion
                            color: p5.color(100)
                        });
                    }
                }

                // Connect nodes locally
                for (let i = 0; i < nodes.current.length; i++) {
                    let neighbors = nodes.current
                        .map((n, idx) => ({ id: idx, dist: p5.dist(n.x, n.y, nodes.current[i].x, nodes.current[i].y) }))
                        .filter(n => n.id !== i && n.dist < 60);

                    neighbors.forEach(n => {
                        if (!edges.current.find(e => (e.from === i && e.to === n.id) || (e.from === n.id && e.to === i))) {
                            edges.current.push({ from: i, to: n.id });
                        }
                    });
                }

                // Seed Infection (Red)
                let redSeed = nodes.current[0];
                if (redSeed) { redSeed.status = 'infected'; redSeed.progress = 100; }

                // Seed Patch (Blue)
                let blueSeed = nodes.current[nodes.current.length - 1];
                if (blueSeed) { blueSeed.status = 'patched'; blueSeed.progress = 100; }
            };

            p5.draw = () => {
                p5.background(10);

                // Draw Edges
                p5.stroke(40);
                p5.strokeWeight(1);
                for (let e of edges.current) {
                    let n1 = nodes.current[e.from];
                    let n2 = nodes.current[e.to];
                    if (n1 && n2) p5.line(n1.x, n1.y, n2.x, n2.y);
                }

                // Update Logic
                if (propsRef.current.isPlaying) {
                    updatePropagation(p5);
                }

                // Draw Nodes
                p5.noStroke();
                for (let n of nodes.current) {
                    if (n.status === 'vulnerable') p5.fill(80);
                    else if (n.status === 'infected') p5.fill(255, 0, 0, 200 + n.progress);
                    else if (n.status === 'patched') p5.fill(0, 150, 255, 200 + n.progress);

                    p5.ellipse(n.x, n.y, 4, 4);
                }

                // Draw Agents (Packets)
                for (let a of agents.current) {
                    if (a.type === 'red') p5.fill(255, 0, 0);
                    else p5.fill(0, 255, 255);
                    p5.ellipse(a.x, a.y, 3, 3);
                }
            };

            const updatePropagation = (p5: any) => {
                const { infectionRate, antCount } = propsRef.current;

                // Hacker Spread (Red)
                if (p5.frameCount % (Math.max(1, 15 - Math.floor(infectionRate))) === 0) {
                    nodes.current.filter(n => n.status === 'infected').forEach(n => {
                        let links = edges.current.filter(e => e.from === n.id || e.to === n.id);
                        if (links.length > 0) {
                            let link = links[p5.floor(p5.random(links.length))];
                            let targetId = link.from === n.id ? link.to : link.from;
                            let target = nodes.current[targetId];
                            if (target.status !== 'infected') {
                                spawnAgent(p5, n, target, 'red');
                            }
                        }
                    });
                }

                // Patch Spread (Blue)
                let spawnRate = Math.max(1, 40 - Math.floor(antCount / 10));
                if (p5.frameCount % spawnRate === 0) {
                    nodes.current.filter(n => n.status === 'patched').forEach(n => {
                        let links = edges.current.filter(e => e.from === n.id || e.to === n.id);
                        links.forEach(link => {
                            let targetId = link.from === n.id ? link.to : link.from;
                            let target = nodes.current[targetId];
                            if (target.status === 'vulnerable') {
                                spawnAgent(p5, n, target, 'blue');
                            }
                        });
                    });
                }

                // Update Agents
                for (let i = agents.current.length - 1; i >= 0; i--) {
                    let a = agents.current[i];
                    let dx = a.target.x - a.x;
                    let dy = a.target.y - a.y;
                    let dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 5) {
                        // Impact
                        if (a.type === 'red') {
                            if (a.target.status !== 'infected') {
                                a.target.status = 'infected';
                            }
                        } else if (a.type === 'blue') {
                            if (a.target.status === 'vulnerable') {
                                a.target.status = 'patched';
                            }
                        }
                        agents.current.splice(i, 1);
                    } else {
                        let speed = 4;
                        if (a.type === 'blue') speed = 2; // Slower
                        a.x += dx / dist * speed;
                        a.y += dy / dist * speed;
                    }
                }
            };

            const spawnAgent = (p5: any, source: any, target: any, type: string) => {
                agents.current.push({
                    x: source.x,
                    y: source.y,
                    target: target,
                    type: type
                });
            };

            p5.mousePressed = () => {
                if (propsRef.current.isSeveringMode) {
                    for (let i = edges.current.length - 1; i >= 0; i--) {
                        let e = edges.current[i];
                        let n1 = nodes.current[e.from];
                        let n2 = nodes.current[e.to];
                        if (!n1 || !n2) continue;
                        let cx = (n1.x + n2.x) / 2;
                        let cy = (n1.y + n2.y) / 2;
                        if (p5.dist(p5.mouseX, p5.mouseY, cx, cy) < 20) {
                            edges.current.splice(i, 1);
                        }
                    }
                } else {
                    // Manual Patching?
                    for (let n of nodes.current) {
                        if (p5.dist(p5.mouseX, p5.mouseY, n.x, n.y) < 10) {
                            if (n.status === 'infected') n.status = 'patched'; // Admin override
                        }
                    }
                }
            };

            p5.windowResized = () => {
                // Handled by ResizeObserver
            };
        };

        import("p5").then((p5Module) => {
            const p5Constructor = p5Module.default;
            if (containerRef.current) {
                myP5 = new p5Constructor(Sketch, containerRef.current);
                p5Instance.current = myP5;
            }
        });

        // Add ResizeObserver
        const observer = new ResizeObserver((entries) => {
            if (p5Instance.current && entries[0].contentRect) {
                const { width, height } = entries[0].contentRect;
                if (width > 0 && height > 0) {
                    p5Instance.current.resizeCanvas(width, height);
                }
            }
        });

        if (containerRef.current) observer.observe(containerRef.current);

        return () => {
            observer.disconnect();
            if (myP5) myP5.remove();
        };
    }, []);

    return <div ref={containerRef} className="w-full h-full relative bg-gray-950" />;
}
