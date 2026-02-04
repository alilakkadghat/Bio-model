export default function ResearchPage() {
    const papers = [
        {
            title: "Ant Colony Optimization: A New Bio-Inspired Approach for Network Routing",
            description: "This paper explores the application of ACO algorithms for dynamic routing in telecommunication networks, highlighting its adaptability and robustness.",
            category: "ACO in Cybersecurity",
            link: "https://ieeexplore.ieee.org/document/1234567"
        },
        {
            title: "Bio-Inspired Cyber Security for Smart Grid",
            description: "A comprehensive review of bio-inspired techniques including Swarm Intelligence for securing critical infrastructure.",
            category: "Bio-Inspired Networks",
            link: "https://arxiv.org/abs/1234.5678"
        },
        {
            title: "Slime Mould Algorithm: A New Method for Stochastic Optimization",
            description: "The foundational paper proposing the Slime Mould Algorithm (SMA) and demonstrating its effectiveness in various optimization problems.",
            category: "Slime Mold Optimization",
            link: "https://www.sciencedirect.com/science/article/pii/S095070512030000X"
        },
        {
            title: "Digital Ants for Malware Detection",
            description: "Research on using 'digital ants' agents that wander a network to detect anomalies, inspired by real-world ant behavior.",
            category: "ACO in Cybersecurity",
            link: "#"
        }
    ];

    return (
        <div className="flex flex-col h-full bg-black text-white p-8 overflow-y-auto">
            <h1 className="text-3xl font-bold text-neon-amber mb-8 drop-shadow-[0_0_5px_rgba(255,191,0,0.5)]">
                Research Hub
            </h1>

            <div className="grid gap-6 max-w-5xl mx-auto w-full pb-20">
                {papers.map((paper, i) => (
                    <div key={i} className="bg-gray-900/50 border border-white/10 rounded-lg p-6 hover:border-neon-amber/50 transition-all hover:translate-x-2 group">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-semibold text-white group-hover:text-neon-amber transition-colors">{paper.title}</h3>
                            <span className="text-xs px-2 py-1 rounded bg-white/5 text-gray-400 border border-white/5">{paper.category}</span>
                        </div>
                        <p className="text-gray-400 text-sm mb-4 leading-relaxed">{paper.description}</p>
                        <a href={paper.link} target="_blank" rel="noopener noreferrer" className="text-neon-amber text-sm font-medium hover:underline flex items-center gap-1">
                            Read Paper <span>↗</span>
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}
