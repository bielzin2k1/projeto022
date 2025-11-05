# 🚀 FiveM Faction Panel - Comando Tático Futurista

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)

> Painel futurista e tático para gerenciamento de facção no FiveM, com interface inspirada em HUDs militares e jogos como Cyberpunk 2077, Valorant e Star Citizen.

## ✨ Características Principais

### 📊 Dashboard Completo
- **Visão Geral**: Cards informativos com estatísticas em tempo real
- **Gráficos Dinâmicos**: 
  - Gráfico de Pizza para tipos de ações (Pequeno, Médio, Grande Porte)
  - Gráfico de Barras para Vitórias vs Derrotas
  - Timeline de Performance
- **Última Ação**: Informações da última operação registrada
- **Membros Ativos**: Contagem de operadores online

### 🎯 Sistema de Registro de Ações
- **3 Tipos de Porte**:
  - 🔹 **Pequeno**: Ammunation, Barbearia, Lojinha, etc. (15 ações)
  - 🔸 **Médio**: Banco Fleeca, Joalheria, Açougue, etc. (5 ações)
  - 🔺 **Grande**: Banco Central, Porta-Aviões, Nióbio, etc. (4 ações)
- **Multi-seleção de Participantes**
- **Registro de Resultados**: Vitória, Derrota ou Cancelada
- **Observações**: Campo para relatórios detalhados
- **Manager Automático**: Baseado no usuário logado

### 📈 Estatísticas Avançadas
- **Filtros Dinâmicos**: Por tipo, resultado, período e responsável
- **Timeline de Performance**: Evolução das operações
- **Top 10 Membros**: Ranking por reputação
- **Histórico Completo**: Todas as ações registradas
- **Exportação**: PDF e Excel (em desenvolvimento)

### 👥 Gerenciamento de Membros
- **Perfil Completo**: Nome, cargo, rank, status
- **Estatísticas Individuais**: Ações, vitórias, derrotas, taxa de sucesso
- **Sistema de Reputação (XP)**: Pontuação baseada em performance
- **Melhor Operador da Semana**: Destaque especial
- **Busca Avançada**: Por nome, cargo ou patente

### 🔐 Sistema de Autenticação
- **JWT Token**: Segurança avançada
- **3 Níveis de Acesso**:
  - **Líder**: Acesso total (criar, editar, deletar, gerenciar usuários)
  - **Gerente**: Criar e visualizar ações
  - **Membro**: Apenas visualizar
- **Sessões Persistentes**: Login mantido entre sessões

## 🎨 Design Futurista

### Paleta de Cores Neon
- **Azul Neon**: `#00F0FF` - Pequeno Porte
- **Dourado**: `#EAB308` - Médio Porte
- **Vermelho Elétrico**: `#EF4444` - Grande Porte
- **Verde Neon**: `#00FF94` - Vitórias
- **Roxo Cyber**: `#9D00FF` - Destaque

### Efeitos Visuais
- ✨ Animações suaves com Framer Motion
- 🌟 Brilho neon pulsante
- 🎭 Efeitos holográficos
- ⚡ Linhas de energia
- 🔮 Gradientes futuristas
- 📱 Totalmente responsivo

## 🛠️ Stack Tecnológico

### Frontend
- **Next.js 14**: Framework React com SSR
- **TypeScript**: Tipagem estática
- **TailwindCSS**: Estilização utilitária
- **Framer Motion**: Animações fluidas
- **ApexCharts**: Gráficos interativos
- **Zustand**: Gerenciamento de estado
- **React Hot Toast**: Notificações

### Backend
- **Node.js**: Runtime JavaScript
- **Express**: Framework web
- **Supabase (PostgreSQL)**: Database em nuvem
- **Prisma**: ORM moderno
- **JWT**: Autenticação segura
- **Bcrypt**: Hash de senhas

## 📦 Instalação Rápida

### Pré-requisitos
- Node.js 18+ instalado
- Conta no Supabase (gratuita)
- Git instalado

### Passo a Passo

1. **Clone o repositório**
```bash
cd C:\Users\bielznn\Downloads\teste
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure o Supabase**

Siga o guia completo em: **[SUPABASE_SETUP.md](SUPABASE_SETUP.md)**

Resumo:
- Crie projeto no Supabase: https://supabase.com
- Copie a connection string
- Configure o `.env`

4. **Configure as variáveis de ambiente**

Crie um arquivo `.env` na raiz do projeto:

```env
# Supabase Database
DATABASE_URL="postgresql://postgres:SUA_SENHA@db.xxxx.supabase.co:5432/postgres"

# JWT Secret
JWT_SECRET="sua_chave_secreta_123"

# Backend
PORT=5000

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:5000
```

5. **Gerar Prisma Client e criar tabelas**
```bash
npm run prisma:generate
npm run prisma:push
```

6. **Popular database com dados de teste (opcional)**
```bash
npm run seed
```

7. **Inicie o projeto**
```bash
npm run dev
```

8. **Acesse o painel**
```
http://localhost:3000
```

## 👤 Credenciais de Teste

Após rodar `npm run seed`:

- 👑 **Líder**: admin@facao.com / senha123
- 👔 **Gerente**: gerente1@facao.com / senha123
- 👤 **Membro**: operador1@facao.com / senha123

## 📱 Estrutura do Projeto

```
teste/
├── app/                          # Next.js App Router
│   ├── dashboard/               # Página principal
│   ├── login/                   # Autenticação
│   ├── actions/new/             # Registro de ações
│   ├── statistics/              # Estatísticas
│   ├── members/                 # Membros
│   ├── reports/                 # Relatórios
│   ├── settings/                # Configurações
│   └── globals.css              # Estilos globais
├── backend/                      # API Node.js
│   ├── routes/                  # Rotas da API
│   ├── middleware/              # Middlewares
│   ├── db.js                    # Prisma Client
│   ├── seed.js                  # Popular database
│   └── server.js                # Servidor Express
├── components/                   # Componentes React
├── lib/                         # Utilitários
├── prisma/
│   └── schema.prisma            # Schema do database
└── package.json                 # Dependências
```

## 🔧 API Endpoints

### Autenticação
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Obter usuário atual
- `POST /api/auth/logout` - Logout

### Ações
- `GET /api/actions` - Listar todas as ações (com filtros)
- `GET /api/actions/:id` - Obter ação específica
- `POST /api/actions` - Criar nova ação (Líder/Gerente)
- `PUT /api/actions/:id` - Atualizar ação (Líder/Gerente)
- `DELETE /api/actions/:id` - Deletar ação (Líder)

### Membros
- `GET /api/members` - Listar todos os membros
- `GET /api/members/:id` - Obter membro específico
- `PUT /api/members/:id` - Atualizar membro (Líder)
- `DELETE /api/members/:id` - Deletar membro (Líder)
- `GET /api/members/ranking/top` - Top 10 membros

### Estatísticas
- `GET /api/statistics/dashboard` - Dados do dashboard
- `GET /api/statistics/actions-by-type` - Ações por tipo
- `GET /api/statistics/performance-timeline` - Timeline
- `GET /api/statistics/top-performers` - Melhores operadores

## 📝 Scripts Disponíveis

```bash
npm run dev              # Inicia frontend + backend
npm run dev:frontend     # Inicia apenas Next.js
npm run dev:backend      # Inicia apenas Express
npm run build           # Build de produção
npm start               # Inicia produção
npm run seed            # Popular database
npm run prisma:generate # Gerar Prisma Client
npm run prisma:push     # Sincronizar schema
npm run prisma:studio   # Interface visual do database
```

## 📚 Documentação

- **[SUPABASE_SETUP.md](SUPABASE_SETUP.md)** - Guia completo de configuração do Supabase
- **[QUICKSTART.md](QUICKSTART.md)** - Início rápido em 5 minutos
- **[FEATURES.md](FEATURES.md)** - Lista completa de funcionalidades
- **[START.txt](START.txt)** - Instruções de inicialização

## 🎯 Funcionalidades Implementadas

✅ Dashboard com estatísticas em tempo real  
✅ Gráficos dinâmicos e interativos  
✅ Registro de ações (3 tipos de porte)  
✅ Multi-seleção de participantes  
✅ Sistema de reputação (XP)  
✅ Ranking de membros  
✅ Filtros avançados  
✅ Timeline de performance  
✅ Relatórios completos  
✅ 3 níveis de acesso (Líder/Gerente/Membro)  
✅ Autenticação JWT  
✅ Notificações toast  
✅ Design neon responsivo  
✅ Animações suaves  
✅ **Supabase (PostgreSQL) em nuvem**  
✅ **Prisma ORM**  

## 🚀 Próximas Funcionalidades

- [ ] Exportação de relatórios em PDF/Excel
- [ ] Sistema de missões ativas em tempo real
- [ ] Chat interno da facção
- [ ] Notificações push
- [ ] Dashboard de guerra entre facções
- [ ] PWA (Progressive Web App)

## 🔧 Troubleshooting

### Erro de conexão com Supabase

Verifique:
1. Connection string no `.env` está correta
2. Senha foi substituída em `[YOUR-PASSWORD]`
3. Rodou `npm run prisma:push`

### Tabelas não foram criadas

```bash
npm run prisma:push
```

### Prisma Client não encontrado

```bash
npm run prisma:generate
```

Consulte **[SUPABASE_SETUP.md](SUPABASE_SETUP.md)** para mais detalhes.

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se livre para abrir issues ou pull requests.

## 📄 Licença

MIT License - veja o arquivo LICENSE para mais detalhes.

## 🎯 Créditos

Desenvolvido com 💙 para a comunidade FiveM

**Database**: Supabase (PostgreSQL)  
**ORM**: Prisma  
**Frontend**: Next.js + TypeScript  
**Styling**: TailwindCSS + Framer Motion  

---

**⚡ Comando Central Ativo - Sistema Operacional ⚡**

🔥 **Agora rodando com Supabase na nuvem!** 🔥
