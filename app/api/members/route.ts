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

// GET /api/members - List all members
export async function GET(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
    }

    const { data: members, error } = await supabase
      .from('profiles')
      .select('id, username, email, role, rank, status, actions_participated, victories, defeats, reputation, avatar, created_at')
      .order('reputation', { ascending: false });

    if (error) throw error;

    // Transform role names
    const formatRole = (role: string) => {
      const roleMap: { [key: string]: string } = {
        'lider': 'Líder',
        'gerente': 'Gerente',
        'membro': 'Membro'
      };
      return roleMap[role.toLowerCase()] || role;
    };

    // Transform status
    const formatStatus = (status: string) => {
      return status === 'online' ? 'Online' : 'Offline';
    };

    const transformed = members?.map(member => ({
      _id: member.id,
      id: member.id,
      username: member.username,
      email: member.email,
      role: formatRole(member.role),
      rank: member.rank,
      status: formatStatus(member.status),
      actionsParticipated: member.actions_participated,
      victories: member.victories,
      defeats: member.defeats,
      reputation: member.reputation,
      avatar: member.avatar,
      createdAt: member.created_at,
    })) || [];

    return NextResponse.json(transformed);
  } catch (error: any) {
    console.error('Get members error:', error);
    return NextResponse.json(
      { message: 'Erro ao buscar membros', error: error.message },
      { status: 500 }
    );
  }
}

