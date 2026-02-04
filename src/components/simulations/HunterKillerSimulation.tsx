"use client";

import React, { useRef, useEffect } from "react";

interface SimulationProps {
    antCount: number;
    infectionRate: number;
    isSeveringMode: boolean;
    isPlaying?: boolean;
    onStatsUpdate?: (stats: any) => void;
}

export default function HunterKillerSimulation({
    antCount = 200,
    infectionRate = 0.05,
    isSeveringMode = false,
    isPlaying = true,
    onStatsUpdate
}: SimulationProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const p5Instance = useRef<any>(null);
    const requestRef = useRef<number>(0);

    // Game State Refs
    const nodes = useRef<any[]>([]);
    const edges = useRef<any[]>([]);
    const ants = useRef<any[]>([]);
    const propsRef = useRef({ antCount, infectionRate, isSeveringMode, isPlaying });

    const NODE_COUNT = 60;
    const ATTRACTION_FORCE = 0.1;
    const REPULSION_FORCE = 200;
    const SPRING_LENGTH = 100;
    const DAMPING = 0.9;

    useEffect(() => {
        propsRef.current = { antCount, infectionRate, isSeveringMode, isPlaying };

        // Handle Ant Count dynamic updates
        if (!nodes.current.length || !p5Instance.current) return;
        const currentCount = ants.current.length;
        if (antCount > currentCount) {
            const diff = antCount - currentCount;
            const p5 = p5Instance.current;
            for (let i = 0; i < diff; i++) {
                let startNode = nodes.current[Math.floor(Math.random() * nodes.current.length)];
                if (startNode) {
                    ants.current.push({
                        x: startNode.x,
                        y: startNode.y,
                        targetNodeIdx: -1,
                        currentNodeIdx: startNode.id,
                        state: "patrol",
                        color: p5.color(255, 255, 0)
                    });
                }
            }
        } else if (antCount < currentCount) {
            ants.current.splice(antCount, currentCount - antCount);
        }
    }, [antCount, infectionRate, isSeveringMode]);

    useEffect(() => {
        let myP5: any = null;

        const Sketch = (p5: any) => {
            p5.setup = () => {
                const w = containerRef.current?.clientWidth || 800;
                const h = containerRef.current?.clientHeight || 600;
                p5.createCanvas(w, h);
                p5.frameRate(60);
                initializeGraph(p5);
                initializeAnts(p5);
            };

            const initializeGraph = (p5: any) => {
                nodes.current = [];
                edges.current = [];
                for (let i = 0; i < NODE_COUNT; i++) {
                    nodes.current.push({
                        id: i,
                        x: p5.random(p5.width * 0.1, p5.width * 0.9),
                        y: p5.random(p5.height * 0.1, p5.height * 0.9),
                        vx: 0, vy: 0,
                        status: "safe",
                        health: 100,
                        antCount: 0,
                        color: p5.color(0, 100, 255)
                    });
                }
                for (let i = 0; i < NODE_COUNT; i++) {
                    let neighbors = nodes.current
                        .map((n, idx) => ({ id: idx, dist: p5.dist(n.x, n.y, nodes.current[i].x, nodes.current[i].y) }))
                        .filter(n => n.id !== i)
                        .sort((a, b) => a.dist - b.dist)
                        .slice(0, p5.floor(p5.random(2, 5)));

                    neighbors.forEach(n => {
                        if (!edges.current.find(e => (e.from === i && e.to === n.id) || (e.from === n.id && e.to === i))) {
                            edges.current.push({ from: i, to: n.id, length: SPRING_LENGTH });
                        }
                    });
                }
            };

            const initializeAnts = (p5: any) => {
                ants.current = [];
                for (let i = 0; i < propsRef.current.antCount; i++) {
                    let startNode = nodes.current[p5.floor(p5.random(NODE_COUNT))];
                    ants.current.push({
                        x: startNode.x,
                        y: startNode.y,
                        targetNodeIdx: -1,
                        currentNodeIdx: startNode.id,
                        state: "patrol",
                        color: p5.color(255, 255, 0)
                    });
                }
            };

            p5.draw = () => {
                p5.background(10);

                if (propsRef.current.isPlaying) {
                    applyPhysics(p5);
                    updateInfection(p5);
                    updateAnts(p5);
                }

                // Draw Edges
                p5.strokeWeight(2);
                for (let edge of edges.current) {
                    let n1 = nodes.current[edge.from];
                    let n2 = nodes.current[edge.to];
                    if (n1 && n2) {
                        if (n1.status === 'infected' || n2.status === 'infected') p5.stroke(100, 0, 0);
                        else p5.stroke(50);
                        p5.line(n1.x, n1.y, n2.x, n2.y);
                    }
                }

                // Draw Nodes
                p5.noStroke();
                for (let node of nodes.current) {
                    if (node.status === "infected") p5.fill(255, 0, 0);
                    else if (node.status === "recovering") p5.fill(255, 255, 255);
                    else p5.fill(0, 100, 255);
                    p5.ellipse(node.x, node.y, 15 + node.antCount / 2, 15 + node.antCount / 2);
                }

                // Draw Ants
                for (let ant of ants.current) {
                    if (ant.state === "patrol") p5.fill(255, 255, 0);
                    else if (ant.state === "detect") p5.fill(255, 165, 0);
                    else if (ant.state === "attack") p5.fill(255, 0, 255);
                    p5.ellipse(ant.x, ant.y, 6, 6);
                }
            };

            const applyPhysics = (p5: any) => {
                for (let i = 0; i < nodes.current.length; i++) {
                    let node = nodes.current[i];
                    let fx = 0, fy = 0;
                    for (let j = 0; j < nodes.current.length; j++) {
                        if (i === j) continue;
                        let other = nodes.current[j];
                        let dx = node.x - other.x;
                        let dy = node.y - other.y;
                        let dist = Math.sqrt(dx * dx + dy * dy) || 1;
                        if (dist < 200) {
                            let force = REPULSION_FORCE / (dist * dist);
                            fx += (dx / dist) * force;
                            fy += (dy / dist) * force;
                        }
                    }
                    node.vx = (node.vx + fx) * DAMPING;
                    node.vy = (node.vy + fy) * DAMPING;
                    if (node.x < 50 || node.x > p5.width - 50) node.vx *= -1;
                    if (node.y < 50 || node.y > p5.height - 50) node.vy *= -1;
                }
                for (let edge of edges.current) {
                    let n1 = nodes.current[edge.from];
                    let n2 = nodes.current[edge.to];
                    let dx = n2.x - n1.x;
                    let dy = n2.y - n1.y;
                    let dist = Math.sqrt(dx * dx + dy * dy) || 1;
                    let force = (dist - SPRING_LENGTH) * ATTRACTION_FORCE;
                    let fx = (dx / dist) * force;
                    let fy = (dy / dist) * force;
                    n1.vx += fx; n1.vy += fy;
                    n2.vx -= fx; n2.vy -= fy;
                }
                for (let node of nodes.current) {
                    node.x += node.vx;
                    node.y += node.vy;
                    node.x = Math.max(20, Math.min(p5.width - 20, node.x));
                    node.y = Math.max(20, Math.min(p5.height - 20, node.y));
                }
            };

            const updateInfection = (p5: any) => {
                const rate = propsRef.current.infectionRate;
                if (p5.random(1) < rate * 0.01) {
                    let randomNode = nodes.current[p5.floor(p5.random(nodes.current.length))];
                    if (randomNode.status === 'safe') {
                        randomNode.status = 'infected';
                        randomNode.health = 100;
                    }
                }
                for (let edge of edges.current) {
                    let n1 = nodes.current[edge.from];
                    let n2 = nodes.current[edge.to];
                    if (n1.status === 'infected' && n2.status === 'safe' && p5.random(1) < 0.005) n2.status = 'infected';
                    if (n2.status === 'infected' && n1.status === 'safe' && p5.random(1) < 0.005) n1.status = 'infected';
                }
            };

            const updateAnts = (p5: any) => {
                for (let ant of ants.current) {
                    if (ant.targetNodeIdx === -1) {
                        let neighbors = edges.current.filter(e => e.from === ant.currentNodeIdx || e.to === ant.currentNodeIdx);
                        if (neighbors.length > 0) {
                            let edge = neighbors[p5.floor(p5.random(neighbors.length))];
                            ant.targetNodeIdx = (edge.from === ant.currentNodeIdx) ? edge.to : edge.from;
                        } else {
                            ant.targetNodeIdx = p5.floor(p5.random(NODE_COUNT));
                        }
                    }
                    let targetNode = nodes.current[ant.targetNodeIdx];
                    if (!targetNode) { ant.targetNodeIdx = -1; continue; }
                    let dx = targetNode.x - ant.x;
                    let dy = targetNode.y - ant.y;
                    let dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 5) {
                        ant.currentNodeIdx = ant.targetNodeIdx;
                        ant.x = targetNode.x;
                        ant.y = targetNode.y;
                        ant.targetNodeIdx = -1;
                        if (targetNode.status === 'infected') {
                            ant.state = 'attack';
                            targetNode.antCount++;
                        } else {
                            if (ant.state === 'attack') ant.state = 'patrol';
                            targetNode.antCount = Math.max(0, targetNode.antCount - 0.1);
                        }
                        if (targetNode.status === 'infected' && targetNode.antCount > 10) {
                            targetNode.status = 'recovering';
                            setTimeout(() => { targetNode.status = 'safe'; targetNode.antCount = 0; }, 1000);
                        }
                    } else {
                        let speed = 2; // Can use antSpeed prop here too
                        ant.x += (dx / dist) * speed;
                        ant.y += (dy / dist) * speed;
                    }
                }
            };

            p5.mousePressed = () => {
                for (let node of nodes.current) {
                    let d = p5.dist(p5.mouseX, p5.mouseY, node.x, node.y);
                    if (d < 20) {
                        if (node.status === 'safe') node.status = 'infected';
                        return;
                    }
                }
                if (propsRef.current.isSeveringMode) {
                    for (let i = edges.current.length - 1; i >= 0; i--) {
                        let e = edges.current[i];
                        let n1 = nodes.current[e.from];
                        let n2 = nodes.current[e.to];
                        if (!n1 || !n2) continue;

                        let x1 = n1.x, y1 = n1.y;
                        let x2 = n2.x, y2 = n2.y;
                        let mx = p5.mouseX, my = p5.mouseY;
                        let A = mx - x1, B = my - y1, C = x2 - x1, D = y2 - y1;
                        let dot = A * C + B * D;
                        let len_sq = C * C + D * D;
                        let param = -1;
                        if (len_sq !== 0) param = dot / len_sq;
                        let xx, yy;
                        if (param < 0) { xx = x1; yy = y1; }
                        else if (param > 1) { xx = x2; yy = y2; }
                        else { xx = x1 + param * C; yy = y1 + param * D; }
                        let dx = mx - xx;
                        let dy = my - yy;
                        if (Math.sqrt(dx * dx + dy * dy) < 10) {
                            edges.current.splice(i, 1);
                            return;
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

    return <div ref={containerRef} className="w-full h-full relative border border-white/5 bg-gray-950" />;
}
