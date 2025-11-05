import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

function getAuthUser(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  try {
    const token = authHeader.split(' ')[1];
    return jwt.verify(token, process.env.JWT_SECRET || 'default_secret_key') as { id: string };
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'week';

    let dateLimit = new Date();
    if (period === 'day') dateLimit.setDate(dateLimit.getDate() - 1);
    else if (period === 'week') dateLimit.setDate(dateLimit.getDate() - 7);
    else if (period === 'month') dateLimit.setMonth(dateLimit.getMonth() - 1);

    const { data: actions } = await supabase
      .from('actions')
      .select('date_time, result')
      .gte('date_time', dateLimit.toISOString())
      .order('date_time', { ascending: true });

    const grouped = (actions || []).reduce((acc: any, action: any) => {
      const date = new Date(action.date_time).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { _id: date, victories: 0, defeats: 0, total: 0 };
      }
      acc[date].total++;
      if (action.result === 'vitoria') acc[date].victories++;
      if (action.result === 'derrota') acc[date].defeats++;
      return acc;
    }, {});

    return NextResponse.json(Object.values(grouped));
  } catch (error: any) {
    return NextResponse.json({ message: 'Erro', error: error.message }, { status: 500 });
  }
}

