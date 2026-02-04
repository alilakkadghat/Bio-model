"use client";

import { motion } from "framer-motion";

interface ControlPanelProps {
    parameters: any;
    setParameters: (params: any) => void;
    onDeploySwarm: () => void;
    isSeveringMode: boolean;
    setSeveringMode: (val: boolean) => void;
    isPlaying: boolean;
    setIsPlaying: (val: boolean) => void;
}

export default function ControlPanel({ parameters, setParameters, onDeploySwarm, isSeveringMode, setSeveringMode, isPlaying, setIsPlaying }: ControlPanelProps) {
    return (
        <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="absolute right-6 top-6 w-72 bg-gray-900/90 backdrop-blur-md border border-white/10 rounded-xl p-5 text-white shadow-2xl z-20"
        >
            <h2 className="text-lg font-bold text-neon-cyan mb-5 border-b border-white/10 pb-2">
                Global Control Panel
            </h2>

            <div className="space-y-6">
                <div>
                    <label className="text-xs text-gray-400 uppercase tracking-wider block mb-2">
                        Agent Population: <span className="text-white font-mono">{parameters.antCount}</span>
                    </label>
                    <input
                        type="range"
                        min="50" max="500"
                        value={parameters.antCount}
                        onChange={(e) => setParameters({ ...parameters, antCount: parseInt(e.target.value) })}
                        className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-neon-cyan"
                    />
                </div>

                <div>
                    <label className="text-xs text-gray-400 uppercase tracking-wider block mb-2">
                        Infection Rate: <span className="text-white font-mono">{parameters.infectionRate}%</span>
                    </label>
                    <input
                        type="range"
                        min="0" max="100" step="0.1"
                        value={parameters.infectionRate}
                        onChange={(e) => setParameters({ ...parameters, infectionRate: parseFloat(e.target.value) })}
                        className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-neon-magenta"
                    />
                </div>

                <div>
                    <label className="text-xs text-gray-400 uppercase tracking-wider block mb-2">
                        Ant Speed: <span className="text-white font-mono">{parameters.antSpeed}x</span>
                    </label>
                    <input
                        type="range"
                        min="0.5" max="5" step="0.5"
                        value={parameters.antSpeed}
                        onChange={(e) => setParameters({ ...parameters, antSpeed: parseFloat(e.target.value) })}
                        className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-neon-amber"
                    />
                </div>

                <div>
                    <label className="text-xs text-gray-400 uppercase tracking-wider block mb-2">
                        Simulation Control
                    </label>
                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className={`w-full py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${isPlaying
                                ? "bg-amber-500/20 text-amber-500 border border-amber-500 hover:bg-amber-500/30"
                                : "bg-green-500/20 text-green-500 border border-green-500 hover:bg-green-500/30"
                            }`}
                    >
                        {isPlaying ? (
                            <><span>⏸</span> Pause Simulation</>
                        ) : (
                            <><span>▶</span> Resume Simulation</>
                        )}
                    </button>
                </div>

                <div>
                    <label className="text-xs text-gray-400 uppercase tracking-wider block mb-2">
                        Pheromone Decay: <span className="text-white font-mono">{parameters.pheromoneDecay}%</span>
                    </label>
                    <input
                        type="range"
                        min="1" max="50" step="1"
                        value={parameters.pheromoneDecay}
                        onChange={(e) => setParameters({ ...parameters, pheromoneDecay: parseFloat(e.target.value) })}
                        className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-gray-400"
                    />
                </div>

                <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
                    <button
                        onClick={onDeploySwarm}
                        className="w-full bg-neon-cyan/20 hover:bg-neon-cyan/30 text-neon-cyan border border-neon-cyan/50 rounded-lg py-2.5 text-sm font-bold transition-all hover:shadow-[0_0_15px_rgba(0,243,255,0.3)] flex items-center justify-center gap-2"
                    >
                        <span>🚀</span> Deploy Swarm (+50)
                    </button>

                    <button
                        onClick={() => setSeveringMode(!isSeveringMode)}
                        className={`w-full border rounded-lg py-2.5 text-sm font-bold transition-all flex items-center justify-center gap-2
               ${isSeveringMode
                                ? "bg-red-500/20 text-red-500 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)] animate-pulse"
                                : "bg-gray-800 text-gray-400 border-gray-700 hover:text-white hover:bg-gray-700"}`}
                    >
                        <span>✂️</span> Severing Mode: {isSeveringMode ? "ACTIVE" : "OFF"}
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
