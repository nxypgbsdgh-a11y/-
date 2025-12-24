import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <Link to="/" style={styles.logo}>
          VideoHosting
        </Link>
        <div style={styles.links}>
          <Link to="/" style={styles.link}>
            Видео
          </Link>
          {user ? (
            <>
              <Link to="/upload" style={styles.link}>
                Загрузить
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" style={styles.link}>
                  Админ
                </Link>
              )}
              <span style={styles.user}>{user.name}</span>
              <button onClick={handleLogout} style={styles.button}>
                Выход
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.link}>
                Вход
              </Link>
              <Link to="/register" style={styles.link}>
                Регистрация
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    backgroundColor: '#333',
    padding: '1rem 0',
    marginBottom: '2rem',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 1rem',
  },
  logo: {
    color: 'white',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    textDecoration: 'none',
  },
  links: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    padding: '0.5rem 1rem',
  },
  user: {
    color: '#aaa',
  },
  button: {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default Navbar;