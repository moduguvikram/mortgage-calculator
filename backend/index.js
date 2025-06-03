const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/hello', (req, res) => {
  res.status(200).json({ message: 'Hello from the backend!' });
});

app.post('/api/hello', (req, res) => {
  try {
    const {
      principal,
      interestRate,
      loanTerm,
      extraPayment,
      startDate,
    } = req.body;

    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    const baseMonthlyPayment = (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -numberOfPayments));
    const totalMonthlyPayment = baseMonthlyPayment + extraPayment;

    res.status(200).json({
      monthlyPayment: parseFloat(totalMonthlyPayment.toFixed(2)),
    });
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong', details: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});