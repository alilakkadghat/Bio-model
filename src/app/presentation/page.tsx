"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Maximize2, X } from "lucide-react";

const presentations = [
    {
        id: 1,
        title: "Ant Colony Optimization Algorithm",
        description: "Bio-inspired probabilistic technique for solving computational problems which can be reduced to finding good paths through graphs.",
        type: "pdf",
        src: "/ANT COLONY OPTIMIZATION ALGORITHM_opt2.1.pdf",
        color: "neon-cyan"
    },
    {
        id: 2,
        title: "Slime Mold Algorithm",
        description: "Population-based metaheuristic algorithm inspired by the diffusion and behavior of slime mold in nature.",
        type: "pdf",
        src: "/BIO-SMAE.pdf",
        color: "neon-magenta"
    }
];

export default function PresentationPage() {
    const [activePresentation, setActivePresentation] = useState<number | null>(null);


    const openPresentation = (id: number) => {
        setActivePresentation(id);
    };

    const closePresentation = () => {
        setActivePresentation(null);
    };

    const currentPres = presentations.find(p => p.id === activePresentation);

    return (
        <div className="flex flex-col h-full bg-black text-white p-8 relative">
            <h1 className="text-3xl font-bold text-neon-magenta mb-6 drop-shadow-[0_0_5px_rgba(255,0,255,0.5)]">
                Presentations
            </h1>

            {!activePresentation ? (
                <div className="bg-gray-900/50 border border-white/10 rounded-lg p-10 flex flex-col items-center justify-center flex-1">
                    <p className="text-gray-400 mb-8 text-lg">Select a presentation topic to begin</p>
                    <div className="flex flex-wrap gap-8 justify-center">
                        {presentations.map((p) => (
                            <motion.div
                                key={p.id}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => openPresentation(p.id)}
                                className={`w-96 h-64 bg-gray-800 rounded-xl border border-gray-700 flex flex-col items-center justify-center cursor-pointer hover:border-gray-500 transition-colors gap-4 group p-6 text-center`}
                            >
                                <div className={`w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center group-hover:bg-white/10 transition-colors`}>
                                    <span className="text-3xl">{p.type === 'pdf' ? '📑' : '📄'}</span>
                                </div>
                                <h3 className={`text-xl font-bold transition-colors text-${p.color === 'neon-cyan' ? 'neon-cyan' : p.color === 'neon-amber' ? 'neon-amber' : 'neon-magenta'}`}>{p.title}</h3>
                                <p className="text-sm text-gray-400">{p.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="fixed inset-0 z-50 bg-black flex flex-col">
                    {/* Fullscreen Viewer */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-900">
                        <h2 className="text-xl font-bold text-white">{currentPres?.title}</h2>
                        <button onClick={closePresentation} className="p-2 hover:bg-gray-800 rounded-full text-white">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="flex-1 flex items-center justify-center bg-gray-950 relative overflow-hidden">

                        <div className="w-full h-full p-4">
                            <iframe
                                src={currentPres?.src}
                                className="w-full h-full rounded-lg border border-gray-700"
                                title="PDF Viewer"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
