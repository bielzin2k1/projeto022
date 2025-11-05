'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import { authAPI } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authAPI.login(email, password);
      const { token, ...user } = response.data;
      
      setAuth(user, token);
      toast.success('Login realizado com sucesso!');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon-blue/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(#00F0FF 1px, transparent 1px),
              linear-gradient(90deg, #00F0FF 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mx-4 relative z-10"
      >
        <div className="bg-dark-surface border border-dark-border rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="p-4 rounded-2xl bg-gradient-to-br from-neon-blue to-neon-purple shadow-neon-strong"
            >
              <Shield className="w-16 h-16 text-white" />
            </motion.div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold font-orbitron text-neon-blue mb-2">
              021 AÇÕES
            </h1>
            <p className="text-gray-400 font-rajdhani">DEV BY @BIELZNN</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-dark-card border border-dark-border rounded-lg
                    text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue
                    transition-all duration-200"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-dark-card border border-dark-border rounded-lg
                    text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue
                    transition-all duration-200"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-neon-blue to-neon-purple
                text-white font-bold rounded-lg shadow-neon hover:shadow-neon-strong
                transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Entrando...</span>
                </>
              ) : (
                <span>ACESSAR PAINEL</span>
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-gray-400">
            <p>Não tem acesso? Contate o GERENTE DE AÇÃO.</p>
          </div>
        </div>

        {/* Decorative Lines */}
        <div className="absolute -top-2 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-neon-blue to-transparent" />
        <div className="absolute -bottom-2 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-neon-purple to-transparent" />
      </motion.div>
    </div>
  );
}

