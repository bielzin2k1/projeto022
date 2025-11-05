'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import ChartCard from '@/components/ChartCard';
import { motion } from 'framer-motion';
import { BarChart3, Filter, Download, TrendingUp, Calendar } from 'lucide-react';
import { statisticsAPI, actionsAPI } from '@/lib/api';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import toast from 'react-hot-toast';
import { formatDate } from '@/lib/utils';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function StatisticsPage() {
  const [loading, setLoading] = useState(true);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [topPerformers, setTopPerformers] = useState<any[]>([]);
  const [actions, setActions] = useState<any[]>([]);
  const [period, setPeriod] = useState('week');
  const [filters, setFilters] = useState({
    actionType: '',
    result: '',
  });

  useEffect(() => {
    loadStatistics();
  }, [period]);

  useEffect(() => {
    loadActions();
  }, [filters]);

  const loadStatistics = async () => {
    setLoading(true);
    try {
      const [timelineRes, performersRes] = await Promise.all([
        statisticsAPI.getPerformanceTimeline(period),
        statisticsAPI.getTopPerformers(),
      ]);
      setTimeline(timelineRes.data);
      setTopPerformers(performersRes.data);
    } catch (error) {
      toast.error('Erro ao carregar estatísticas');
    } finally {
      setLoading(false);
    }
  };

  const loadActions = async () => {
    try {
      const response = await actionsAPI.getAll(filters);
      setActions(response.data);
    } catch (error) {
      toast.error('Erro ao carregar ações');
    }
  };

  // Timeline Chart
  const timelineOptions: ApexOptions = {
    chart: {
      type: 'line',
      background: 'transparent',
      toolbar: { show: false },
      animations: { enabled: true },
    },
    stroke: {
      width: 3,
      curve: 'smooth',
    },
    xaxis: {
      categories: timeline.map((t) => t._id),
      labels: {
        style: {
          colors: '#9CA3AF',
          fontSize: '12px',
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: '#9CA3AF',
          fontSize: '12px',
        },
      },
    },
    colors: ['#00FF94', '#FF0055'],
    legend: {
      labels: {
        colors: '#E6EDF3',
      },
    },
    grid: {
      borderColor: '#30363D',
      strokeDashArray: 4,
    },
    tooltip: {
      theme: 'dark',
    },
  };

  const timelineSeries = [
    {
      name: 'Vitórias',
      data: timeline.map((t) => t.victories),
    },
    {
      name: 'Derrotas',
      data: timeline.map((t) => t.defeats),
    },
  ];

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
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold font-orbitron text-white mb-2 flex items-center">
              <BarChart3 className="mr-3 text-neon-purple" size={36} />
              ESTATÍSTICAS
            </h1>
            <p className="text-gray-400">Análise de desempenho da facção</p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-neon-blue/10 border border-neon-blue rounded-lg
              text-neon-blue font-bold hover:bg-neon-blue/20 transition-all duration-200
              flex items-center space-x-2"
          >
            <Download size={20} />
            <span>EXPORTAR</span>
          </motion.button>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-dark-surface border border-dark-border rounded-xl p-6"
        >
          <div className="flex items-center mb-4">
            <Filter className="mr-2 text-neon-cyan" size={20} />
            <h3 className="text-lg font-bold font-orbitron text-white">FILTROS</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Período</label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg
                  text-white focus:outline-none focus:border-neon-blue"
              >
                <option value="day">Último Dia</option>
                <option value="week">Última Semana</option>
                <option value="month">Último Mês</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-2">Tipo de Ação</label>
              <select
                value={filters.actionType}
                onChange={(e) => setFilters({ ...filters, actionType: e.target.value })}
                className="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg
                  text-white focus:outline-none focus:border-neon-blue"
              >
                <option value="">Todos</option>
                <option value="Pequeno">Pequeno Porte</option>
                <option value="Médio">Médio Porte</option>
                <option value="Grande">Grande Porte</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-2">Resultado</label>
              <select
                value={filters.result}
                onChange={(e) => setFilters({ ...filters, result: e.target.value })}
                className="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg
                  text-white focus:outline-none focus:border-neon-blue"
              >
                <option value="">Todos</option>
                <option value="Vitória">Vitórias</option>
                <option value="Derrota">Derrotas</option>
                <option value="Cancelada">Canceladas</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Timeline Chart */}
        <ChartCard title="Linha do Tempo de Performance" subtitle="Evolução do desempenho">
          <div className="h-80">
            <Chart options={timelineOptions} series={timelineSeries} type="line" height="100%" />
          </div>
        </ChartCard>

        {/* Top Performers */}
        <ChartCard title="Top 10 Membros" subtitle="Ranking por reputação">
          <div className="space-y-3">
            {topPerformers.map((member, index) => {
              const winRate = member.actionsParticipated > 0 
                ? ((member.victories / member.actionsParticipated) * 100).toFixed(1)
                : 0;
              
              return (
                <motion.div
                  key={member._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 bg-dark-card rounded-lg
                    border border-dark-border hover:border-neon-blue/50 transition-all"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center font-bold
                      ${index === 0 ? 'bg-yellow-500 text-black' :
                        index === 1 ? 'bg-gray-400 text-black' :
                        index === 2 ? 'bg-orange-600 text-black' :
                        'bg-dark-border text-white'}
                    `}>
                      #{index + 1}
                    </div>
                    <div>
                      <div className="text-white font-semibold">{member.username}</div>
                      <div className="text-xs text-gray-400">{member.role}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="text-center">
                      <div className="text-neon-green font-bold">{member.victories}</div>
                      <div className="text-gray-400 text-xs">Vitórias</div>
                    </div>
                    <div className="text-center">
                      <div className="text-red-400 font-bold">{member.defeats}</div>
                      <div className="text-gray-400 text-xs">Derrotas</div>
                    </div>
                    <div className="text-center">
                      <div className="text-neon-cyan font-bold">{winRate}%</div>
                      <div className="text-gray-400 text-xs">Taxa</div>
                    </div>
                    <div className="text-center">
                      <div className="text-neon-purple font-bold">{member.reputation}</div>
                      <div className="text-gray-400 text-xs">XP</div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </ChartCard>

        {/* Recent Actions */}
        <ChartCard title="Histórico de Ações" subtitle={`${actions.length} registros encontrados`}>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {actions.slice(0, 20).map((action, index) => (
              <motion.div
                key={action._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                className="flex items-center justify-between p-3 bg-dark-card rounded-lg
                  border border-dark-border hover:border-neon-blue/30 transition-all text-sm"
              >
                <div className="flex items-center space-x-3">
                  <div className="text-xl">
                    {action.actionType === 'Pequeno' ? '🔹' :
                     action.actionType === 'Médio' ? '🔸' : '🔺'}
                  </div>
                  <div>
                    <div className="text-white font-semibold">{action.actionName}</div>
                    <div className="text-gray-400 text-xs">
                      {formatDate(action.dateTime)}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-gray-400 text-xs">
                    {action.participants.length} participantes
                  </div>
                  <div className={`
                    px-3 py-1 rounded-full text-xs font-bold
                    ${action.result === 'Vitória' ? 'bg-green-500/20 text-green-400' :
                      action.result === 'Derrota' ? 'bg-red-500/20 text-red-400' :
                      'bg-gray-500/20 text-gray-400'}
                  `}>
                    {action.result}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </ChartCard>
      </div>
    </DashboardLayout>
  );
}

