import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Não autorizado, sem token' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret_key') as { id: string };

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id, username, email, role, rank, status, actions_participated, victories, defeats, reputation, avatar, created_at')
      .eq('id', decoded.id)
      .single();

    if (error || !profile) {
      return NextResponse.json(
        { message: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(profile);
  } catch (error: any) {
    console.error('Get me error:', error);
    return NextResponse.json(
      { message: 'Não autorizado', error: error.message },
      { status: 401 }
    );
  }
}

