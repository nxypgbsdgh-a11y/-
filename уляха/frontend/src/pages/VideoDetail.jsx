import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

function VideoDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [video, setVideo] = useState(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideo();
  }, [id]);

  const fetchVideo = async () => {
    try {
      const response = await api.get(`/videos/${id}`);
      setVideo(response.data);
    } catch (error) {
      console.error('Error fetching video:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (type) => {
    if (!user) {
      alert('Войдите, чтобы поставить лайк');
      return;
    }
    try {
      await api.post(`/videos/${id}/like`, { type });
      fetchVideo();
    } catch (error) {
      console.error('Error liking video:', error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Войдите, чтобы комментировать');
      return;
    }
    try {
      await api.post(`/videos/${id}/comments`, { content: comment });
      setComment('');
      fetchVideo();
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await api.delete(`/comments/${commentId}`);
      fetchVideo();
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  if (loading) return <div style={styles.container}>Загрузка...</div>;
  if (!video) return <div style={styles.container}>Видео не найдено</div>;

  return (
    <div style={styles.container}>
      <div style={styles.videoContainer}>
        <video
          src={`http://localhost:8000/storage/${video.video_path}`}
          controls
          style={styles.video}
        />
      </div>

      <div style={styles.info}>
        <h1>{video.title}</h1>
        <p style={styles.author}>Автор: {video.user.name}</p>
        {video.description && <p>{video.description}</p>}

        <div style={styles.actions}>
          <button onClick={() => handleLike('like')} style={styles.likeButton}>
            👍 {video.likes_count}
          </button>
          <button onClick={() => handleLike('dislike')} style={styles.likeButton}>
            👎 {video.dislikes_count}
          </button>
        </div>
      </div>

      <div style={styles.commentsSection}>
        <h2>Комментарии ({video.comments?.length || 0})</h2>

        {user && (
          <form onSubmit={handleComment} style={styles.commentForm}>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Добавить комментарий..."
              style={styles.textarea}
              required
            />
            <button type="submit" style={styles.submitButton}>
              Отправить
            </button>
          </form>
        )}

        <div style={styles.commentsList}>
          {video.comments?.map((c) => (
            <div key={c.id} style={styles.comment}>
              <div style={styles.commentHeader}>
                <strong>{c.user.name}</strong>
                <span style={styles.commentDate}>
                  {new Date(c.created_at).toLocaleDateString('ru-RU')}
                </span>
              </div>
              <p style={styles.commentContent}>{c.content}</p>
              {(user?.id === c.user_id || user?.role === 'admin') && (
                <button
                  onClick={() => handleDeleteComment(c.id)}
                  style={styles.deleteButton}
                >
                  Удалить
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
  },
  videoContainer: {
    width: '100%',
    backgroundColor: '#000',
    borderRadius: '8px',
    overflow: 'hidden',
    marginBottom: '1rem',
  },
  video: {
    width: '100%',
    maxHeight: '600px',
  },
  info: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    marginBottom: '1rem',
  },
  author: {
    color: '#666',
    marginBottom: '1rem',
  },
  actions: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1rem',
  },
  likeButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#f0f0f0',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  commentsSection: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
  },
  commentForm: {
    marginBottom: '2rem',
  },
  textarea: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    minHeight: '100px',
    marginBottom: '0.5rem',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
  submitButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  commentsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  comment: {
    padding: '1rem',
    backgroundColor: '#f9f9f9',
    borderRadius: '4px',
  },
  commentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.5rem',
  },
  commentDate: {
    color: '#999',
    fontSize: '0.9rem',
  },
  commentContent: {
    margin: '0.5rem 0',
  },
  deleteButton: {
    padding: '0.25rem 0.75rem',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
};

export default VideoDetail;