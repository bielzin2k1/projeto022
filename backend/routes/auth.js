const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const supabase = require('../db');
const { protect } = require('../middleware/auth');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'default_secret_key', {
    expiresIn: '30d',
  });
};

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if user exists
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id')
      .or(`email.eq.${email},username.eq.${username}`)
      .single();

    if (existingUser) {
      return res.status(400).json({ message: 'Usuário já existe' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

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

    res.status(201).json({
      _id: profile.id,
      username: profile.username,
      email: profile.email,
      role: profile.role,
      token: generateToken(profile.id),
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Erro ao criar usuário', error: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Sign in with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Get profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    // Update status to online
    await supabase
      .from('profiles')
      .update({ status: 'online' })
      .eq('id', data.user.id);

    res.json({
      _id: profile.id,
      username: profile.username,
      email: profile.email,
      role: profile.role,
      rank: profile.rank,
      reputation: profile.reputation,
      token: generateToken(profile.id),
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Erro ao fazer login', error: error.message });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id, username, email, role, rank, status, actions_participated, victories, defeats, reputation, avatar, created_at')
      .eq('id', req.user.id)
      .single();

    if (error) throw error;

    res.json(profile);
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ message: 'Erro ao buscar usuário', error: error.message });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', protect, async (req, res) => {
  try {
    await supabase
      .from('profiles')
      .update({ status: 'offline' })
      .eq('id', req.user.id);

    res.json({ message: 'Logout realizado com sucesso' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Erro ao fazer logout', error: error.message });
  }
});

module.exports = router;
