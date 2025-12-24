import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

function Admin() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchVideos();
  }, [user, navigate]);

  const fetchVideos = async () => {
    try {
      const response = await api.get('/videos');
      setVideos(response.data);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleRestriction = async (videoId, currentStatus) => {
    try {
      await api.put(`/videos/${videoId}`, {
        is_restricted: !currentStatus,
      });
      fetchVideos();
    } catch (error) {
      console.error('Error updating video:', error);
    }
  };

  const deleteVideo = async (videoId) => {
    if (!confirm('Вы уверены, что хотите удалить это видео?')) {
      return;
    }
    try {
      await api.delete(`/videos/${videoId}`);
      fetchVideos();
    } catch (error) {
      console.error('Error deleting video:', error);
    }
  };

  if (loading) return <div style={styles.container}>Загрузка...</div>;

  return (
    <div style={styles.container}>
      <h1>Панель администратора</h1>
      <p>Всего видео: {videos.length}</p>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Название</th>
            <th style={styles.th}>Автор</th>
            <th style={styles.th}>Лайки</th>
            <th style={styles.th}>Дизлайки</th>
            <th style={styles.th}>Статус</th>
            <th style={styles.th}>Действия</th>
          </tr>
        </thead>
        <tbody>
          {videos.map((video) => (
            <tr key={video.id} style={styles.tr}>
              <td style={styles.td}>{video.id}</td>
              <td style={styles.td}>{video.title}</td>
              <td style={styles.td}>{video.user.name}</td>
              <td style={styles.td}>{video.likes_count}</td>
              <td style={styles.td}>{video.dislikes_count}</td>
              <td style={styles.td}>
                {video.is_restricted ? (
                  <span style={styles.restricted}>Ограничено</span>
                ) : (
                  <span style={styles.active}>Активно</span>
                )}
              </td>
              <td style={styles.td}>
                <button
                  onClick={() => toggleRestriction(video.id, video.is_restricted)}
                  style={styles.restrictButton}
                >
                  {video.is_restricted ? 'Разрешить' : 'Ограничить'}
                </button>
                <button
                  onClick={() => deleteVideo(video.id)}
                  style={styles.deleteButton}
                >
                  Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
  },
  table: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginTop: '2rem',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '1rem',
    textAlign: 'left',
    backgroundColor: '#f8f9fa',
    borderBottom: '2px solid #dee2e6',
  },
  tr: {
    borderBottom: '1px solid #dee2e6',
  },
  td: {
    padding: '1rem',
  },
  restricted: {
    color: '#e74c3c',
    fontWeight: 'bold',
  },
  active: {
    color: '#2ecc71',
    fontWeight: 'bold',
  },
  restrictButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#f39c12',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '0.5rem',
  },
  deleteButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default Admin;