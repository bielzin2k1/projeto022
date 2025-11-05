'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import {
  Users,
  Trophy,
  TrendingUp,
  Shield,
  Crown,
  Star,
  Activity,
  Search,
} from 'lucide-react';
import { membersAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/lib/store';

export default function MembersPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuthStore();

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      const response = await membersAPI.getAll();
      setMembers(response.data);
    } catch (error) {
      toast.error('Erro ao carregar membros');
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers = members.filter(
    (member) =>
      member.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.rank.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRankIcon = (index: number) => {
    if (index === 0) return <Crown className="text-yellow-500" size={24} />;
    if (index === 1) return <Trophy className="text-gray-400" size={24} />;
    if (index === 2) return <Star className="text-orange-600" size={24} />;
    return <Shield className="text-neon-blue" size={24} />;
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Líder':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500';
      case 'Gerente':
        return 'text-purple-400 bg-purple-500/10 border-purple-500';
      default:
        return 'text-blue-400 bg-blue-500/10 border-blue-500';
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

  // Calculate best performer of the week (highest reputation)
  const bestPerformer = members.reduce((best, current) =>
    current.reputation > best.reputation ? current : best
  , members[0]);

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
              <Users className="mr-3 text-neon-cyan" size={36} />
              MEMBROS DA FACÇÃO
            </h1>
            <p className="text-gray-400">
              {members.length} GERENTES ATIVOS
            </p>
          </div>
        </motion.div>

        {/* Best Performer Card */}
        {bestPerformer && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-red-500/10 
              border border-yellow-500 rounded-2xl p-8 relative overflow-hidden"
          >
            {/* Background Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex items-center mb-4">
                <Crown className="text-yellow-500 mr-2" size={28} />
                <h3 className="text-2xl font-bold font-orbitron text-yellow-400">
                  MELHOR GERENTE DA SEMANA
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="flex items-center space-x-4 md:col-span-2">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 
                    flex items-center justify-center text-2xl font-bold">
                    {bestPerformer.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{bestPerformer.username}</div>
                    <div className="text-yellow-400">{bestPerformer.rank}</div>
                    <div className="text-gray-400 text-sm">{bestPerformer.role}</div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400">{bestPerformer.reputation}</div>
                  <div className="text-gray-400 text-sm">Reputação XP</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">{bestPerformer.victories}</div>
                  <div className="text-gray-400 text-sm">Vitórias</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar membros por nome, cargo ou patente..."
            className="w-full pl-12 pr-4 py-4 bg-dark-surface border border-dark-border rounded-xl
              text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue
              transition-all duration-200"
          />
        </motion.div>

        {/* Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member, index) => {
            const winRate = member.actionsParticipated > 0
              ? ((member.victories / member.actionsParticipated) * 100).toFixed(1)
              : 0;
            const roleColors = getRoleColor(member.role);

            return (
              <motion.div
                key={member._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-dark-surface border border-dark-border rounded-xl p-6 
                  hover:border-neon-blue/50 transition-all duration-300 relative overflow-hidden
                  group"
              >
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/5 to-transparent 
                  opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Rank Badge */}
                <div className="absolute top-4 right-4">
                  {getRankIcon(index)}
                </div>

                {/* Status Indicator */}
                <div className="absolute top-4 left-4">
                  <div className={`
                    w-3 h-3 rounded-full
                    ${member.status === 'Online' ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}
                  `} />
                </div>

                {/* Content */}
                <div className="relative z-10 mt-8">
                  {/* Avatar */}
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-neon-cyan to-neon-purple 
                    flex items-center justify-center text-2xl font-bold mb-4">
                    {member.username.charAt(0).toUpperCase()}
                  </div>

                  {/* Name & Role */}
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-white mb-1">{member.username}</h3>
                    <p className="text-sm text-neon-cyan mb-1">{member.rank}</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${roleColors}`}>
                      {member.role}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-dark-card rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-neon-green">{member.victories}</div>
                      <div className="text-xs text-gray-400">Vitórias</div>
                    </div>
                    <div className="bg-dark-card rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-red-400">{member.defeats}</div>
                      <div className="text-xs text-gray-400">Derrotas</div>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Ações:</span>
                      <span className="text-white font-bold">{member.actionsParticipated}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Taxa de Vitória:</span>
                      <span className="text-neon-cyan font-bold">{winRate}%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Reputação:</span>
                      <span className="text-neon-purple font-bold">{member.reputation} XP</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                      <span>XP Progress</span>
                      <span>{member.reputation}/1000</span>
                    </div>
                    <div className="w-full h-2 bg-dark-card rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(member.reputation / 1000) * 100}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className="h-full bg-gradient-to-r from-neon-blue to-neon-purple"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* No Results */}
        {filteredMembers.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Users className="mx-auto text-gray-600 mb-4" size={64} />
            <p className="text-gray-400 text-lg">Nenhum membro encontrado</p>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}

