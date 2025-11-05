const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_KEY são obrigatórias!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Sample users data
const users = [
  {
    username: 'admin',
    email: 'admin@facao.com',
    password: 'senha123',
    role: 'lider',
    rank: 'Líder Supremo',
    reputation: 500,
    status: 'online',
    actions_participated: 25,
    victories: 20,
    defeats: 5,
  },
  {
    username: 'gerente1',
    email: 'gerente1@facao.com',
    password: 'senha123',
    role: 'gerente',
    rank: 'Gerente Tático',
    reputation: 350,
    status: 'online',
    actions_participated: 18,
    victories: 14,
    defeats: 4,
  },
  {
    username: 'operador1',
    email: 'operador1@facao.com',
    password: 'senha123',
    role: 'membro',
    rank: 'Sargento',
    reputation: 250,
    status: 'online',
    actions_participated: 15,
    victories: 10,
    defeats: 5,
  },
  {
    username: 'operador2',
    email: 'operador2@facao.com',
    password: 'senha123',
    role: 'membro',
    rank: 'Soldado',
    reputation: 180,
    status: 'offline',
    actions_participated: 12,
    victories: 8,
    defeats: 4,
  },
  {
    username: 'operador3',
    email: 'operador3@facao.com',
    password: 'senha123',
    role: 'membro',
    rank: 'Cabo',
    reputation: 150,
    status: 'online',
    actions_participated: 10,
    victories: 6,
    defeats: 4,
  },
];

// Sample actions
const actionTemplates = {
  pequeno: ['Ammunation', 'Barbearia', 'Lojinha', 'Madeireira', 'Mequi'],
  medio: ['Banco Fleeca', 'Joalheria', 'Açougue'],
  grande: ['Banco Central', 'Porta-Aviões', 'Nióbio'],
};

async function seedDatabase() {
  try {
    console.log('🔌 Conectando ao Supabase...');

    // First, we need to create users via Supabase Auth
    console.log('👥 Criando usuários...');
    const createdUserIds = [];

    for (const userData of users) {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true,
      });

      if (authError) {
        if (authError.message.includes('already registered')) {
          console.log(`⚠️  Usuário ${userData.email} já existe, pulando...`);
          // Get existing user
          const { data: existingUser } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', userData.email)
            .single();
          
          if (existingUser) {
            createdUserIds.push({
              id: existingUser.id,
              username: userData.username,
              role: userData.role
            });
          }
          continue;
        }
        throw authError;
      }

      const userId = authData.user.id;
      createdUserIds.push({
        id: userId,
        username: userData.username,
        role: userData.role
      });

      // Create/update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          username: userData.username,
          email: userData.email,
          role: userData.role,
          rank: userData.rank,
          status: userData.status,
          actions_participated: userData.actions_participated,
          victories: userData.victories,
          defeats: userData.defeats,
          reputation: userData.reputation,
        });

      if (profileError) throw profileError;
      console.log(`✅ Usuário criado: ${userData.username} (${userData.role})`);
    }

    console.log(`\n✅ ${createdUserIds.length} usuários criados/verificados!`);

    // Create sample actions
    console.log('\n🎯 Criando ações de exemplo...');
    
    const results = ['vitoria', 'vitoria', 'vitoria', 'derrota', 'vitoria', 'derrota'];
    const actionTypes = ['pequeno', 'medio', 'grande'];
    let actionsCreated = 0;

    // Get a manager/leader to create actions
    const manager = createdUserIds.find(u => u.role === 'lider' || u.role === 'gerente');
    if (!manager) {
      console.log('⚠️  Nenhum gerente/líder encontrado para criar ações');
      return;
    }

    for (let i = 0; i < 15; i++) {
      const actionType = actionTypes[Math.floor(Math.random() * actionTypes.length)];
      const actionName = actionTemplates[actionType][
        Math.floor(Math.random() * actionTemplates[actionType].length)
      ];
      const result = results[Math.floor(Math.random() * results.length)];
      
      // Random date within last 30 days
      const daysAgo = Math.floor(Math.random() * 30);
      const dateTime = new Date();
      dateTime.setDate(dateTime.getDate() - daysAgo);

      // Random participants (3-5 people)
      const numParticipants = 3 + Math.floor(Math.random() * 3);
      const participantNames = [];
      for (let j = 0; j < numParticipants; j++) {
        participantNames.push(createdUserIds[Math.floor(Math.random() * createdUserIds.length)].username);
      }

      const { error: actionError } = await supabase
        .from('actions')
        .insert({
          action_type: actionType,
          action_name: actionName,
          date_time: dateTime.toISOString(),
          result: result,
          manager_id: manager.id,
          created_by: manager.id,
          participants: participantNames,
          observations: `Ação ${result === 'vitoria' ? 'bem-sucedida' : 'fracassada'}. ${numParticipants} operadores participaram.`,
        });

      if (actionError) {
        console.error('Erro ao criar ação:', actionError);
      } else {
        actionsCreated++;
      }
    }

    console.log(`✅ ${actionsCreated} ações criadas!`);

    console.log('\n🎉 Seed concluído com sucesso!');
    console.log('\n📋 Credenciais de teste:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    users.forEach(user => {
      console.log(`  👤 ${user.username.padEnd(12)} | ${user.email.padEnd(25)} | Senha: ${user.password} | Role: ${user.role}`);
    });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Erro ao fazer seed:', error);
    process.exit(1);
  }
}

// Run seed
seedDatabase().then(() => {
  console.log('✨ Processo de seed finalizado!');
  process.exit(0);
});

