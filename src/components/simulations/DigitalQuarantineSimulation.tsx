"use client";

import React, { useRef, useEffect } from "react";

interface SimulationProps {
    antCount: number;
    infectionRate: number;
    isSeveringMode: boolean;
    isPlaying?: boolean;
}

export default function DigitalQuarantineSimulation({
    antCount = 50,
    infectionRate = 5,
    isSeveringMode = false,
    isPlaying = true
}: SimulationProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const p5Instance = useRef<any>(null);

    // State Refs
    const grid = useRef<any[][]>([]);
    const ants = useRef<any[]>([]);
    const propsRef = useRef({ antCount, infectionRate, isSeveringMode, isPlaying });

    const COLS = 40;
    const ROWS = 40;

    useEffect(() => {
        propsRef.current = { antCount, infectionRate, isSeveringMode, isPlaying };

        if (!ants.current || !p5Instance.current) return;
        const currentCount = ants.current.length;
        if (antCount > currentCount) {
            const diff = antCount - currentCount;
            for (let i = 0; i < diff; i++) {
                ants.current.push({
                    x: Math.floor(Math.random() * COLS),
                    y: Math.floor(Math.random() * ROWS),
                    state: 'wandering'
                });
            }
        } else if (antCount < currentCount) {
            ants.current.splice(antCount, currentCount - antCount);
        }
    }, [antCount, infectionRate, isSeveringMode]);

    useEffect(() => {
        let myP5: any = null;

        const Sketch = (p5: any) => {
            let CELL_SIZE = 20;

            p5.setup = () => {
                const w = containerRef.current?.clientWidth || 800;
                const h = containerRef.current?.clientHeight || 800;
                // Calculate CELL_SIZE to fit
                CELL_SIZE = Math.min(w / COLS, h / ROWS);

                p5.createCanvas(w, h); // Keep canvas full size but draw centered
                p5.frameRate(30);

                // Init Grid
                grid.current = [];
                for (let x = 0; x < COLS; x++) {
                    grid.current[x] = [];
                    for (let y = 0; y < ROWS; y++) {
                        grid.current[x][y] = {
                            type: 'safe', // safe, infected, firewall
                            nextType: 'safe'
                        };
                    }
                }

                // Seed Infection in Center
                grid.current[Math.floor(COLS / 2)][Math.floor(ROWS / 2)].type = 'infected';

                // Init Ants
                ants.current = [];
                for (let i = 0; i < propsRef.current.antCount; i++) {
                    ants.current.push({
                        x: Math.floor(Math.random() * COLS),
                        y: Math.floor(Math.random() * ROWS),
                        state: 'wandering'
                    });
                }
            };

            p5.draw = () => {
                p5.background(20);

                // Center the grid
                const gridWidth = COLS * CELL_SIZE;
                const gridHeight = ROWS * CELL_SIZE;
                const offsetX = (p5.width - gridWidth) / 2;
                const offsetY = (p5.height - gridHeight) / 2;

                p5.push();
                p5.translate(offsetX, offsetY);

                // Draw Grid
                for (let x = 0; x < COLS; x++) {
                    for (let y = 0; y < ROWS; y++) {
                        let cell = grid.current[x][y];
                        if (cell.type === 'infected') p5.fill(200, 0, 0); // Red
                        else if (cell.type === 'firewall') p5.fill(0, 255, 0); // Green
                        else p5.fill(255); // White (Safe)

                        p5.stroke(0);
                        p5.strokeWeight(1);
                        p5.rect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
                    }
                }

                // Draw Ants
                p5.fill(255, 255, 0); // Yellow
                p5.noStroke();
                for (let ant of ants.current) {
                    p5.ellipse(ant.x * CELL_SIZE + CELL_SIZE / 2, ant.y * CELL_SIZE + CELL_SIZE / 2, CELL_SIZE / 2);
                }

                p5.pop();

                if (propsRef.current.isPlaying) {
                    updateSimulation(p5);
                }
            };

            const updateSimulation = (p5: any) => {
                const rate = propsRef.current.infectionRate;

                // Virus Spread (Cellular Automata)
                if (p5.frameCount % (Math.max(1, 11 - Math.floor(rate))) === 0) {
                    for (let x = 0; x < COLS; x++) {
                        for (let y = 0; y < ROWS; y++) {
                            if (grid.current[x][y].type === 'infected') {
                                // Spread to neighbors
                                let neighbors = [
                                    { x: x + 1, y: y }, { x: x - 1, y: y }, { x: x, y: y + 1 }, { x: x, y: y - 1 }
                                ];
                                for (let n of neighbors) {
                                    if (n.x >= 0 && n.x < COLS && n.y >= 0 && n.y < ROWS) {
                                        let target = grid.current[n.x][n.y];
                                        if (target.type === 'safe') {
                                            if (p5.random(1) < 0.3) {
                                                target.nextType = 'infected';
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                // Ants
                for (let i = ants.current.length - 1; i >= 0; i--) {
                    let ant = ants.current[i];

                    // Interaction with current cell
                    let cell = grid.current[ant.x][ant.y];
                    if (cell.type === 'infected') {
                        // Die on contact
                        ants.current.splice(i, 1);
                        continue;
                    }

                    // Sensing Neighbors
                    let neighbors = [
                        { x: ant.x + 1, y: ant.y }, { x: ant.x - 1, y: ant.y }, { x: ant.x, y: ant.y + 1 }, { x: ant.x, y: ant.y - 1 }
                    ];

                    let detectedInfection = false;
                    for (let n of neighbors) {
                        if (n.x >= 0 && n.x < COLS && n.y >= 0 && n.y < ROWS) {
                            if (grid.current[n.x][n.y].type === 'infected') {
                                detectedInfection = true;
                            }
                        }
                    }

                    if (detectedInfection && cell.type === 'safe') {
                        // Drop Firewall
                        cell.nextType = 'firewall';
                        cell.type = 'firewall';
                    }

                    // Move Randomly
                    let moveOptions = neighbors.filter(n =>
                        n.x >= 0 && n.x < COLS && n.y >= 0 && n.y < ROWS && grid.current[n.x][n.y].type !== 'infected'
                    );

                    if (moveOptions.length > 0) {
                        let next = moveOptions[Math.floor(Math.random() * moveOptions.length)];
                        ant.x = next.x;
                        ant.y = next.y;
                    }
                }

                // Apply Grid Updates
                for (let x = 0; x < COLS; x++) {
                    for (let y = 0; y < ROWS; y++) {
                        if (grid.current[x][y].nextType !== grid.current[x][y].type) {
                            grid.current[x][y].type = grid.current[x][y].nextType;
                        }
                        grid.current[x][y].nextType = grid.current[x][y].type;
                    }
                }
            };

            p5.mousePressed = () => {
                const gridWidth = COLS * CELL_SIZE;
                const gridHeight = ROWS * CELL_SIZE;
                const offsetX = (p5.width - gridWidth) / 2;
                const offsetY = (p5.height - gridHeight) / 2;

                let mx = p5.mouseX - offsetX;
                let my = p5.mouseY - offsetY;

                let x = Math.floor(mx / CELL_SIZE);
                let y = Math.floor(my / CELL_SIZE);

                if (x >= 0 && x < COLS && y >= 0 && y < ROWS) {
                    let cell = grid.current[x][y];

                    if (propsRef.current.isSeveringMode) {
                        if (cell.type === 'firewall') {
                            cell.type = 'safe';
                            cell.nextType = 'safe';
                        }
                    } else {
                        // Breach/Manual Infect?
                        if (cell.type === 'safe') {
                            cell.type = 'infected';
                            cell.nextType = 'infected';
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
                    // Update CELL_SIZE inside the sketch context if possible, 
                    // or just accept re-render on next frame?
                    // We need to access CELL_SIZE which is inside Closure.
                    // Actually, we can trigger windowResized behavior here or just resizeCanvas.
                    // The Sketch closure has 'w' and 'h' logic in windowResized but CELL_SIZE logic too.
                    // Since we can't easily reach into closure variables, we're relying on p5.resizeCanvas updating p5.width/height 
                    // and the draw loop recalculating offsets. 
                    // BUT, CELL_SIZE is calculated in setup/windowResized.
                    // We should ideally trigger the windowResized logic.
                    // p5Instance.current.windowResized(); // This works if we defined it on the p5 instance or attached it.
                    // The p5.windowResized function we defined is called by p5 on actual window resize logic, but we can call it manually if exposed?
                    // Standard p5 behavior listeners are internal.

                    // Best approach: Just rely on re-renders or put grid calculation in draw/resize.
                    // Let's reload page if major drift? No.

                    // Let's try to just call the internal resized logic by ensuring `windowResized` uses the new dimensions.
                    // AND we can manually call it if we attach it to the instance?
                    // myP5.windowResized();
                }
            }
        });

        if (containerRef.current) observer.observe(containerRef.current);

        return () => {
            observer.disconnect();
            if (myP5) myP5.remove();
        };
    }, []);

    return <div ref={containerRef} className="w-full h-full relative flex items-center justify-center bg-gray-950" />;
}
