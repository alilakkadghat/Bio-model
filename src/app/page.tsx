"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Activity, Network } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-neon-cyan/30">
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">

        {/* Abstract Background Animation Placeholder */}
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-cyan/30 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-magenta/30 rounded-full blur-[100px] animate-pulse delay-1000" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-6 bg-gradient-to-r from-neon-cyan via-white to-neon-magenta bg-clip-text text-transparent">
              BIO-INSPIRED<br />CYBER DEFENSE
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xl md:text-2xl text-gray-400 mb-10 max-w-2xl mx-auto"
          >
            Visualizing the power of Swarm Intelligence and Digital Antibodies in next-gen network security.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Link
              href="https://simulation-three-beryl.vercel.app/"
              className="group inline-flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-neon-cyan transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(0,243,255,0.5)]"
            >
              Launch Simulation
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-gray-900/50 border-t border-white/10">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">

            <motion.div
              whileHover={{ y: -10 }}
              className="p-8 rounded-2xl bg-black border border-white/10 hover:border-neon-cyan/50 transition-colors"
            >
              <Activity className="w-12 h-12 text-neon-cyan mb-6" />
              <h3 className="text-2xl font-bold mb-4">Hunter-Killer Swarms</h3>
              <p className="text-gray-400">
                Deploy autonomous digital ants that patrol networks, detect anomalies via pheromone trails, and neutralize malware threats in real-time.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -10 }}
              className="p-8 rounded-2xl bg-black border border-white/10 hover:border-neon-magenta/50 transition-colors"
            >
              <Shield className="w-12 h-12 text-neon-magenta mb-6" />
              <h3 className="text-2xl font-bold mb-4">Digital Quarantine</h3>
              <p className="text-gray-400">
                Utilize cellular automata logic to dynamically construct firewalls, isolating infected nodes to prevent viral propagation across the grid.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -10 }}
              className="p-8 rounded-2xl bg-black border border-white/10 hover:border-neon-amber/50 transition-colors"
            >
              <Network className="w-12 h-12 text-neon-amber mb-6" />
              <h3 className="text-2xl font-bold mb-4">Patch Propagation</h3>
              <p className="text-gray-400">
                Simulate the race between exponential malware spread and bio-inspired patch dissemination strategies across large-scale city networks.
              </p>
            </motion.div>

          </div>
        </div>
      </section>
    </div>
  );
}
