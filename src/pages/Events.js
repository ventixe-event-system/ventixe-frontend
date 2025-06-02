// src/pages/Events.js
import React, { useState, useEffect } from 'react';
import './Events.css';
import { API_CONFIG } from '../config';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All Category');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const categories = [
    'All Category', 'Outdoor & Adventure', 'Music', 'Fashion', 
    'Health & Wellness', 'Technology', 'Food & Culinary'
  ];

  // Hämta events från backend när komponenten laddas
  useEffect(() => {
    fetchEvents();
  }, []);

  // Filtrera events när kategori eller sökterm ändras
  useEffect(() => {
    let filtered = events;

    if (selectedCategory !== 'All Category') {
      filtered = filtered.filter(event => event.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredEvents(filtered);
  }, [selectedCategory, searchTerm, events]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_CONFIG.EVENT_API_URL}/api/events`);
      
      if (!response.ok) {
        throw new Error('Kunde inte hämta events');
      }

      const data = await response.json();
      setEvents(data);
      setFilteredEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Kunde inte hämta events. Se till att Event Service körs på port 5272.');
    } finally {
      setLoading(false);
    }
  };

  const handleBookEvent = async (event) => {
    try {
      const user = JSON.parse(localStorage.getItem('ventixe_user') || '{}');
      
      const response = await fetch(`${API_CONFIG.EVENT_API_URL}/api/events/${event.id}/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId: event.id,
          userId: user.id || 1,
          tickets: 1
        })
      });

      const result = await response.json();

      if (response.ok) {
        alert(`✅ ${result.message}\nTotalpris: ${result.totalPrice}`);
        // Uppdatera events för att visa nya sålda biljetter
        fetchEvents();
      } else {
        alert(`❌ ${result.message}`);
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('❌ Kunde inte boka eventet. Försök igen.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('sv-SE', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="events-page">
        <div className="loading">
          <h2>🔄 Laddar events...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="events-page">
        <div className="error-message">
          <h2>❌ {error}</h2>
          <button onClick={fetchEvents} className="btn-primary">
            Försök igen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="events-page">
      <div className="events-header">
        <h1>Events</h1>
        <div className="events-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Sök event, plats, etc..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-filter"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <button className="btn-primary">Skapa Event</button>
        </div>
      </div>

      <div className="filter-tabs">
        {categories.slice(1).map(category => (
          <button
            key={category}
            className={`filter-tab ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
            <span className="status-dot">Active</span>
          </button>
        ))}
      </div>

      <div className="events-grid">
        {filteredEvents.map(event => (
          <div key={event.id} className="event-card">
            <div className="event-image">
              <div 
                className="event-placeholder" 
                style={{ backgroundColor: event.color }}
              >
                <span className="event-icon">🎭</span>
              </div>
              <div 
                className="event-category-badge" 
                style={{ backgroundColor: event.color }}
              >
                {event.category}
                <span className="status-badge">{event.status}</span>
              </div>
            </div>
            <div className="event-content">
              <div className="event-date-time">
                <span className="event-date">{formatDate(event.date)}</span>
                <span className="event-time">{event.time}</span>
              </div>
              <h3 className="event-title">{event.title}</h3>
              <p className="event-location">📍 {event.location}</p>
              <div className="tickets-info">
                <span className="tickets-sold">
                  {event.soldTickets}/{event.maxTickets} biljetter sålda
                </span>
              </div>
              <div className="event-footer">
                <span className="event-price">${event.price}</span>
                <button 
                  className="btn-book" 
                  style={{ backgroundColor: event.color }}
                  onClick={() => handleBookEvent(event)}
                  disabled={event.soldTickets >= event.maxTickets}
                >
                  {event.soldTickets >= event.maxTickets ? 'Utsåld' : 'Boka Nu'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination">
        <span>Visar {filteredEvents.length} av {events.length} events</span>
        <div className="pagination-controls">
          <button className="page-btn">❮</button>
          <button className="page-btn active">1</button>
          <button className="page-btn">2</button>
          <button className="page-btn">❯</button>
        </div>
      </div>
    </div>
  );
};

export default Events;