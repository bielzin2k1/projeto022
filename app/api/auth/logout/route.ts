import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret_key') as { id: string };

    await supabase
      .from('profiles')
      .update({ status: 'offline' })
      .eq('id', decoded.id);

    return NextResponse.json({ message: 'Logout realizado com sucesso' });
  } catch (error: any) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { message: 'Erro ao fazer logout' },
      { status: 500 }
    );
  }
}

