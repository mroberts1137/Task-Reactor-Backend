const express = require('express');
const MonthlyGoal = require('../models/MonthlyGoal');
const auth = require('../middleware/auth');
const router = express.Router({ mergeParams: true });

// @route   GET api/users/:user_id/monthly_goals
// @desc    Get all monthly goals for a user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const monthlyGoals = await MonthlyGoal.find({ user: req.user.id });
    res.json(monthlyGoals);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/users/:user_id/monthly_goals
// @desc    Create a monthly goal for a user
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { title, value } = req.body;
    const monthlyGoal = new MonthlyGoal({
      title,
      value,
      user: req.user.id
    });
    await monthlyGoal.save();
    res.status(201).json(monthlyGoal);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/users/:user_id/monthly_goals/:monthly_goal_id
// @desc    Get monthly goal by id for a user
// @access  Private
router.get('/:monthly_goal_id', auth, async (req, res) => {
  try {
    const monthlyGoal = await MonthlyGoal.findById(req.params.monthly_goal_id);
    if (!monthlyGoal || monthlyGoal.user.toString() !== req.user.id) {
      return res.status(404).json({ msg: 'Monthly goal not found' });
    }
    res.json(monthlyGoal);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/users/:user_id/monthly_goals/:monthly_goal_id
// @desc    Update a monthly goal for a user
// @access  Private
router.put('/:monthly_goal_id', auth, async (req, res) => {
  const { title, value } = req.body;
  const monthlyGoalFields = { title, value };

  try {
    let monthlyGoal = await MonthlyGoal.findById(req.params.monthly_goal_id);
    if (!monthlyGoal || monthlyGoal.user.toString() !== req.user.id) {
      return res.status(404).json({ msg: 'Monthly goal not found' });
    }
    monthlyGoal = await MonthlyGoal.findByIdAndUpdate(
      req.params.monthly_goal_id,
      { $set: monthlyGoalFields },
      { new: true }
    );
    res.json(monthlyGoal);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/users/:user_id/monthly_goals/:monthly_goal_id
// @desc    Delete a monthly goal for a user
// @access  Private
router.delete('/:monthly_goal_id', auth, async (req, res) => {
  try {
    const monthlyGoal = await MonthlyGoal.findById(req.params.monthly_goal_id);
    if (!monthlyGoal || monthlyGoal.user.toString() !== req.user.id) {
      return res.status(404).json({ msg: 'Monthly goal not found' });
    }
    await MonthlyGoal.findByIdAndRemove(req.params.monthly_goal_id);
    res.json({ msg: 'Monthly goal removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
