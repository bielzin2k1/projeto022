'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { Settings, User, Bell, Shield, Palette, Save } from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [theme, setTheme] = useState('dark');

  const handleSave = () => {
    toast.success('Configurações salvas com sucesso!');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold font-orbitron text-white mb-2 flex items-center">
            <Settings className="mr-3 text-neon-purple" size={36} />
            CONFIGURAÇÕES
          </h1>
          <p className="text-gray-400">
            Personalize sua experiência no painel
          </p>
        </motion.div>

        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-dark-surface border border-dark-border rounded-xl p-6"
        >
          <div className="flex items-center mb-6">
            <User className="mr-2 text-neon-blue" size={20} />
            <h3 className="text-lg font-bold font-orbitron text-white">PERFIL</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-neon-cyan to-neon-purple 
                flex items-center justify-center text-2xl font-bold">
                {user?.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="text-xl font-bold text-white">{user?.username}</div>
                <div className="text-sm text-neon-cyan">{user?.rank}</div>
                <div className="text-sm text-gray-400">{user?.email}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="bg-dark-card rounded-lg p-4">
                <div className="text-sm text-gray-400">Cargo</div>
                <div className="text-lg font-bold text-neon-blue">{user?.role}</div>
              </div>
              <div className="bg-dark-card rounded-lg p-4">
                <div className="text-sm text-gray-400">Reputação</div>
                <div className="text-lg font-bold text-neon-purple">{user?.reputation} XP</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Notifications Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-dark-surface border border-dark-border rounded-xl p-6"
        >
          <div className="flex items-center mb-6">
            <Bell className="mr-2 text-neon-green" size={20} />
            <h3 className="text-lg font-bold font-orbitron text-white">NOTIFICAÇÕES</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-dark-card rounded-lg">
              <div>
                <div className="text-white font-semibold">Notificações Push</div>
                <div className="text-sm text-gray-400">Receber alertas de novas ações</div>
              </div>
              <button
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className={`
                  relative w-14 h-7 rounded-full transition-colors duration-200
                  ${notificationsEnabled ? 'bg-neon-green' : 'bg-gray-600'}
                `}
              >
                <div className={`
                  absolute top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200
                  ${notificationsEnabled ? 'right-1' : 'left-1'}
                `} />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-dark-card rounded-lg">
              <div>
                <div className="text-white font-semibold">Sons</div>
                <div className="text-sm text-gray-400">Efeitos sonoros futuristas</div>
              </div>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`
                  relative w-14 h-7 rounded-full transition-colors duration-200
                  ${soundEnabled ? 'bg-neon-blue' : 'bg-gray-600'}
                `}
              >
                <div className={`
                  absolute top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200
                  ${soundEnabled ? 'right-1' : 'left-1'}
                `} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Appearance Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-dark-surface border border-dark-border rounded-xl p-6"
        >
          <div className="flex items-center mb-6">
            <Palette className="mr-2 text-neon-purple" size={20} />
            <h3 className="text-lg font-bold font-orbitron text-white">APARÊNCIA</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Tema</label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg
                  text-white focus:outline-none focus:border-neon-blue"
              >
                <option value="dark">Dark Neon (Padrão)</option>
                <option value="light">Light Cyber (Em breve)</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Security Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-dark-surface border border-dark-border rounded-xl p-6"
        >
          <div className="flex items-center mb-6">
            <Shield className="mr-2 text-neon-red" size={20} />
            <h3 className="text-lg font-bold font-orbitron text-white">SEGURANÇA</h3>
          </div>
          
          <div className="space-y-4">
            <button className="w-full p-4 bg-dark-card rounded-lg text-left
              hover:bg-dark-border transition-colors border border-dark-border
              hover:border-neon-blue">
              <div className="text-white font-semibold">Alterar Senha</div>
              <div className="text-sm text-gray-400">Última alteração: Nunca</div>
            </button>

            <button className="w-full p-4 bg-dark-card rounded-lg text-left
              hover:bg-dark-border transition-colors border border-dark-border
              hover:border-neon-blue">
              <div className="text-white font-semibold">Autenticação em Dois Fatores</div>
              <div className="text-sm text-gray-400">Adicionar camada extra de segurança</div>
            </button>
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          className="w-full py-4 bg-gradient-to-r from-neon-blue to-neon-purple
            text-white font-bold rounded-lg shadow-neon hover:shadow-neon-strong
            transition-all duration-300 flex items-center justify-center space-x-2"
        >
          <Save size={20} />
          <span>SALVAR CONFIGURAÇÕES</span>
        </motion.button>
      </div>
    </DashboardLayout>
  );
}

