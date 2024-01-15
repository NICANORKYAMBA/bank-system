import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch, useLocation } from 'react-router-dom';
import HomePage from './components/HomePage';
import Dashboard from './pages/Dashboard';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import CreateAccountForm from './components/CreateAccountForm';
import Transactions from './pages/Transactions';
import AccountDetails from './pages/accountDetails';
import AccountOverview from './pages/AccountOverview';
import SingleAccountOverview from './pages/SingleAccountOverview';
import Navigation from './components/Navigation';
import WelcomeBonusPage from './pages/WelcomeBonusPage';
import HolidaySavingsSpecialPage from './pages/HolidaySavingsPage';

function AppWithNavigation () {
  const location = useLocation();
  const [reload, setReload] = useState(false);

  const handleTransactionCreated = () => {
    setReload(!reload);
  };

  return (
    <>
      {
       location.pathname !== '/' &&
       location.pathname !== '/registration' &&
       location.pathname !== '/login' &&
        location.pathname !== '/create-account' &&
        location.pathname !== '/welcome-bonus' &&
        location.pathname !== '/holiday-savings' &&
          <Navigation onTransactionCreated={handleTransactionCreated} />
}
      <Switch>
        <Route path='/' exact component={HomePage} />
        <Route path='/registration' component={RegisterForm} />
        <Route path='/login' component={LoginForm} />
        <Route path='/create-account' component={CreateAccountForm} />
        <Route path='/transactions' component={Transactions} />
        <Route
          path='/dashboard' render={(props) => (
            <Dashboard {...props} reload={reload} onTransactionCreated={handleTransactionCreated} />
          )}
        />
        <Route path='/account-overview/:accountId' component={SingleAccountOverview} />
        <Route path='/account-overview' component={AccountOverview} />
        <Route path='/account-details' component={AccountDetails} />
        <Route path='/welcome-bonus' component={WelcomeBonusPage} />
        <Route path='/holiday-savings' component={HolidaySavingsSpecialPage} />
        {/* Add more routes as needed */}
      </Switch>
    </>
  );
}

function App () {
  return (
    <Router>
      <AppWithNavigation />
    </Router>
  );
}

export default App;
