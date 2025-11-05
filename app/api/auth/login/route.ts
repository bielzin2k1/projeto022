import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Sign in with Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      return NextResponse.json(
        { message: 'Credenciais inválidas' },
        { status: 401 }
      );
    }

    // Get profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { message: 'Perfil não encontrado' },
        { status: 404 }
      );
    }

    // Update status to online
    await supabase
      .from('profiles')
      .update({ status: 'online' })
      .eq('id', authData.user.id);

    // Generate JWT
    const token = jwt.sign(
      { id: profile.id },
      process.env.JWT_SECRET || 'default_secret_key',
      { expiresIn: '30d' }
    );

    return NextResponse.json({
      _id: profile.id,
      username: profile.username,
      email: profile.email,
      role: profile.role,
      rank: profile.rank,
      reputation: profile.reputation,
      token,
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Erro ao fazer login', error: error.message },
      { status: 500 }
    );
  }
}

