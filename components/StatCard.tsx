'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'cyan';
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500',
    text: 'text-blue-400',
    glow: 'shadow-[0_0_15px_rgba(59,130,246,0.3)]',
    icon: 'bg-blue-500/20',
  },
  green: {
    bg: 'bg-green-500/10',
    border: 'border-green-500',
    text: 'text-green-400',
    glow: 'shadow-[0_0_15px_rgba(34,197,94,0.3)]',
    icon: 'bg-green-500/20',
  },
  red: {
    bg: 'bg-red-500/10',
    border: 'border-red-500',
    text: 'text-red-400',
    glow: 'shadow-[0_0_15px_rgba(239,68,68,0.3)]',
    icon: 'bg-red-500/20',
  },
  yellow: {
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500',
    text: 'text-yellow-400',
    glow: 'shadow-[0_0_15px_rgba(234,179,8,0.3)]',
    icon: 'bg-yellow-500/20',
  },
  purple: {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500',
    text: 'text-purple-400',
    glow: 'shadow-[0_0_15px_rgba(168,85,247,0.3)]',
    icon: 'bg-purple-500/20',
  },
  cyan: {
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500',
    text: 'text-cyan-400',
    glow: 'shadow-[0_0_15px_rgba(6,182,212,0.3)]',
    icon: 'bg-cyan-500/20',
  },
};

export default function StatCard({
  title,
  value,
  icon: Icon,
  color,
  subtitle,
  trend,
}: StatCardProps) {
  const colors = colorClasses[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className={`
        relative p-6 rounded-xl border ${colors.border} ${colors.bg} 
        backdrop-blur-sm ${colors.glow} transition-all duration-300
        group hover:${colors.glow} card-hover overflow-hidden
      `}
    >
      {/* Background Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/30 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-gray-400 font-medium mb-1">{title}</p>
            <h3 className={`text-3xl font-bold font-orbitron ${colors.text}`}>
              {value}
            </h3>
            {subtitle && (
              <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
            )}
            {trend && (
              <div className="flex items-center mt-2 space-x-1">
                <span
                  className={`text-xs font-medium ${
                    trend.isPositive ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
                </span>
                <span className="text-xs text-gray-500">vs. semana anterior</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-lg ${colors.icon} ${colors.text}`}>
            <Icon size={24} />
          </div>
        </div>
      </div>

      {/* Animated Border */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
        style={{ color: colors.text }} 
      />
      
      {/* Corner Accent */}
      <div className={`absolute bottom-0 right-0 w-20 h-20 ${colors.text} opacity-5`}>
        <Icon size={80} />
      </div>
    </motion.div>
  );
}

