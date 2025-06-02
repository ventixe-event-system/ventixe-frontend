// src/pages/Login.js
import React, { useState } from 'react';
import './Login.css';
import { API_CONFIG } from '../config';

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Samma diamant-logotyp som i sidebar
  const DiamondLogo = () => (
    <svg width="48" height="48" viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="loginDiamondGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6"/>
          <stop offset="100%" stopColor="#a855f7"/>
        </linearGradient>
      </defs>
      <path 
        d="M50 10 L75 35 L50 90 L25 35 Z" 
        fill="url(#loginDiamondGradient)"
        stroke="none"
      />
      <path 
        d="M25 35 L75 35 L50 55 Z" 
        fill="rgba(255,255,255,0.2)"
      />
    </svg>
  );

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Anropa vårt backend API (använd HTTP port 5271)
      const response = await fetch(`${API_CONFIG.USER_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Inloggning lyckades!
        console.log('Login success:', data);
        alert(`Välkommen ${data.user.name}! Token: ${data.token.substring(0, 20)}...`);
        
        // Spara token och user data
        localStorage.setItem('ventixe_token', data.token);
        localStorage.setItem('ventixe_user', JSON.stringify(data.user));
        
        // Navigera till dashboard
        if (onLoginSuccess) {
          onLoginSuccess(data.user);
        }
      } else {
        // Inloggning misslyckades
        setError(data.message || 'Inloggning misslyckades');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Kunde inte ansluta till servern. Se till att backend körs!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="logo">
            <DiamondLogo />
            <span className="logo-text">Ventixe</span>
          </div>
          <h2>Välkommen tillbaka!</h2>
          <p>Logga in för att fortsätta till din dashboard</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label>E-post</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="orlando@ventixe.se"
              required
            />
          </div>

          <div className="form-group">
            <label>Lösenord</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password123"
              required
            />
          </div>

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? 'Loggar in...' : 'Logga in'}
          </button>
        </form>

        <div className="login-footer">
          <p><strong>Demo-konto:</strong></p>
          <p>E-post: orlando@ventixe.se</p>
          <p>Lösenord: password123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;