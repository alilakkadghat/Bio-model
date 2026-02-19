"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Activity, Network } from "lucide-react";
import BioNetworkBackground from "../components/BioNetworkBackground";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-neon-cyan/30">
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">

        {/* 3D Background */}
        <BioNetworkBackground />

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

    </div>
  );
}
