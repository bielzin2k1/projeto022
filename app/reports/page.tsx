'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { FileText, Download, Filter, Calendar } from 'lucide-react';
import { actionsAPI } from '@/lib/api';
import { formatDate, getActionTypeEmoji, getResultEmoji } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function ReportsPage() {
  const [actions, setActions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    actionType: '',
    result: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    loadActions();
  }, [filters]);

  const loadActions = async () => {
    setLoading(true);
    try {
      const response = await actionsAPI.getAll(filters);
      setActions(response.data);
    } catch (error) {
      toast.error('Erro ao carregar relatórios');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    toast.success('Funcionalidade de exportação em desenvolvimento!');
  };

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
              <FileText className="mr-3 text-neon-green" size={36} />
              RELATÓRIOS
            </h1>
            <p className="text-gray-400">
              Histórico completo de operações
            </p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExport}
            className="px-6 py-3 bg-neon-green/10 border border-neon-green rounded-lg
              text-neon-green font-bold hover:bg-neon-green/20 transition-all duration-200
              flex items-center space-x-2"
          >
            <Download size={20} />
            <span>EXPORTAR PDF</span>
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
            <h3 className="text-lg font-bold font-orbitron text-white">FILTROS AVANÇADOS</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Tipo de Ação</label>
              <select
                value={filters.actionType}
                onChange={(e) => setFilters({ ...filters, actionType: e.target.value })}
                className="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg
                  text-white focus:outline-none focus:border-neon-blue"
              >
                <option value="">Todos</option>
                <option value="Pequeno">🔹 Pequeno Porte</option>
                <option value="Médio">🔸 Médio Porte</option>
                <option value="Grande">🔺 Grande Porte</option>
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
                <option value="Vitória">✅ Vitórias</option>
                <option value="Derrota">❌ Derrotas</option>
                <option value="Cancelada">⚠️ Canceladas</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-2">Data Início</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                className="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg
                  text-white focus:outline-none focus:border-neon-blue"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-2">Data Fim</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                className="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg
                  text-white focus:outline-none focus:border-neon-blue"
              />
            </div>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-dark-surface border border-neon-blue rounded-xl p-4 text-center"
          >
            <div className="text-3xl font-bold text-neon-blue">{actions.length}</div>
            <div className="text-sm text-gray-400">Total de Ações</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-dark-surface border border-neon-green rounded-xl p-4 text-center"
          >
            <div className="text-3xl font-bold text-neon-green">
              {actions.filter(a => a.result === 'Vitória').length}
            </div>
            <div className="text-sm text-gray-400">Vitórias</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-dark-surface border border-red-500 rounded-xl p-4 text-center"
          >
            <div className="text-3xl font-bold text-red-400">
              {actions.filter(a => a.result === 'Derrota').length}
            </div>
            <div className="text-sm text-gray-400">Derrotas</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-dark-surface border border-neon-purple rounded-xl p-4 text-center"
          >
            <div className="text-3xl font-bold text-neon-purple">
              {actions.length > 0 
                ? ((actions.filter(a => a.result === 'Vitória').length / actions.length) * 100).toFixed(1)
                : 0}%
            </div>
            <div className="text-sm text-gray-400">Taxa de Sucesso</div>
          </motion.div>
        </div>

        {/* Actions Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-card border-b border-dark-border">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Ação
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Data/Hora
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Gerente
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Participantes
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Resultado
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="loading-spinner w-12 h-12 mx-auto" />
                    </td>
                  </tr>
                ) : actions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                      Nenhuma ação encontrada
                    </td>
                  </tr>
                ) : (
                  actions.map((action, index) => (
                    <motion.tr
                      key={action._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className="hover:bg-dark-card transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-2xl">{getActionTypeEmoji(action.actionType)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white font-semibold">{action.actionName}</div>
                        <div className="text-xs text-gray-400">{action.actionType} Porte</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {formatDate(action.dateTime)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">{action.manager?.username}</div>
                        <div className="text-xs text-gray-400">{action.manager?.role}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {Array.isArray(action.participants) ? action.participants.length : 0} MEMBROS
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`
                          inline-flex items-center px-3 py-1 rounded-full text-xs font-bold
                          ${action.result === 'Vitória' ? 'bg-green-500/20 text-green-400' :
                            action.result === 'Derrota' ? 'bg-red-500/20 text-red-400' :
                            'bg-gray-500/20 text-gray-400'}
                        `}>
                          {getResultEmoji(action.result)} {action.result}
                        </span>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}

