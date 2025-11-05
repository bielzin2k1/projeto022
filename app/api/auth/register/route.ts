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
    const { username, email, password, role } = await request.json();

    // Check if user exists
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id')
      .or(`email.eq.${email},username.eq.${username}`)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { message: 'Usuário já existe' },
        { status: 400 }
      );
    }

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) throw authError;

    // Create profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        username,
        email,
        role: role ? role.toLowerCase() : 'membro',
      })
      .select()
      .single();

    if (profileError) throw profileError;

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
      token,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Register error:', error);
    return NextResponse.json(
      { message: 'Erro ao criar usuário', error: error.message },
      { status: 500 }
    );
  }
}

