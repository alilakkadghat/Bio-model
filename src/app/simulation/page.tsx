"use client";

import { useState } from "react";
import HunterKillerSimulation from "@/components/simulations/HunterKillerSimulation";
import DigitalQuarantineSimulation from "@/components/simulations/DigitalQuarantineSimulation";
import PatchPropagationSimulation from "@/components/simulations/PatchPropagationSimulation";
import ControlPanel from "@/components/ControlPanel";

export default function SimulationPage() {
    const [scenario, setScenario] = useState<"hunter" | "quarantine" | "propagation">("hunter");

    // Simulation State
    const [parameters, setParameters] = useState({
        antCount: 200,
        infectionRate: 0.05,
        antSpeed: 1,
        pheromoneDecay: 5,
    });
    const [isSeveringMode, setSeveringMode] = useState(false);
    const [isPlaying, setIsPlaying] = useState(true);

    // Deploy Swarm Handler
    const handleDeploySwarm = () => {
        setParameters(prev => ({ ...prev, antCount: prev.antCount + 50 }));
    };

    return (
        <div className="flex flex-col h-full bg-black text-white overflow-hidden relative">
            <header className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/50 backdrop-blur-sm z-30 relative">
                <h1 className="text-2xl font-bold text-neon-cyan drop-shadow-[0_0_5px_rgba(0,243,255,0.5)]">
                    Simulation Engine
                </h1>

                <div className="flex items-center gap-4">
                    <label className="text-sm text-gray-400">Scenario:</label>
                    <select
                        value={scenario}
                        onChange={(e) => setScenario(e.target.value as any)}
                        className="bg-gray-900 border border-gray-700 text-white rounded px-3 py-1 focus:border-neon-cyan outline-none transition-colors"
                    >
                        <option value="hunter">Scenario 1: Hunter-Killer Swarm</option>
                        <option value="quarantine">Scenario 2: Digital Quarantine</option>
                        <option value="propagation">Scenario 3: Patch Propagation Race</option>
                    </select>
                </div>
            </header>

            <div className="flex-1 relative overflow-hidden bg-gray-950">

                <ControlPanel
                    parameters={parameters}
                    setParameters={setParameters}
                    onDeploySwarm={handleDeploySwarm}
                    isSeveringMode={isSeveringMode}
                    setSeveringMode={setSeveringMode}
                    isPlaying={isPlaying}
                    setIsPlaying={setIsPlaying}
                />

                {scenario === "hunter" && (
                    <HunterKillerSimulation
                        antCount={parameters.antCount}
                        infectionRate={parameters.infectionRate}
                        isSeveringMode={isSeveringMode}
                        isPlaying={isPlaying}
                    />
                )}

                {scenario === "quarantine" && (
                    <div className="flex justify-center items-center h-full w-full">
                        <DigitalQuarantineSimulation
                            antCount={Math.min(parameters.antCount, 100)} // Cap ants for grid performance
                            infectionRate={parameters.infectionRate}
                            isSeveringMode={isSeveringMode}
                            isPlaying={isPlaying}
                        />
                    </div>
                )}
                {scenario === "propagation" && (
                    <PatchPropagationSimulation
                        antCount={parameters.antCount}
                        infectionRate={parameters.infectionRate}
                        isSeveringMode={isSeveringMode}
                        isPlaying={isPlaying}
                    />
                )}
            </div>
        </div>
    );
}
