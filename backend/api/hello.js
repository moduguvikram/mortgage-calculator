export default function handler(req, res) {

  if(req.method === 'OPTIONS'){
    res.status(200).json({ message: 'Hello from the backend!' }).end();
    return;
  }

  if (req.method === 'GET') {
    res.status(200).json({ message: 'Hello from the backend!' });
  } else if (req.method === 'POST') {
    try {
      const {
        principal,
        interestRate,
        loanTerm,
        extraPayment,
        startDate,
      } = req.body;
      console.log('Received data:', req.body);
      console.log('Principal:', principal);
      console.log('Interest Rate:', interestRate);  
      console.log('Loan Term:', loanTerm);
      console.log('Extra Payment:', extraPayment);
      console.log('Start Date:', startDate);
      // Validate input

      const monthlyRate = interestRate / 100 / 12;
      const numberOfPayments = loanTerm * 12;
      const baseMonthlyPayment = (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -numberOfPayments));
      const totalMonthlyPayment = baseMonthlyPayment + extraPayment;

      // Calculate new payoff
      let balance = principal;
      let months = 0;
      let totalInterest = 0;
      while (balance > 0 && months < 1000) {
        const interest = balance * monthlyRate;
        let payment = Math.min(totalMonthlyPayment, balance + interest);
        balance = balance + interest - payment;
        totalInterest += interest;
        months++;
      }

      // Original interest (no extra payment)
      let origBalance = principal;
      let origMonths = 0;
      let origInterest = 0;
      while (origBalance > 0 && origMonths < 1000) {
        const interest = origBalance * monthlyRate;
        let payment = Math.min(baseMonthlyPayment, origBalance + interest);
        origBalance = origBalance + interest - payment;
        origInterest += interest;
        origMonths++;
      }

      // Calculate payoff date
      const payoffDate = new Date(startDate);
      payoffDate.setMonth(payoffDate.getMonth() + months);

      const origPayoffDate = new Date(startDate);
      origPayoffDate.setMonth(origPayoffDate.getMonth() + origMonths);


      res.status(200).json({
        monthlyPayment: parseFloat(totalMonthlyPayment.toFixed(2)),
        payoffDate: payoffDate.toLocaleDateString('en-US'),
        interestSaved: parseFloat((origInterest - totalInterest).toFixed(2)),
        monthsSaved: origMonths - months,
        yearsSaved: ((origMonths - months) / 12).toFixed(1),
        originalPayoffDate: origPayoffDate.toLocaleDateString('en-US'),
        originalTotalInterest: parseFloat(origInterest.toFixed(2)),
      });
    } catch (err) {
      res.status(500).json({ error: 'Something went wrong', details: err.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}