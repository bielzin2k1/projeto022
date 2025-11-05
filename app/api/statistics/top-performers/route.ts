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

    const { data: topPerformers } = await supabase
      .from('profiles')
      .select('id, username, role, actions_participated, victories, defeats, reputation')
      .order('reputation', { ascending: false })
      .limit(10);

    const transformed = (topPerformers || []).map(member => ({
      ...member,
      _id: member.id,
    }));

    return NextResponse.json(transformed);
  } catch (error: any) {
    return NextResponse.json({ message: 'Erro', error: error.message }, { status: 500 });
  }
}

