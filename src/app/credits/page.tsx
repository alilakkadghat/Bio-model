export default function CreditsPage() {
    const team = [
        { name: "Ali", role: "Lead Simulation Engineer", description: "Architected the core simulation engine and force-directed graph algorithms." },
        { name: "Daksh", role: "UI/UX Designer", description: "Designed the cyber-security aesthetic and interactive dashboard components." },
        { name: "Sarang", role: "Research Integration", description: "Curated bio-inspired algorithms research and implemented presentation modules." },
        { name: "Hemang", role: "Frontend Developer", description: "Built responsive layouts and optimized performance for complex visualizations." },
    ];

    return (
        <div className="flex flex-col h-full bg-black text-white p-8">
            <h1 className="text-3xl font-bold text-neon-cyan mb-10 drop-shadow-[0_0_5px_rgba(0,243,255,0.5)] text-center">
                Project Contributors
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto w-full">
                {team.map((member) => (
                    <div key={member.name} className="bg-gray-900/50 border border-white/10 rounded-xl p-6 flex flex-col items-center hover:bg-gray-900 hover:scale-105 transition-all duration-300">
                        <div className="w-24 h-24 bg-gray-800 rounded-full mb-4 border-2 border-neon-cyan/30 flex items-center justify-center text-3xl font-bold text-neon-cyan/80 shadow-[0_0_15px_rgba(0,243,255,0.2)]">
                            {member.name[0]}
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-neon-cyan transition-colors">{member.name}</h3>
                        <span className="text-xs uppercase tracking-wider text-neon-cyan mb-3">{member.role}</span>
                        <p className="text-sm text-gray-400 text-center px-2">{member.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
