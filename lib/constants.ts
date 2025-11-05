// Ações por tipo de porte
export const SMALL_ACTIONS = [
  'Ammunation',
  'Auditório',
  'Barbearia',
  'Bebidas',
  'Comedy',
  'Estábulo',
  'Loja de Penhores Rota 68',
  'Lojinha',
  'Madeireira',
  'Mequi',
  'Mergulhador',
  'Observatório',
  'Planet',
  'Prefeitura',
  'Yellow Jack',
];

export const MEDIUM_ACTIONS = [
  'Açougue',
  'Banco Fleeca',
  'Departamento Policial Rota 68',
  'Galinheiro',
  'Joalheria',
];

export const LARGE_ACTIONS = [
  'Banco Central',
  'Banco de Paleto Bay',
  'Nióbio',
  'Porta-Aviões',
];

export const ACTION_TYPES = {
  Pequeno: SMALL_ACTIONS,
  Médio: MEDIUM_ACTIONS,
  Grande: LARGE_ACTIONS,
};

export const ACTION_TYPE_COLORS = {
  Pequeno: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500',
    text: 'text-blue-400',
    neon: 'shadow-[0_0_10px_rgba(59,130,246,0.5)]',
  },
  Médio: {
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500',
    text: 'text-yellow-400',
    neon: 'shadow-[0_0_10px_rgba(234,179,8,0.5)]',
  },
  Grande: {
    bg: 'bg-red-500/10',
    border: 'border-red-500',
    text: 'text-red-400',
    neon: 'shadow-[0_0_10px_rgba(239,68,68,0.5)]',
  },
};

export const RESULT_COLORS = {
  Vitória: {
    bg: 'bg-green-500/10',
    border: 'border-green-500',
    text: 'text-green-400',
    neon: 'shadow-[0_0_10px_rgba(34,197,94,0.5)]',
  },
  Derrota: {
    bg: 'bg-red-500/10',
    border: 'border-red-500',
    text: 'text-red-400',
    neon: 'shadow-[0_0_10px_rgba(239,68,68,0.5)]',
  },
  Cancelada: {
    bg: 'bg-gray-500/10',
    border: 'border-gray-500',
    text: 'text-gray-400',
    neon: 'shadow-[0_0_10px_rgba(107,114,128,0.5)]',
  },
};

export const ROLE_PERMISSIONS = {
  Líder: ['view', 'create', 'edit', 'delete', 'manage_users'],
  Gerente: ['view', 'create', 'edit'],
  Membro: ['view'],
};

export const RANKS = [
  'Recruta',
  'Soldado',
  'Cabo',
  'Sargento',
  'Tenente',
  'Capitão',
  'Major',
  'Coronel',
  'General',
  'Lider',
];

