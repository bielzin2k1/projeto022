const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY; // Service key para bypass RLS no backend

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ ERRO: SUPABASE_URL e SUPABASE_SERVICE_KEY devem estar configurados no .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Test connection
async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (error && error.code !== 'PGRST116') { // PGRST116 = empty result, ok
      throw error;
    }
    
    console.log('✅ Supabase conectado com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao conectar ao Supabase:', error.message);
    process.exit(1);
  }
}

testConnection();

module.exports = supabase;
