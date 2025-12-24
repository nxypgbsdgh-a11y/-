import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import VideoDetail from './pages/VideoDetail';
import Upload from './pages/Upload';
import Admin from './pages/Admin';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div style={styles.app}>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/video/:id" element={<VideoDetail />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

const styles = {
  app: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
  },
};

export default App;