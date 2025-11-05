'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Target,
  Shield,
} from 'lucide-react';
import { useAuthStore } from '@/lib/store';

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'Registrar Ação', icon: Target, path: '/actions/new' },
  { name: 'Estatísticas', icon: BarChart3, path: '/statistics' },
  { name: 'Membros', icon: Users, path: '/members' },
  { name: 'Relatórios', icon: FileText, path: '/reports' },
  { name: 'Configurações', icon: Settings, path: '/settings' },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-dark-surface border border-dark-border text-neon-blue hover:bg-dark-card transition-all"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`
          fixed left-0 top-0 h-screen w-72 bg-dark-surface border-r border-dark-border
          flex flex-col z-40 overflow-hidden
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo/Header */}
        <div className="p-6 border-b border-dark-border">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-neon-blue to-neon-purple">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold font-orbitron text-neon-blue">
                021
              </h1>
              <p className="text-xs text-gray-400 font-rajdhani">REGISTRO DE AÇÕES</p>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-dark-border">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {user?.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">{user?.username}</p>
              <p className="text-xs text-neon-cyan">{user?.role}</p>
              <p className="text-xs text-gray-400">{user?.rank}</p>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-gray-400">Reputação:</span>
            <span className="text-neon-green font-bold">{user?.reputation} XP</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;

            return (
              <Link key={item.path} href={item.path}>
                <motion.div
                  whileHover={{ x: 5 }}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-lg
                    transition-all duration-200 cursor-pointer
                    ${
                      isActive
                        ? 'bg-neon-blue/10 border border-neon-blue text-neon-blue shadow-neon'
                        : 'text-gray-400 hover:bg-dark-card hover:text-white'
                    }
                  `}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="ml-auto w-2 h-2 rounded-full bg-neon-blue"
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-dark-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg
              bg-red-500/10 border border-red-500 text-red-400
              hover:bg-red-500/20 transition-all duration-200"
          >
            <LogOut size={20} />
            <span className="font-medium">Sair</span>
          </button>
        </div>

        {/* Decorative Lines */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-blue to-transparent opacity-50" />
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-purple to-transparent opacity-50" />
      </motion.aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
        />
      )}
    </>
  );
}

