const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Prisma
const prisma = require('./db');

// Make prisma available to routes
app.use((req, res, next) => {
  req.prisma = prisma;
  next();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/actions', require('./routes/actions'));
app.use('/api/members', require('./routes/members'));
app.use('/api/statistics', require('./routes/statistics'));

// Health Check
app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ 
      status: 'online', 
      message: 'Servidor FiveM Faction Panel Online!',
      database: 'Supabase (PostgreSQL) conectado'
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: 'Erro na conexão com o banco de dados' 
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`🌐 API disponível em http://localhost:${PORT}`);
  console.log(`🔥 Usando Supabase (PostgreSQL)`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
