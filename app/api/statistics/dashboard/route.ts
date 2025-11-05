import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

function getAuthUser(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret_key') as { id: string };
    return decoded;
  } catch {
    return null;
  }
}

// GET /api/statistics/dashboard
export async function GET(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
    }

    // Total actions
    const { count: totalActions } = await supabase
      .from('actions')
      .select('*', { count: 'exact', head: true });

    // Victories
    const { count: victories } = await supabase
      .from('actions')
      .select('*', { count: 'exact', head: true })
      .eq('result', 'vitoria');

    // Defeats
    const { count: defeats } = await supabase
      .from('actions')
      .select('*', { count: 'exact', head: true })
      .eq('result', 'derrota');

    // Active members
    const { count: activeMembers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'online');

    // Total members
    const { count: totalMembers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    // Last action
    const { data: lastAction } = await supabase
      .from('actions')
      .select(`
        *,
        manager:profiles!manager_id(id, username),
        createdBy:profiles!created_by(id, username)
      `)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    // Actions by type
    const { count: smallActions } = await supabase
      .from('actions')
      .select('*', { count: 'exact', head: true })
      .eq('action_type', 'pequeno');

    const { count: mediumActions } = await supabase
      .from('actions')
      .select('*', { count: 'exact', head: true })
      .eq('action_type', 'medio');

    const { count: largeActions } = await supabase
      .from('actions')
      .select('*', { count: 'exact', head: true })
      .eq('action_type', 'grande');

    // Vitórias Pequeno Porte (separadas)
    const { count: smallVictories } = await supabase
      .from('actions')
      .select('*', { count: 'exact', head: true })
      .eq('action_type', 'pequeno')
      .eq('result', 'vitoria');

    const { count: smallDefeats } = await supabase
      .from('actions')
      .select('*', { count: 'exact', head: true })
      .eq('action_type', 'pequeno')
      .eq('result', 'derrota');

    // Vitórias Médio + Grande Porte (juntas)
    const { count: mediumLargeVictories } = await supabase
      .from('actions')
      .select('*', { count: 'exact', head: true })
      .in('action_type', ['medio', 'grande'])
      .eq('result', 'vitoria');

    const { count: mediumLargeDefeats } = await supabase
      .from('actions')
      .select('*', { count: 'exact', head: true })
      .in('action_type', ['medio', 'grande'])
      .eq('result', 'derrota');

    // Total de ações Médio + Grande
    const mediumLargeTotal = (mediumActions || 0) + (largeActions || 0);

    // Calcular taxas de vitória
    const victoryRate = totalActions && totalActions > 0
      ? ((victories || 0) / totalActions * 100).toFixed(1)
      : '0';

    const smallVictoryRate = smallActions && smallActions > 0
      ? ((smallVictories || 0) / smallActions * 100).toFixed(1)
      : '0';

    const mediumLargeVictoryRate = mediumLargeTotal > 0
      ? ((mediumLargeVictories || 0) / mediumLargeTotal * 100).toFixed(1)
      : '0';

    return NextResponse.json({
      totalActions: totalActions || 0,
      victories: victories || 0,
      defeats: defeats || 0,
      activeMembers: activeMembers || 0,
      totalMembers: totalMembers || 0,
      lastAction: lastAction ? {
        ...lastAction,
        actionName: lastAction.action_name,
        createdAt: lastAction.created_at,
      } : null,
      actionsByType: {
        small: smallActions || 0,
        medium: mediumActions || 0,
        large: largeActions || 0,
      },
      victoryRate, // Taxa geral (para gráficos)
      // Estatísticas Pequeno Porte (separadas)
      smallPorte: {
        total: smallActions || 0,
        victories: smallVictories || 0,
        defeats: smallDefeats || 0,
        victoryRate: smallVictoryRate,
      },
      // Estatísticas Médio + Grande Porte (juntas)
      mediumLargePorte: {
        total: mediumLargeTotal,
        victories: mediumLargeVictories || 0,
        defeats: mediumLargeDefeats || 0,
        victoryRate: mediumLargeVictoryRate,
      },
    });
  } catch (error: any) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { message: 'Erro ao buscar estatísticas', error: error.message },
      { status: 500 }
    );
  }
}

