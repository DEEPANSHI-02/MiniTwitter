import { useState, useEffect } from 'react';
import './App.css';

const API_BASE = 'http://localhost:8000/api';

function App() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [formData, setFormData] = useState({
    content: '',
    author: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchNotes = async (page = 1) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_BASE}/notes?page=${page}&limit=10`);
      const data = await response.json();
      
      if (data.success) {
        setNotes(data.data);
        setPagination(data.pagination);
        setCurrentPage(page);
      } else {
        setError(data.message || 'Failed to fetch notes');
      }
    } catch (err) {
      setError(`Network error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const createNote = async (e) => {
    e.preventDefault();
    const { content, author } = formData;
    
    if (!content?.trim() || !author?.trim()) {
      setError('Both content and author are required');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: content.trim(), author: author.trim() })
      });

      const data = await response.json();

      if (data.success) {
        setFormData({ content: '', author: '' });
        await fetchNotes(1);
        setCurrentPage(1);
      } else {
        setError(data.message || 'Failed to create note');
      }
    } catch (err) {
      setError(`Error creating note: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const likeNote = async (noteId) => {
    try {
      const response = await fetch(`${API_BASE}/notes/${noteId}/like`, {
        method: 'PATCH'
      });
      const data = await response.json();
      
      if (data.success) {
        setNotes(prevNotes => 
          prevNotes.map(note => 
            note._id === noteId 
              ? { ...note, likes: data.data.likes }
              : note
          )
        );
      }
    } catch (err) {
      setError(`Error liking note: ${err.message}`);
    }
  };

  const unlikeNote = async (noteId) => {
    try {
      const response = await fetch(`${API_BASE}/notes/${noteId}/unlike`, {
        method: 'PATCH'
      });
      const data = await response.json();
      
      if (data.success) {
        setNotes(prevNotes => 
          prevNotes.map(note => 
            note._id === noteId 
              ? { ...note, likes: data.data.likes }
              : note
          )
        );
      }
    } catch (err) {
      setError(`Error unliking note: ${err.message}`);
    }
  };

  const deleteNote = async (noteId) => {
    if (!window.confirm('Are you sure you want to delete this note?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/notes/${noteId}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      
      if (data.success) {
        setNotes(prevNotes => prevNotes.filter(note => note._id !== noteId));
      }
    } catch (err) {
      setError(`Error deleting note: ${err.message}`);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="app">
      <header className="header">
        <h1>🐤 Mini Twitter</h1>
        <p>Share your thoughts with the world!</p>
      </header>

      <div className="create-section">
        <h2>✍️ Create New Note</h2>
        <form onSubmit={createNote}>
          <div className="form-group">
            <input
              type="text"
              name="author"
              placeholder="Your name..."
              value={formData.author}
              onChange={handleInputChange}
              maxLength="50"
              disabled={submitting}
            />
          </div>
          <div className="form-group">
            <textarea
              name="content"
              placeholder="What's on your mind? (max 280 characters)"
              value={formData.content}
              onChange={handleInputChange}
              maxLength="280"
              rows="3"
              disabled={submitting}
            />
          </div>
          <button 
            type="submit"
            disabled={submitting || !formData.content.trim() || !formData.author.trim()}
          >
            {submitting ? '📝 Posting...' : '🚀 Post Note'}
          </button>
        </form>
      </div>

      {error && (
        <div className="error-message">
          ⚠️ {error}
          <button onClick={() => setError('')}>×</button>
        </div>
      )}

      <div className="notes-section">
        <h2>📋 All Notes</h2>
        {loading ? (
          <div className="loading">📡 Loading notes...</div>
        ) : notes.length === 0 ? (
          <div className="empty-state">
            🦗 No notes yet. Be the first to share something!
          </div>
        ) : (
          <>
            <div className="notes-grid">
              {notes.map(note => (
                <div key={note._id} className="note-card">
                  <div className="note-header">
                    <span className="author">👤 {note.author}</span>
                    <span className="date">🕒 {formatDate(note.createdAt)}</span>
                  </div>
                  
                  <div className="note-content">
                    {note.content}
                  </div>
                  
                  <div className="note-actions">
                    <div className="like-section">
                      <button 
                        className="action-button like-button"
                        onClick={() => likeNote(note._id)}
                      >
                        👍
                      </button>
                      <span className="like-count">{note.likes ?? 0}</span>
                      <button 
                        className="action-button unlike-button"
                        onClick={() => unlikeNote(note._id)}
                        disabled={note.likes === 0}
                      >
                        👎
                      </button>
                    </div>
                    
                    <button 
                      className="action-button delete-button"
                      onClick={() => deleteNote(note._id)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {pagination?.totalPages > 1 && (
              <div className="pagination">
                <button 
                  className="page-button"
                  onClick={() => fetchNotes(currentPage - 1)}
                  disabled={!pagination.hasPrevPage || loading}
                >
                  ⬅️ Previous
                </button>
                
                <span className="page-info">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                
                <button 
                  className="page-button"
                  onClick={() => fetchNotes(currentPage + 1)}
                  disabled={!pagination.hasNextPage || loading}
                >
                  Next ➡️
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;