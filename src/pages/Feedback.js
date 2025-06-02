// src/pages/Feedback.js
import React, { useState, useEffect } from 'react';
import './Feedback.css';
import { API_CONFIG } from '../config';

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [events, setEvents] = useState([]);
  const [newFeedback, setNewFeedback] = useState({
    eventId: '',
    rating: 5,
    comment: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Hämta events och feedback när komponenten laddas
  useEffect(() => {
    fetchEvents();
    fetchFeedbacks();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${API_CONFIG.EVENT_API_URL}/api/events`);
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      // Mock feedback data för demonstration
      const mockFeedbacks = [
        {
          id: 1,
          eventTitle: 'Symphony Under the Stars',
          userName: 'Anna Karlsson',
          rating: 5,
          comment: 'Fantastisk upplevelse! Musiken var otrolig och atmosfären perfekt.',
          date: '2024-04-12',
          avatar: 'AK'
        },
        {
          id: 2,
          eventTitle: 'Adventure Gear Show',
          userName: 'Erik Lindberg',
          rating: 4,
          comment: 'Bra utställning med många intressanta produkter. Lite trångt bara.',
          date: '2024-06-07',
          avatar: 'EL'
        },
        {
          id: 3,
          eventTitle: 'Runway Revolution 2029',
          userName: 'Sofia Andersson',
          rating: 5,
          comment: 'Modevisningen var spektakulär! Kreativa designer och professionell organisation.',
          date: '2024-05-03',
          avatar: 'SA'
        },
        {
          id: 4,
          eventTitle: 'Tech Future Expo',
          userName: 'Marcus Johansson',
          rating: 4,
          comment: 'Mycket intressanta presentationer om framtidens teknik. Väl värt pengarna.',
          date: '2024-06-02',
          avatar: 'MJ'
        }
      ];
      
      // Lägg till eventuella sparade feedback från localStorage
      const savedFeedbacks = JSON.parse(localStorage.getItem('ventixe_feedbacks') || '[]');
      const allFeedbacks = [...mockFeedbacks, ...savedFeedbacks];
      
      setFeedbacks(allFeedbacks.sort((a, b) => new Date(b.date) - new Date(a.date)));
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    
    if (!newFeedback.eventId || !newFeedback.comment.trim()) {
      alert('Vänligen fyll i alla fält');
      return;
    }

    setSubmitting(true);

    try {
      const selectedEvent = events.find(event => event.id === parseInt(newFeedback.eventId));
      const user = JSON.parse(localStorage.getItem('ventixe_user') || '{}');
      
      if (!selectedEvent) {
        alert('Valt event hittades inte');
        return;
      }

      const feedback = {
        id: Date.now(), // Enkel ID för demo
        eventTitle: selectedEvent.title,
        userName: user.name || 'Anonym Användare',
        rating: newFeedback.rating,
        comment: newFeedback.comment.trim(),
        date: new Date().toISOString().split('T')[0],
        avatar: (user.name || 'AU').split(' ').map(n => n[0]).join('').toUpperCase()
      };

      // Spara feedback lokalt (i en riktig app skulle detta gå till backend)
      const existingFeedbacks = JSON.parse(localStorage.getItem('ventixe_feedbacks') || '[]');
      const updatedFeedbacks = [feedback, ...existingFeedbacks];
      localStorage.setItem('ventixe_feedbacks', JSON.stringify(updatedFeedbacks));

      // Uppdatera state
      setFeedbacks([feedback, ...feedbacks]);
      setNewFeedback({ eventId: '', rating: 5, comment: '' });
      
      alert('✅ Tack för din feedback!');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('❌ Kunde inte skicka feedback. Försök igen.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating, interactive = false, onRatingChange = null) => {
    return [...Array(5)].map((_, index) => (
      <span
        key={index}
        className={`star ${index < rating ? 'filled' : ''} ${interactive ? 'interactive' : ''}`}
        onClick={interactive ? () => onRatingChange(index + 1) : undefined}
      >
        ★
      </span>
    ));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('sv-SE', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getAverageRating = () => {
    if (feedbacks.length === 0) return 0;
    const sum = feedbacks.reduce((acc, feedback) => acc + feedback.rating, 0);
    return (sum / feedbacks.length).toFixed(1);
  };

  return (
    <div className="feedback-page">
      <div className="feedback-header">
        <h1>Feedback</h1>
        <p>Dela din upplevelse och hjälp oss att förbättra våra events</p>
        
        <div className="feedback-stats">
          <div className="stat-item">
            <span className="stat-number">{feedbacks.length}</span>
            <span className="stat-label">Totala recensioner</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{getAverageRating()}</span>
            <span className="stat-label">Genomsnittsbetyg</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{events.length}</span>
            <span className="stat-label">Aktiva events</span>
          </div>
        </div>
      </div>

      <div className="feedback-content">
        {/* Formulär för att lämna feedback */}
        <div className="feedback-form-section">
          <div className="card">
            <h3>Lämna Feedback</h3>
            <form onSubmit={handleSubmitFeedback} className="feedback-form">
              <div className="form-group">
                <label>Välj Event</label>
                <select
                  value={newFeedback.eventId}
                  onChange={(e) => setNewFeedback({...newFeedback, eventId: e.target.value})}
                  required
                >
                  <option value="">Välj ett event...</option>
                  {events.map(event => (
                    <option key={event.id} value={event.id}>
                      {event.title} - {formatDate(event.date)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Betyg</label>
                <div className="rating-input">
                  {renderStars(newFeedback.rating, true, (rating) => 
                    setNewFeedback({...newFeedback, rating})
                  )}
                  <span className="rating-text">({newFeedback.rating}/5)</span>
                </div>
              </div>

              <div className="form-group">
                <label>Kommentar</label>
                <textarea
                  value={newFeedback.comment}
                  onChange={(e) => setNewFeedback({...newFeedback, comment: e.target.value})}
                  placeholder="Dela din upplevelse av eventet..."
                  rows="4"
                  required
                />
              </div>

              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting ? 'Skickar...' : 'Skicka Feedback'}
              </button>
            </form>
          </div>
        </div>

        {/* Lista med befintlig feedback */}
        <div className="feedback-list-section">
          <h3>Senaste Feedback ({feedbacks.length})</h3>
          
          {loading ? (
            <div className="loading">Laddar feedback...</div>
          ) : feedbacks.length === 0 ? (
            <div className="no-feedback">
              <p>Ingen feedback ännu. Var den första att dela din upplevelse!</p>
            </div>
          ) : (
            <div className="feedback-list">
              {feedbacks.map(feedback => (
                <div key={feedback.id} className="feedback-item card">
                  <div className="feedback-header-item">
                    <div className="user-info">
                      <div className="avatar">{feedback.avatar}</div>
                      <div>
                        <div className="user-name">{feedback.userName}</div>
                        <div className="event-title">{feedback.eventTitle}</div>
                      </div>
                    </div>
                    <div className="feedback-meta">
                      <div className="rating">
                        {renderStars(feedback.rating)}
                      </div>
                      <div className="feedback-date">{formatDate(feedback.date)}</div>
                    </div>
                  </div>
                  <div className="feedback-comment">
                    {feedback.comment}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Feedback;