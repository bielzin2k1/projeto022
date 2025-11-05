'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ChartCardProps {
  title: string;
  children: ReactNode;
  subtitle?: string;
  action?: ReactNode;
}

export default function ChartCard({
  title,
  children,
  subtitle,
  action,
}: ChartCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-dark-surface border border-dark-border rounded-xl p-6 
        hover:border-neon-blue/50 transition-all duration-300 
        shadow-lg hover:shadow-neon group"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold font-orbitron text-white group-hover:text-neon-blue transition-colors">
            {title}
          </h3>
          {subtitle && (
            <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>

      {/* Content */}
      <div className="relative">
        {children}
      </div>

      {/* Decorative Line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-neon-blue to-transparent opacity-0 group-hover:opacity-50 transition-opacity" />
    </motion.div>
  );
}

