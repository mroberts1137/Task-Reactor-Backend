const express = require('express');
const cors = require('cors');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

const auth = require('./routes/auth');
const users = require('./routes/users');
const tasks = require('./routes/tasks');
const dailyGoals = require('./routes/daily_goals');
const monthlyGoals = require('./routes/monthly_goals');

dotenv.config();

const hostname = 'localhost';
const port = 5000;

const app = express();

connectDB();

const dev_origin = 'http://localhost:3000';

const corsOptions = {
  origin: [dev_origin],
  credentials: true,
  optionsSuccessStatus: 200 // For legacy browser support
};

// Apply CORS middleware to all routes
app.use(cors(corsOptions));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

/**
 * Routes
 */
app.use('/api/auth', auth);
app.use('/api/users', users);
app.use('/api/users/:user_id/tasks', tasks);
app.use('/api/users/:user_id/daily_goals', dailyGoals);
app.use('/api/users/:user_id/monthly_goals', monthlyGoals);

app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}`);
});
