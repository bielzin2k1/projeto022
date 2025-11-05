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

    const { data: actions } = await supabase
      .from('actions')
      .select('action_type, result');

    const grouped = (actions || []).reduce((acc: any, action: any) => {
      const type = action.action_type;
      if (!acc[type]) {
        acc[type] = { _id: type, count: 0, victories: 0, defeats: 0 };
      }
      acc[type].count++;
      if (action.result === 'vitoria') acc[type].victories++;
      if (action.result === 'derrota') acc[type].defeats++;
      return acc;
    }, {});

    return NextResponse.json(Object.values(grouped));
  } catch (error: any) {
    return NextResponse.json({ message: 'Erro', error: error.message }, { status: 500 });
  }
}

