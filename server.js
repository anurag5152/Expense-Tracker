require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.static('public'));

const mongoURI = process.env.MONGO_URI;

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1);
  });

const authRoutes = require('./routes/auth');
const expenseRoutes = require('./routes/expenses');

app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);

app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
