# Mortgage Calculator

A cross-platform mortgage calculator built with React Native (Web/iOS/Android) and a Node.js backend, designed to help users estimate mortgage payments, payoff dates, and interest savings with extra payments.

# Application Access

Web application can be accessed using https://mortgage-f3p2ukf39-vikram-modugus-projects.vercel.app/

---

## Features

- 📅 **Select Loan Start Date** (platform-adaptive date picker)
- 💰 **Calculate Monthly Payment** based on principal, interest rate, term, and extra payments
- 📈 **See New & Original Payoff Dates**
- 💸 **View Total Interest Saved** and **Time Saved** with extra payments
- 🌐 **Web and Mobile Support** (React Native Web, iOS, Android)
- 🔗 **Backend API** for calculations (Node.js, Vercel serverless)

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (for development)

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/moduguvikram/mortgage-calculator.git
   cd mortgage-calculator
   ```

2. **Install dependencies for frontend and backend:**
   ```sh
   cd frontend
   npm install
   cd ../backend
   npm install
   ```

---

## Running Locally

### Frontend (React Native Web/Expo)

```sh
cd frontend
npm start
```
- For web: open [http://localhost:19006](http://localhost:19006)
- For iOS/Android: use Expo Go app or emulator

### Backend (API)

```sh
cd backend
npm start
```
- Default API endpoint: `http://localhost:3001/api/mortgage`

---

## Deployment

### Frontend

- Build for web:
  ```sh
  npx expo export --platform web
  ```
- Deploy the `dist` folder to [Vercel](https://vercel.com/)
  ```sh
  cd frontend
  vercel
  ```

### Backend

- Deploy the `backend` folder as Vercel serverless functions.
```sh
  cd backend
  vercel
  ```
---

## API Example

**POST** `/api/mortgage`

```json
{
  "principal": 300000,
  "interestRate": 6.5,
  "loanTerm": 25,
  "extraPayment": 500,
  "startDate": "06/02/2025"
}
```

**Response:**
```json
{
  "monthlyPayment": 2162.82,
  "payoffDate": "06/02/2045",
  "interestSaved": 50000,
  "monthsSaved": 24,
  "yearsSaved": 2,
  "originalPayoffDate": "06/02/2050",
  "originalTotalInterest": 250000
}
```

---

## License

MIT

---

## Author

[Vikram Modugu](https://github.com/moduguvikram)
