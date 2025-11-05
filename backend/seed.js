const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const prisma = new PrismaClient();

// Sample users data
const users = [
  {
    username: 'admin',
    email: 'admin@facao.com',
    password: 'senha123',
    role: 'LIDER',
    rank: 'Lider',
    reputation: 500,
    status: 'ONLINE',
    actionsParticipated: 25,
    victories: 20,
    defeats: 5,
  },
  {
    username: 'gerente1',
    email: 'gerente1@facao.com',
    password: 'senha123',
    role: 'GERENTE',
    rank: 'Gerente',
    reputation: 350,
    status: 'ONLINE',
    actionsParticipated: 18,
    victories: 14,
    defeats: 4,
  },
  {
    username: 'operador1',
    email: 'operador1@facao.com',
    password: 'senha123',
    role: 'MEMBRO',
    rank: 'Sargento',
    reputation: 250,
    status: 'ONLINE',
    actionsParticipated: 15,
    victories: 10,
    defeats: 5,
  },
  {
    username: 'operador2',
    email: 'operador2@facao.com',
    password: 'senha123',
    role: 'MEMBRO',
    rank: 'Soldado',
    reputation: 180,
    status: 'OFFLINE',
    actionsParticipated: 12,
    victories: 8,
    defeats: 4,
  },
  {
    username: 'operador3',
    email: 'operador3@facao.com',
    password: 'senha123',
    role: 'MEMBRO',
    rank: 'Cabo',
    reputation: 150,
    status: 'ONLINE',
    actionsParticipated: 10,
    victories: 6,
    defeats: 4,
  },
];

// Sample actions
const actionNames = {
  PEQUENO: ['Ammunation', 'Barbearia', 'Lojinha', 'Madeireira', 'Mequi'],
  MEDIO: ['Banco Fleeca', 'Joalheria', 'Açougue'],
  GRANDE: ['Banco Central', 'Porta-Aviões', 'Nióbio'],
};

async function seedDatabase() {
  try {
    console.log('🔌 Conectando ao Supabase (PostgreSQL)...');
    await prisma.$connect();
    console.log('✅ Conectado ao Supabase!');

    // Clear existing data
    console.log('🗑️  Limpando dados existentes...');
    await prisma.actionParticipant.deleteMany({});
    await prisma.action.deleteMany({});
    await prisma.user.deleteMany({});

    // Create users
    console.log('👥 Criando usuários...');
    const createdUsers = [];
    
    for (const userData of users) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await prisma.user.create({
        data: {
          ...userData,
          password: hashedPassword,
        },
      });
      createdUsers.push(user);
    }
    
    console.log(`✅ ${createdUsers.length} usuários criados!`);

    // Create sample actions
    console.log('🎯 Criando ações de exemplo...');
    
    for (let i = 0; i < 30; i++) {
      const actionTypes = ['PEQUENO', 'MEDIO', 'GRANDE'];
      const results = ['VITORIA', 'DERROTA', 'CANCELADA'];
      
      const actionType = actionTypes[Math.floor(Math.random() * actionTypes.length)];
      const actionNamesList = actionNames[actionType];
      const actionName = actionNamesList[Math.floor(Math.random() * actionNamesList.length)];
      const result = results[Math.floor(Math.random() * results.length)];
      
      // Random participants (1-4 members)
      const numParticipants = Math.floor(Math.random() * 3) + 2;
      const shuffledUsers = [...createdUsers].sort(() => 0.5 - Math.random());
      const participantIds = shuffledUsers.slice(0, numParticipants).map(u => u.id);
      
      // Random date within last 30 days
      const daysAgo = Math.floor(Math.random() * 30);
      const dateTime = new Date();
      dateTime.setDate(dateTime.getDate() - daysAgo);
      
      await prisma.action.create({
        data: {
          actionType,
          actionName,
          dateTime,
          result,
          observations: `Operação realizada com ${result.toLowerCase()}. ${
            result === 'VITORIA' ? 'Equipe performou excepcionalmente bem!' :
            result === 'DERROTA' ? 'Precisamos melhorar nossa estratégia.' :
            'Operação cancelada por motivos táticos.'
          }`,
          managerId: createdUsers[Math.floor(Math.random() * 2)].id, // Admin or Manager
          createdById: createdUsers[0].id, // Admin
          participants: {
            create: participantIds.map(userId => ({
              userId,
            })),
          },
        },
      });
    }

    console.log(`✅ 30 ações criadas!`);

    console.log('\n✨ Database populada com sucesso no Supabase!');
    console.log('\n📝 Credenciais de teste:');
    console.log('━'.repeat(50));
    console.log('👑 LÍDER:');
    console.log('   Email: admin@facao.com');
    console.log('   Senha: senha123');
    console.log('\n👔 GERENTE:');
    console.log('   Email: gerente1@facao.com');
    console.log('   Senha: senha123');
    console.log('\n👤 MEMBRO:');
    console.log('   Email: operador1@facao.com');
    console.log('   Senha: senha123');
    console.log('━'.repeat(50));
    
  } catch (error) {
    console.error('❌ Erro ao popular database:', error);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

seedDatabase();
