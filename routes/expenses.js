// routes/expenses.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const Expense = require('../models/expense');

// @route   POST /api/expenses
// @desc    Add a new expense
// @access  Private
router.post('/', auth, async (req, res) => {
  const { amount, category, date, description } = req.body;
  if (!amount || !category || !date) {
    return res.status(400).json({ msg: 'Please include amount, category, and date.' });
  }

  try {
    const newExpense = new Expense({
      user: req.user.id,
      amount,
      category,
      date,
      description
    });

    const expense = await newExpense.save();
    res.json(expense);
  } catch (err) {
    console.error('Error creating expense:', err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/expenses
// @desc    Get all expenses for logged-in user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    console.error('Error fetching expenses:', err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE /api/expenses/:id
// @desc    Delete an expense by ID
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    // Attempt to delete by ID
    const expense = await Expense.findByIdAndDelete(req.params.id);

    if (!expense) {
      return res.status(404).json({ msg: 'Expense not found.' });
    }
    // Ensure the deleted expense belonged to this user
    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized.' });
    }

    res.json({ msg: 'Expense removed.' });
  } catch (err) {
    console.error('Error deleting expense:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Expense not found.' });
    }
    res.status(500).send('Server error');
  }
});

module.exports = router;
