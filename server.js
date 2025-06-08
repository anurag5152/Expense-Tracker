require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
// const cors = require('cors'); // If you serve frontend separately, enable this.

const app = express();

// ====== MIDDLEWARE ======
app.use(express.json());
app.use(express.static('public'));

// app.use(cors()); // If you need CORS (e.g., frontend on a different port).

// ====== CONNECT TO MONGODB ======
const mongoURI = process.env.MONGO_URI;
mongoose
  .connect("mongodb+srv://anurag5152kumar:8TnEDYNU2NOoR5qO@cluster0.qvk92x5.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1);
  });

// ====== ROUTES ======
const authRoutes = require('./routes/auth');
const expenseRoutes = require('./routes/expenses');

// Mount API routes under /api
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);

// ====== SERVE STATIC FRONTEND ======
app.use(express.static(path.join(__dirname, 'public')));

// ====== FALLBACK TO INDEX ======
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// ====== START SERVER ======
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
