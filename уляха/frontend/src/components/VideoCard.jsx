import { Link } from 'react-router-dom';

function VideoCard({ video }) {
  return (
    <Link to={`/video/${video.id}`} style={styles.card}>
      <div style={styles.thumbnail}>
        <video
          src={`http://localhost:8000/storage/${video.video_path}`}
          style={styles.video}
        />
      </div>
      <div style={styles.info}>
        <h3 style={styles.title}>{video.title}</h3>
        <p style={styles.author}>{video.user.name}</p>
        <div style={styles.stats}>
          <span>👍 {video.likes_count}</span>
          <span>👎 {video.dislikes_count}</span>
        </div>
      </div>
    </Link>
  );
}

const styles = {
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    textDecoration: 'none',
    color: 'inherit',
    transition: 'transform 0.2s',
    cursor: 'pointer',
  },
  thumbnail: {
    width: '100%',
    height: '200px',
    backgroundColor: '#000',
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  info: {
    padding: '1rem',
  },
  title: {
    margin: '0 0 0.5rem 0',
    fontSize: '1rem',
    fontWeight: 'bold',
  },
  author: {
    margin: '0 0 0.5rem 0',
    color: '#666',
    fontSize: '0.9rem',
  },
  stats: {
    display: 'flex',
    gap: '1rem',
    fontSize: '0.9rem',
  },
};

export default VideoCard;