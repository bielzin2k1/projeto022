const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/members
// @desc    Get all members
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const members = await req.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        rank: true,
        status: true,
        actionsParticipated: true,
        victories: true,
        defeats: true,
        reputation: true,
        avatar: true,
        createdAt: true,
      },
      orderBy: {
        reputation: 'desc',
      },
    });

    // Transform _id to match frontend
    const transformedMembers = members.map(member => ({
      ...member,
      _id: member.id,
    }));

    res.json(transformedMembers);
  } catch (error) {
    console.error('Get members error:', error);
    res.status(500).json({ message: 'Erro ao buscar membros', error: error.message });
  }
});

// @route   GET /api/members/:id
// @desc    Get single member
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const member = await req.prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        rank: true,
        status: true,
        actionsParticipated: true,
        victories: true,
        defeats: true,
        reputation: true,
        avatar: true,
        createdAt: true,
      },
    });

    if (!member) {
      return res.status(404).json({ message: 'Membro não encontrado' });
    }

    res.json({ ...member, _id: member.id });
  } catch (error) {
    console.error('Get member error:', error);
    res.status(500).json({ message: 'Erro ao buscar membro', error: error.message });
  }
});

// @route   PUT /api/members/:id
// @desc    Update member
// @access  Private (Líder only)
router.put('/:id', protect, authorize('LIDER'), async (req, res) => {
  try {
    const { role, rank, reputation } = req.body;

    const member = await req.prisma.user.findUnique({
      where: { id: req.params.id },
    });

    if (!member) {
      return res.status(404).json({ message: 'Membro não encontrado' });
    }

    const updatedMember = await req.prisma.user.update({
      where: { id: req.params.id },
      data: {
        ...(role && { role: role.toUpperCase() }),
        ...(rank && { rank }),
        ...(reputation !== undefined && { reputation }),
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        rank: true,
        status: true,
        actionsParticipated: true,
        victories: true,
        defeats: true,
        reputation: true,
        avatar: true,
        createdAt: true,
      },
    });

    res.json({ ...updatedMember, _id: updatedMember.id });
  } catch (error) {
    console.error('Update member error:', error);
    res.status(500).json({ message: 'Erro ao atualizar membro', error: error.message });
  }
});

// @route   DELETE /api/members/:id
// @desc    Delete member
// @access  Private (Líder only)
router.delete('/:id', protect, authorize('LIDER'), async (req, res) => {
  try {
    const member = await req.prisma.user.findUnique({
      where: { id: req.params.id },
    });

    if (!member) {
      return res.status(404).json({ message: 'Membro não encontrado' });
    }

    await req.prisma.user.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Membro removido com sucesso' });
  } catch (error) {
    console.error('Delete member error:', error);
    res.status(500).json({ message: 'Erro ao deletar membro', error: error.message });
  }
});

// @route   GET /api/members/ranking/top
// @desc    Get top members by reputation
// @access  Private
router.get('/ranking/top', protect, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const topMembers = await req.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        rank: true,
        status: true,
        actionsParticipated: true,
        victories: true,
        defeats: true,
        reputation: true,
        avatar: true,
        createdAt: true,
      },
      orderBy: {
        reputation: 'desc',
      },
      take: limit,
    });

    // Transform _id
    const transformedMembers = topMembers.map(member => ({
      ...member,
      _id: member.id,
    }));

    res.json(transformedMembers);
  } catch (error) {
    console.error('Get ranking error:', error);
    res.status(500).json({ message: 'Erro ao buscar ranking', error: error.message });
  }
});

module.exports = router;
