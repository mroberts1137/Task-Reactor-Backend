const mongoose = require('mongoose');

const DailyGoalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('DailyGoal', DailyGoalSchema);
