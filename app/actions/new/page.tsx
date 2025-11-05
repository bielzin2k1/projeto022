'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import {
  Target,
  Calendar,
  Users,
  FileText,
  Check,
  Loader2,
  AlertCircle,
  Plus,
  X,
} from 'lucide-react';
import { actionsAPI } from '@/lib/api';
import { ACTION_TYPES, ACTION_TYPE_COLORS, RESULT_COLORS } from '@/lib/constants';
import { useAuthStore } from '@/lib/store';
import toast from 'react-hot-toast';
import { playSuccessSound } from '@/lib/utils';

export default function NewActionPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [participantName, setParticipantName] = useState('');

  const [formData, setFormData] = useState({
    actionType: 'Pequeno' as 'Pequeno' | 'Médio' | 'Grande',
    actionName: '',
    dateTime: '',
    participants: [] as string[], // Array de nomes em string
    result: 'Vitória' as 'Vitória' | 'Derrota' | 'Cancelada',
    observations: '',
  });

  useEffect(() => {
    // Set current date/time as default
    const now = new Date();
    const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
    setFormData(prev => ({ ...prev, dateTime: localDateTime }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await actionsAPI.create(formData);
      const xpGained = response.data.xpGained || 0;
      
      toast.success(
        `✅ Ação registrada com sucesso!\n🎯 +${xpGained} XP ganho!`,
        { duration: 5000 }
      );
      playSuccessSound();
      
      // Redirect after a short delay to show the toast
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao registrar ação');
    } finally {
      setLoading(false);
    }
  };

  const handleAddParticipant = () => {
    if (participantName.trim()) {
      setFormData(prev => ({
        ...prev,
        participants: [...prev.participants, participantName.trim()],
      }));
      setParticipantName('');
    }
  };

  const handleRemoveParticipant = (index: number) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants.filter((_, i) => i !== index),
    }));
  };

  const availableActions = ACTION_TYPES[formData.actionType];
  const typeColors = ACTION_TYPE_COLORS[formData.actionType];

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold font-orbitron text-white mb-2 flex items-center">
            <Target className="mr-3 text-neon-blue" size={36} />
            REGISTRAR NOVA AÇÃO
          </h1>
          <p className="text-gray-400">
            Registre operações táticas da facção
          </p>
        </div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-dark-surface border border-dark-border rounded-2xl p-8 shadow-2xl holographic"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Action Type */}
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-3 font-orbitron">
                TIPO DE PORTE
              </label>
              <div className="grid grid-cols-3 gap-4">
                {(['Pequeno', 'Médio', 'Grande'] as const).map((type) => {
                  const colors = ACTION_TYPE_COLORS[type];
                  const isSelected = formData.actionType === type;
                  
                  return (
                    <motion.button
                      key={type}
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setFormData({ ...formData, actionType: type, actionName: '' })}
                      className={`
                        p-4 rounded-lg border-2 transition-all duration-200
                        ${isSelected 
                          ? `${colors.bg} ${colors.border} ${colors.text} ${colors.neon}` 
                          : 'border-dark-border text-gray-400 hover:border-gray-600'
                        }
                      `}
                    >
                      <div className="text-2xl mb-2">
                        {type === 'Pequeno' ? '🔹' : type === 'Médio' ? '🔸' : '🔺'}
                      </div>
                      <div className="font-bold">{type}</div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Action Name */}
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-3 font-orbitron">
                NOME DA AÇÃO
              </label>
              <select
                value={formData.actionName}
                onChange={(e) => setFormData({ ...formData, actionName: e.target.value })}
                className={`
                  w-full px-4 py-3 bg-dark-card border-2 rounded-lg
                  text-white focus:outline-none transition-all duration-200
                  ${formData.actionName ? `${typeColors.border} ${typeColors.text}` : 'border-dark-border'}
                `}
                required
              >
                <option value="">Selecione uma ação</option>
                {availableActions.map((action) => (
                  <option key={action} value={action}>
                    {action}
                  </option>
                ))}
              </select>
            </div>

            {/* Date and Time */}
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-3 font-orbitron flex items-center">
                <Calendar className="mr-2" size={16} />
                DATA E HORA DA OPERAÇÃO
              </label>
              <input
                type="datetime-local"
                value={formData.dateTime}
                onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })}
                className="w-full px-4 py-3 bg-dark-card border-2 border-dark-border rounded-lg
                  text-white focus:outline-none focus:border-neon-blue transition-all duration-200"
                required
              />
            </div>

            {/* Participants (Manual Names) */}
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-3 font-orbitron flex items-center">
                <Users className="mr-2" size={16} />
                PARTICIPANTES ({formData.participants.length})
              </label>
              
              {/* Input to add participant */}
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={participantName}
                  onChange={(e) => setParticipantName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddParticipant())}
                  placeholder="Digite o nome do participante..."
                  className="flex-1 px-4 py-3 bg-dark-card border-2 border-dark-border rounded-lg
                    text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue"
                />
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddParticipant}
                  className="px-6 py-3 bg-neon-blue/10 border-2 border-neon-blue rounded-lg
                    text-neon-blue font-bold hover:bg-neon-blue/20 transition-all flex items-center gap-2"
                >
                  <Plus size={20} />
                  Adicionar
                </motion.button>
              </div>

              {/* List of participants */}
              {formData.participants.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 bg-dark-card rounded-lg border border-dark-border">
                  {formData.participants.map((name, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center justify-between p-3 bg-neon-blue/10 border-2 border-neon-blue rounded-lg"
                    >
                      <span className="text-neon-blue font-semibold text-sm truncate">
                        {name}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveParticipant(index)}
                        className="ml-2 text-red-400 hover:text-red-300 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Result */}
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-3 font-orbitron">
                RESULTADO
              </label>
              <div className="grid grid-cols-3 gap-4">
                {(['Vitória', 'Derrota', 'Cancelada'] as const).map((result) => {
                  const colors = RESULT_COLORS[result];
                  const isSelected = formData.result === result;
                  
                  return (
                    <motion.button
                      key={result}
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setFormData({ ...formData, result })}
                      className={`
                        p-4 rounded-lg border-2 transition-all duration-200
                        ${isSelected
                          ? `${colors.bg} ${colors.border} ${colors.text} ${colors.neon}`
                          : 'border-dark-border text-gray-400 hover:border-gray-600'
                        }
                      `}
                    >
                      <div className="text-2xl mb-2">
                        {result === 'Vitória' ? '✅' : result === 'Derrota' ? '❌' : '⚠️'}
                      </div>
                      <div className="font-bold">{result}</div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Observations */}
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-3 font-orbitron flex items-center">
                <FileText className="mr-2" size={16} />
                OBSERVAÇÕES / RELATÓRIO
              </label>
              <textarea
                value={formData.observations}
                onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 bg-dark-card border-2 border-dark-border rounded-lg
                  text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue
                  transition-all duration-200 resize-none"
                placeholder="Detalhes da operação, notas importantes..."
              />
            </div>

            {/* Manager Info */}
            <div className="bg-neon-blue/5 border border-neon-blue/30 rounded-lg p-4">
              <div className="flex items-center text-sm">
                <AlertCircle className="mr-2 text-neon-blue" size={16} />
                <span className="text-gray-300">
                  Gerente Responsável: <span className="text-neon-blue font-bold">{user?.username}</span>
                </span>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.back()}
                className="flex-1 py-4 bg-dark-card border-2 border-dark-border rounded-lg
                  text-gray-400 font-bold hover:bg-dark-border transition-all duration-200"
              >
                CANCELAR
              </motion.button>
              
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-4 bg-gradient-to-r from-neon-blue to-neon-purple
                  text-white font-bold rounded-lg shadow-neon hover:shadow-neon-strong
                  transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                  flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>REGISTRANDO...</span>
                  </>
                ) : (
                  <>
                    <Check size={20} />
                    <span>REGISTRAR AÇÃO</span>
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}
