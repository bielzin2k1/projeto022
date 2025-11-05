const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/actions
// @desc    Get all actions
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { actionType, result, manager, startDate, endDate } = req.query;
    
    let where = {};
    
    if (actionType) where.actionType = actionType.toUpperCase();
    if (result) where.result = result.toUpperCase();
    if (manager) where.managerId = manager;
    if (startDate || endDate) {
      where.dateTime = {};
      if (startDate) where.dateTime.gte = new Date(startDate);
      if (endDate) where.dateTime.lte = new Date(endDate);
    }

    const actions = await req.prisma.action.findMany({
      where,
      include: {
        manager: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            username: true,
          },
        },
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
                role: true,
              },
            },
          },
        },
      },
      orderBy: {
        dateTime: 'desc',
      },
    });

    // Transform response to match frontend expectations
    const transformedActions = actions.map(action => ({
      ...action,
      participants: action.participants.map(p => p.user),
    }));

    res.json(transformedActions);
  } catch (error) {
    console.error('Get actions error:', error);
    res.status(500).json({ message: 'Erro ao buscar ações', error: error.message });
  }
});

// @route   GET /api/actions/:id
// @desc    Get single action
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const action = await req.prisma.action.findUnique({
      where: { id: req.params.id },
      include: {
        manager: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            username: true,
          },
        },
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
                role: true,
              },
            },
          },
        },
      },
    });

    if (!action) {
      return res.status(404).json({ message: 'Ação não encontrada' });
    }

    // Transform response
    const transformedAction = {
      ...action,
      participants: action.participants.map(p => p.user),
    };

    res.json(transformedAction);
  } catch (error) {
    console.error('Get action error:', error);
    res.status(500).json({ message: 'Erro ao buscar ação', error: error.message });
  }
});

// @route   POST /api/actions
// @desc    Create new action
// @access  Private (Líder, Gerente)
router.post('/', protect, authorize('LIDER', 'GERENTE'), async (req, res) => {
  try {
    const { actionType, actionName, dateTime, participants, result, observations } = req.body;

    // Create action with participants
    const action = await req.prisma.action.create({
      data: {
        actionType: actionType.toUpperCase(),
        actionName,
        dateTime: new Date(dateTime),
        result: result.toUpperCase(),
        observations,
        managerId: req.user.id,
        createdById: req.user.id,
        participants: {
          create: participants.map(userId => ({
            userId,
          })),
        },
      },
      include: {
        manager: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            username: true,
          },
        },
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
                role: true,
              },
            },
          },
        },
      },
    });

    // Update participants statistics
    if (participants && participants.length > 0) {
      for (const participantId of participants) {
        const participant = await req.prisma.user.findUnique({
          where: { id: participantId },
        });

        if (participant) {
          let reputationChange = 0;
          let victoriesInc = 0;
          let defeatsInc = 0;

          if (result.toUpperCase() === 'VITORIA') {
            reputationChange = 10;
            victoriesInc = 1;
          } else if (result.toUpperCase() === 'DERROTA') {
            reputationChange = -5;
            defeatsInc = 1;
          }

          await req.prisma.user.update({
            where: { id: participantId },
            data: {
              actionsParticipated: { increment: 1 },
              victories: { increment: victoriesInc },
              defeats: { increment: defeatsInc },
              reputation: { increment: reputationChange },
            },
          });
        }
      }
    }

    // Transform response
    const transformedAction = {
      ...action,
      participants: action.participants.map(p => p.user),
    };

    res.status(201).json(transformedAction);
  } catch (error) {
    console.error('Create action error:', error);
    res.status(500).json({ message: 'Erro ao criar ação', error: error.message });
  }
});

// @route   PUT /api/actions/:id
// @desc    Update action
// @access  Private (Líder, Gerente)
router.put('/:id', protect, authorize('LIDER', 'GERENTE'), async (req, res) => {
  try {
    const action = await req.prisma.action.findUnique({
      where: { id: req.params.id },
    });

    if (!action) {
      return res.status(404).json({ message: 'Ação não encontrada' });
    }

    const { actionType, actionName, dateTime, result, observations } = req.body;

    const updatedAction = await req.prisma.action.update({
      where: { id: req.params.id },
      data: {
        ...(actionType && { actionType: actionType.toUpperCase() }),
        ...(actionName && { actionName }),
        ...(dateTime && { dateTime: new Date(dateTime) }),
        ...(result && { result: result.toUpperCase() }),
        ...(observations !== undefined && { observations }),
      },
      include: {
        manager: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            username: true,
          },
        },
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
                role: true,
              },
            },
          },
        },
      },
    });

    // Transform response
    const transformedAction = {
      ...updatedAction,
      participants: updatedAction.participants.map(p => p.user),
    };

    res.json(transformedAction);
  } catch (error) {
    console.error('Update action error:', error);
    res.status(500).json({ message: 'Erro ao atualizar ação', error: error.message });
  }
});

// @route   DELETE /api/actions/:id
// @desc    Delete action
// @access  Private (Líder only)
router.delete('/:id', protect, authorize('LIDER'), async (req, res) => {
  try {
    const action = await req.prisma.action.findUnique({
      where: { id: req.params.id },
    });

    if (!action) {
      return res.status(404).json({ message: 'Ação não encontrada' });
    }

    await req.prisma.action.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Ação removida com sucesso' });
  } catch (error) {
    console.error('Delete action error:', error);
    res.status(500).json({ message: 'Erro ao deletar ação', error: error.message });
  }
});

module.exports = router;
