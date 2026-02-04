"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";

const presentations = [
    {
        id: 1,
        title: "Ant Colony Optimization Algorithm",
        description: "Bio-inspired probabilistic technique for solving computational problems which can be reduced to finding good paths through graphs.",
        type: "slides",
        slides: [
            { id: 1, content: "Ant Colony Optimization: Introduction" },
            { id: 2, content: "Pheromone Trails & Reinforcement Learning" },
            { id: 3, content: "Application in Network Routing" }
        ],
        color: "neon-cyan"
    },
    {
        id: 2,
        title: "Slime Mold Algorithm",
        description: "Population-based metaheuristic algorithm inspired by the diffusion and behavior of slime mold in nature.",
        type: "pdf",
        src: "/1st%20try.pdf",
        color: "neon-magenta",
        slides: [] // Overridden by PDF
    }
];

export default function PresentationPage() {
    const [activePresentation, setActivePresentation] = useState<number | null>(null);
    const [currentSlide, setCurrentSlide] = useState(0);

    const openPresentation = (id: number) => {
        setActivePresentation(id);
        setCurrentSlide(0);
    };

    const closePresentation = () => {
        setActivePresentation(null);
    };

    const nextSlide = () => {
        const pres = presentations.find(p => p.id === activePresentation);
        if (pres && pres.type === 'slides') {
            setCurrentSlide(prev => (prev + 1) % pres.slides.length);
        }
    };

    const prevSlide = () => {
        const pres = presentations.find(p => p.id === activePresentation);
        if (pres && pres.type === 'slides') {
            setCurrentSlide(prev => (prev - 1 + pres.slides.length) % pres.slides.length);
        }
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

                        {currentPres?.type === 'pdf' ? (
                            <div className="w-full h-full p-4">
                                <iframe
                                    src={currentPres.src}
                                    className="w-full h-full rounded-lg border border-gray-700"
                                    title="PDF Viewer"
                                />
                            </div>
                        ) : (
                            <>
                                {/* Slide Mock */}
                                <motion.div
                                    key={currentSlide}
                                    initial={{ opacity: 0, x: 100 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    className="w-[80%] aspect-video bg-white text-black flex flex-col items-center justify-center rounded-xl shadow-2xl p-10 text-center"
                                >
                                    <h3 className="text-4xl font-bold mb-4">Slide {currentSlide + 1}</h3>
                                    <p className="text-2xl text-gray-600">{currentPres?.slides[currentSlide].content}</p>
                                    <div className="mt-10 p-4 bg-gray-100 rounded text-sm text-gray-500">
                                        [Placeholder for Slide Image/Content]
                                    </div>
                                </motion.div>

                                {/* Controls */}
                                <button onClick={prevSlide} className="absolute left-10 p-4 bg-white/10 hover:bg-white/20 backdrop-blur rounded-full text-white transition-all">
                                    <ChevronLeft className="w-8 h-8" />
                                </button>
                                <button onClick={nextSlide} className="absolute right-10 p-4 bg-white/10 hover:bg-white/20 backdrop-blur rounded-full text-white transition-all">
                                    <ChevronRight className="w-8 h-8" />
                                </button>

                                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 rounded-full text-white font-mono">
                                    Slide {currentSlide + 1} / {currentPres?.slides.length}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
