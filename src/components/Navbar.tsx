"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const navItems = [
  { name: "Simulation", path: "/simulation" },
  { name: "Presentation", path: "/presentation" },
  { name: "Research", path: "/research" },
  { name: "Credits", path: "/credits" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10 h-16 flex items-center justify-between px-6">
      <div className="text-xl font-bold tracking-tighter text-neon-cyan drop-shadow-[0_0_5px_rgba(0,243,255,0.5)]">
        <Link href="/">BIO-DEFENSE</Link>
      </div>
      
      <div className="flex gap-8">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`relative px-2 py-1 text-sm font-medium transition-colors duration-200 
                ${isActive ? "text-neon-cyan" : "text-gray-400 hover:text-white"}`}
            >
              {item.name}
              {isActive && (
                <motion.div
                  layoutId="navbar-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-neon-cyan shadow-[0_0_10px_var(--neon-cyan)]"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
      
      <div className="w-20">
        {/* Placeholder for right side element or balancing */}
      </div>
    </nav>
  );
}
