const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// @route   GET /api/statistics/dashboard
// @desc    Get dashboard statistics
// @access  Private
router.get('/dashboard', protect, async (req, res) => {
  try {
    const totalActions = await req.prisma.action.count();
    const victories = await req.prisma.action.count({
      where: { result: 'VITORIA' },
    });
    const defeats = await req.prisma.action.count({
      where: { result: 'DERROTA' },
    });
    const activeMembers = await req.prisma.user.count({
      where: { status: 'ONLINE' },
    });
    const totalMembers = await req.prisma.user.count();

    // Get last action
    const lastAction = await req.prisma.action.findFirst({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        manager: {
          select: {
            id: true,
            username: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    // Actions by type
    const smallActions = await req.prisma.action.count({
      where: { actionType: 'PEQUENO' },
    });
    const mediumActions = await req.prisma.action.count({
      where: { actionType: 'MEDIO' },
    });
    const largeActions = await req.prisma.action.count({
      where: { actionType: 'GRANDE' },
    });

    res.json({
      totalActions,
      victories,
      defeats,
      activeMembers,
      totalMembers,
      lastAction,
      actionsByType: {
        small: smallActions,
        medium: mediumActions,
        large: largeActions,
      },
      victoryRate: totalActions > 0 ? ((victories / totalActions) * 100).toFixed(1) : 0,
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Erro ao buscar estatísticas', error: error.message });
  }
});

// @route   GET /api/statistics/actions-by-type
// @desc    Get actions grouped by type
// @access  Private
router.get('/actions-by-type', protect, async (req, res) => {
  try {
    const actions = await req.prisma.action.findMany({
      select: {
        actionType: true,
        result: true,
      },
    });

    // Group by type
    const grouped = actions.reduce((acc, action) => {
      const type = action.actionType;
      if (!acc[type]) {
        acc[type] = { _id: type, count: 0, victories: 0, defeats: 0 };
      }
      acc[type].count++;
      if (action.result === 'VITORIA') acc[type].victories++;
      if (action.result === 'DERROTA') acc[type].defeats++;
      return acc;
    }, {});

    res.json(Object.values(grouped));
  } catch (error) {
    console.error('Get actions by type error:', error);
    res.status(500).json({ message: 'Erro ao buscar estatísticas por tipo', error: error.message });
  }
});

// @route   GET /api/statistics/performance-timeline
// @desc    Get performance over time
// @access  Private
router.get('/performance-timeline', protect, async (req, res) => {
  try {
    const { period = 'week' } = req.query;
    
    let dateLimit = new Date();
    if (period === 'day') dateLimit.setDate(dateLimit.getDate() - 1);
    else if (period === 'week') dateLimit.setDate(dateLimit.getDate() - 7);
    else if (period === 'month') dateLimit.setMonth(dateLimit.getMonth() - 1);

    const actions = await req.prisma.action.findMany({
      where: {
        dateTime: {
          gte: dateLimit,
        },
      },
      select: {
        dateTime: true,
        result: true,
      },
      orderBy: {
        dateTime: 'asc',
      },
    });

    // Group by date
    const grouped = actions.reduce((acc, action) => {
      const date = action.dateTime.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { _id: date, victories: 0, defeats: 0, total: 0 };
      }
      acc[date].total++;
      if (action.result === 'VITORIA') acc[date].victories++;
      if (action.result === 'DERROTA') acc[date].defeats++;
      return acc;
    }, {});

    res.json(Object.values(grouped));
  } catch (error) {
    console.error('Get timeline error:', error);
    res.status(500).json({ message: 'Erro ao buscar linha do tempo', error: error.message });
  }
});

// @route   GET /api/statistics/top-performers
// @desc    Get top performing members
// @access  Private
router.get('/top-performers', protect, async (req, res) => {
  try {
    const topPerformers = await req.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        role: true,
        actionsParticipated: true,
        victories: true,
        defeats: true,
        reputation: true,
      },
      orderBy: {
        reputation: 'desc',
      },
      take: 10,
    });

    // Transform _id
    const transformed = topPerformers.map(member => ({
      ...member,
      _id: member.id,
    }));

    res.json(transformed);
  } catch (error) {
    console.error('Get top performers error:', error);
    res.status(500).json({ message: 'Erro ao buscar top performers', error: error.message });
  }
});

module.exports = router;
