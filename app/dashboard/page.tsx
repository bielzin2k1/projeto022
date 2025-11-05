'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import StatCard from '@/components/StatCard';
import ChartCard from '@/components/ChartCard';
import ActionTypeChart from '@/components/ActionTypeChart';
import PerformanceChart from '@/components/PerformanceChart';
import { statisticsAPI } from '@/lib/api';
import { formatDate, formatRelativeTime } from '@/lib/utils';
import {
  Target,
  Trophy,
  X,
  Users,
  Clock,
  User,
  TrendingUp,
  Activity,
} from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const response = await statisticsAPI.getDashboard();
      setStats(response.data);
    } catch (error) {
      toast.error('Erro ao carregar dados do dashboard');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="loading-spinner w-16 h-16" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold font-orbitron text-white mb-2">
            COMANDO CENTRAL
          </h1>
          <p className="text-gray-400">
            Visão geral das operações da facção
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total de Ações"
            value={stats?.totalActions || 0}
            icon={Target}
            color="blue"
            subtitle="Operações registradas"
          />
          <StatCard
            title="Vitórias"
            value={stats?.victories || 0}
            icon={Trophy}
            color="green"
            subtitle={`${stats?.victoryRate || 0}% de sucesso`}
          />
          <StatCard
            title="Derrotas"
            value={stats?.defeats || 0}
            icon={X}
            color="red"
            subtitle="Operações fracassadas"
          />
          <StatCard
            title="Membros Ativos"
            value={`${stats?.activeMembers || 0}/${stats?.totalMembers || 0}`}
            icon={Users}
            color="purple"
            subtitle="Online agora"
          />
        </div>

        {/* Taxas de Vitória Separadas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pequeno Porte */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/50 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold font-orbitron text-blue-400 flex items-center">
                🔹 Ações de Pequeno Porte
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-400 mb-1">Total</p>
                <p className="text-2xl font-bold text-white">{stats?.smallPorte?.total || 0}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Vitórias</p>
                <p className="text-2xl font-bold text-green-400">{stats?.smallPorte?.victories || 0}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Taxa</p>
                <p className="text-2xl font-bold text-blue-400">{stats?.smallPorte?.victoryRate || 0}%</p>
              </div>
            </div>
            <div className="mt-4 h-2 bg-dark-bg rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                style={{ width: `${stats?.smallPorte?.victoryRate || 0}%` }}
              />
            </div>
          </motion.div>

          {/* Médio + Grande Porte */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-yellow-500/10 to-red-500/10 border border-yellow-500/50 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold font-orbitron text-yellow-400 flex items-center">
                🔸🔺 Ações de Médio e Grande Porte
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-400 mb-1">Total</p>
                <p className="text-2xl font-bold text-white">{stats?.mediumLargePorte?.total || 0}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Vitórias</p>
                <p className="text-2xl font-bold text-green-400">{stats?.mediumLargePorte?.victories || 0}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Taxa</p>
                <p className="text-2xl font-bold text-yellow-400">{stats?.mediumLargePorte?.victoryRate || 0}%</p>
              </div>
            </div>
            <div className="mt-4 h-2 bg-dark-bg rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-500 to-red-500"
                style={{ width: `${stats?.mediumLargePorte?.victoryRate || 0}%` }}
              />
            </div>
          </motion.div>
        </div>

        {/* Last Action Info */}
        {stats?.lastAction && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-dark-surface border border-dark-border rounded-xl p-6"
          >
            <h3 className="text-lg font-bold font-orbitron text-white mb-4 flex items-center">
              <Clock className="mr-2 text-neon-cyan" size={20} />
              Última Ação Registrada
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-400">Ação</p>
                <p className="text-white font-semibold">{stats.lastAction.actionName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Responsável</p>
                <p className="text-white font-semibold flex items-center">
                  <User size={16} className="mr-1 text-neon-blue" />
                  {stats.lastAction.manager?.username}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Quando</p>
                <p className="text-white font-semibold">
                  {formatRelativeTime(stats.lastAction.createdAt)}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Action Type Chart */}
          <ChartCard
            title="Ações por Tipo de Porte"
            subtitle="Distribuição das operações"
          >
            <ActionTypeChart
              data={stats?.actionsByType || { small: 0, medium: 0, large: 0 }}
            />
          </ChartCard>

          {/* Performance Chart */}
          <ChartCard
            title="Desempenho Geral"
            subtitle="Vitórias vs Derrotas"
          >
            <PerformanceChart
              victories={stats?.victories || 0}
              defeats={stats?.defeats || 0}
            />
          </ChartCard>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-blue-500/10 border border-blue-500 rounded-xl p-6 text-center"
          >
            <div className="text-4xl font-bold font-orbitron text-blue-400">
              {stats?.actionsByType?.small || 0}
            </div>
            <div className="text-sm text-gray-400 mt-2">
              🔹 Ações de Pequeno Porte
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-yellow-500/10 border border-yellow-500 rounded-xl p-6 text-center"
          >
            <div className="text-4xl font-bold font-orbitron text-yellow-400">
              {stats?.actionsByType?.medium || 0}
            </div>
            <div className="text-sm text-gray-400 mt-2">
              🔸 Ações de Médio Porte
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-red-500/10 border border-red-500 rounded-xl p-6 text-center"
          >
            <div className="text-4xl font-bold font-orbitron text-red-400">
              {stats?.actionsByType?.large || 0}
            </div>
            <div className="text-sm text-gray-400 mt-2">
              🔺 Ações de Grande Porte
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}

