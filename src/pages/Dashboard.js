// src/pages/Dashboard.js
import React from 'react';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Hej Orlando, välkommen tillbaka!</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card events">
          <div className="stat-icon">🎭</div>
          <div className="stat-number">345</div>
          <div className="stat-label">Kommande Events</div>
        </div>
        <div className="stat-card bookings">
          <div className="stat-icon">📊</div>
          <div className="stat-number">1798</div>
          <div className="stat-label">Total Bokningar</div>
        </div>
        <div className="stat-card sold">
          <div className="stat-icon">🎫</div>
          <div className="stat-number">1250</div>
          <div className="stat-label">Biljetter Sålda</div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="card">
          <h3>Försäljningsintäkter</h3>
          <div className="revenue-amount">$348,805</div>
          <div className="revenue-chart">
            <div className="chart-placeholder">
              📈 Här kommer ett diagram senare
            </div>
          </div>
        </div>

        <div className="card">
          <h3>Populära Events</h3>
          <div className="popular-events">
            <div className="event-stat">
              <span className="event-category">Music</span>
              <div className="progress-bar">
                <div className="progress-fill" style={{width: '40%', backgroundColor: '#e91e63'}}></div>
              </div>
              <span className="percentage">40%</span>
            </div>
            <div className="event-stat">
              <span className="event-category">Sports</span>
              <div className="progress-bar">
                <div className="progress-fill" style={{width: '30%', backgroundColor: '#9c27b0'}}></div>
              </div>
              <span className="percentage">30%</span>
            </div>
            <div className="event-stat">
              <span className="event-category">Fashion</span>
              <div className="progress-bar">
                <div className="progress-fill" style={{width: '25%', backgroundColor: '#673ab7'}}></div>
              </div>
              <span className="percentage">25%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;