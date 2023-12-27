import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePage from './components/HomePage';
import Dashboard from './pages/userDashboard';
import AccountDetails from './pages/accountDetails';
import Transactions from './pages/transactionDetails';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={HomePage} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/account-details" component={AccountDetails} />
        <Route path="/transactions" component={Transactions} />
        {/* Add more routes as needed */}
      </Switch>
    </Router>
  );
}

export default App;
