import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Middleware to check auth
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

// GET /api/actions - List all actions
export async function GET(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const actionType = searchParams.get('actionType');
    const result = searchParams.get('result');
    const manager = searchParams.get('manager');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Normalize filters for database
    const normalizeResult = (res: string) => {
      const map: { [key: string]: string } = {
        'vitória': 'vitoria',
        'derrota': 'derrota',
        'cancelada': 'cancelada'
      };
      return map[res.toLowerCase()] || res.toLowerCase();
    };

    const normalizeActionType = (type: string) => {
      const map: { [key: string]: string } = {
        'pequeno': 'pequeno',
        'médio': 'medio',
        'grande': 'grande'
      };
      return map[type.toLowerCase()] || type.toLowerCase();
    };

    let query = supabase
      .from('actions')
      .select(`
        *,
        manager:profiles!manager_id(id, username, email, role),
        createdBy:profiles!created_by(id, username)
      `)
      .order('date_time', { ascending: false });

    if (actionType) query = query.eq('action_type', normalizeActionType(actionType));
    if (result) query = query.eq('result', normalizeResult(result));
    if (manager) query = query.eq('manager_id', manager);
    if (startDate) query = query.gte('date_time', startDate);
    if (endDate) query = query.lte('date_time', endDate);

    const { data: actions, error } = await query;

    if (error) throw error;

    // Format result for frontend
    const formatResult = (result: string) => {
      const map: { [key: string]: string } = {
        'vitoria': 'Vitória',
        'derrota': 'Derrota',
        'cancelada': 'Cancelada'
      };
      return map[result.toLowerCase()] || result;
    };

    // Format action type for frontend
    const formatActionType = (type: string) => {
      const map: { [key: string]: string } = {
        'pequeno': 'Pequeno',
        'medio': 'Médio',
        'grande': 'Grande'
      };
      return map[type.toLowerCase()] || type;
    };

    // Transform to match frontend expectations
    const transformed = actions?.map(action => ({
      ...action,
      _id: action.id,
      actionType: formatActionType(action.action_type),
      actionName: action.action_name,
      dateTime: action.date_time,
      result: formatResult(action.result),
      participants: action.participants || [], // Array de nomes
    })) || [];

    return NextResponse.json(transformed);
  } catch (error: any) {
    console.error('Get actions error:', error);
    return NextResponse.json(
      { message: 'Erro ao buscar ações', error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/actions - Create action
export async function POST(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
    }

    // Check if user is gerente or lider
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || !['gerente', 'lider'].includes(profile.role)) {
      return NextResponse.json(
        { message: 'Sem permissão' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { actionType, actionName, dateTime, participants, result, observations } = body;

    // Normalize result (remove accents)
    const normalizeResult = (res: string) => {
      const map: { [key: string]: string } = {
        'vitória': 'vitoria',
        'derrota': 'derrota',
        'cancelada': 'cancelada'
      };
      return map[res.toLowerCase()] || res.toLowerCase();
    };

    // Normalize action type
    const normalizeType = (type: string) => {
      const map: { [key: string]: string } = {
        'pequeno': 'pequeno',
        'médio': 'medio',
        'grande': 'grande'
      };
      return map[type.toLowerCase()] || type.toLowerCase();
    };

    // Calculate XP based on action type and result
    const calculateXP = (type: string, res: string): number => {
      const baseXP: { [key: string]: number } = {
        'pequeno': 10,
        'medio': 25,
        'grande': 50
      };

      const normalizedType = normalizeType(type);
      const normalizedResult = normalizeResult(res);
      let xp = baseXP[normalizedType] || 10;

      // Adjust XP based on result
      if (normalizedResult === 'vitoria') {
        return xp; // Full XP for victory
      } else if (normalizedResult === 'derrota') {
        return Math.floor(xp / 2); // Half XP for defeat
      } else {
        return 5; // Minimal XP for cancelled
      }
    };

    const xpGained = calculateXP(actionType, result);
    const normalizedResult = normalizeResult(result);
    const normalizedType = normalizeType(actionType);

    // Create action
    const { data: action, error } = await supabase
      .from('actions')
      .insert({
        action_type: normalizedType,
        action_name: actionName,
        date_time: dateTime,
        result: normalizedResult,
        manager_id: user.id,
        participants: participants || [], // Array de nomes em string
        observations: observations || '',
        created_by: user.id,
      })
      .select(`
        *,
        manager:profiles!manager_id(id, username, email, role),
        createdBy:profiles!created_by(id, username)
      `)
      .single();

    if (error) throw error;

    // Update user statistics (the one who created the action)
    const { data: currentProfile, error: profileError } = await supabase
      .from('profiles')
      .select('actions_participated, victories, defeats, reputation')
      .eq('id', user.id)
      .single();

    if (!profileError && currentProfile) {
      const updates: any = {
        actions_participated: (currentProfile.actions_participated || 0) + 1,
        reputation: (currentProfile.reputation || 0) + xpGained,
      };

      if (normalizedResult === 'vitoria') {
        updates.victories = (currentProfile.victories || 0) + 1;
      } else if (normalizedResult === 'derrota') {
        updates.defeats = (currentProfile.defeats || 0) + 1;
      }

      await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);
    }

    return NextResponse.json({
      ...action,
      _id: action.id,
      actionType: action.action_type,
      actionName: action.action_name,
      dateTime: action.date_time,
      participants: action.participants || [],
      xpGained,
      message: `Ação registrada com sucesso! +${xpGained} XP`
    }, { status: 201 });
  } catch (error: any) {
    console.error('Create action error:', error);
    return NextResponse.json(
      { message: 'Erro ao criar ação', error: error.message },
      { status: 500 }
    );
  }
}

