// src/App.js
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import Feedback from './pages/Feedback';
import Login from './pages/Login';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('Dashboard');
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Kolla om användaren redan är inloggad
  useEffect(() => {
    const savedUser = localStorage.getItem('ventixe_user');
    const savedToken = localStorage.getItem('ventixe_token');
    
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('ventixe_user');
    localStorage.removeItem('ventixe_token');
    setUser(null);
    setIsLoggedIn(false);
    setCurrentPage('Dashboard');
  };

  // Visa login om inte inloggad
  if (!isLoggedIn) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  const renderCurrentPage = () => {
    switch(currentPage) {
      case 'Dashboard':
        return <Dashboard user={user} />;
      case 'Events':
        return <Events />;
      case 'Feedback':
        return <Feedback />;
      case 'Bookings':
        return <div style={{padding: '20px', marginLeft: '250px'}}>
          <h1>Bookings</h1>
          <p>Bookings-sidan kommer snart!</p>
        </div>;
      case 'Invoices':
        return <div style={{padding: '20px', marginLeft: '250px'}}>
          <h1>Invoices</h1>
          <p>Invoices-sidan kommer snart!</p>
        </div>;
      case 'Inbox':
        return <div style={{padding: '20px', marginLeft: '250px'}}>
          <h1>Inbox</h1>
          <p>Inbox-sidan kommer snart!</p>
        </div>;
      case 'Calendar':
        return <div style={{padding: '20px', marginLeft: '250px'}}>
          <h1>Calendar</h1>
          <p>Calendar-sidan kommer snart!</p>
        </div>;
      case 'Financials':
        return <div style={{padding: '20px', marginLeft: '250px'}}>
          <h1>Financials</h1>
          <p>Financials-sidan kommer snart!</p>
        </div>;
      case 'Gallery':
        return <div style={{padding: '20px', marginLeft: '250px'}}>
          <h1>Gallery</h1>
          <p>Gallery-sidan kommer snart!</p>
        </div>;
      default:
        return <Dashboard user={user} />;
    }
  };

  return (
    <div className="App">
      <Sidebar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
        user={user}
        onLogout={handleLogout}
      />
      {renderCurrentPage()}
    </div>
  );
}

export default App;