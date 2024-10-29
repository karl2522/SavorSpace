import { Link, Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Login from './components/LoginScreen';
import Register from './components/SignupScreen';
import './components/styles.css';

const Navbar = () => {
  const location = useLocation(); 
  const showNavbar = !['/login', '/register'].includes(location.pathname);


  return (
    <>
      {showNavbar && (
        <nav className="navbar">
          <Link to="/" className="logo">
            <img src="/src/images/savorspaceLogo.png" alt="SavorSpace Logo" className="logo" />
          </Link>
          <h1>
            Savor<span className='highlight'>Space</span>
          </h1>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/Recipes">Recipes</Link></li>
            <li><Link to="/Community">Community</Link></li>
            <li><Link to="/AboutUs">About Us</Link></li>
          </ul>
          <Link to="/register" className="signup-btn">Sign up</Link>
        </nav>
      )}
    </>
  );
};

const App = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/landingpage" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
