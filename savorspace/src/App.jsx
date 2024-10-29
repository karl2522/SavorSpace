import { IoIosSearch } from 'react-icons/io';
import { LuUserCircle2 } from "react-icons/lu";
import { Link, Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import HomePage from './components/Homepage';
import LandingPage from './components/LandingPage';
import Login from './components/LoginScreen';
import Register from './components/SignupScreen';
import './components/styles.css';

const Navbar = () => {
  const location = useLocation();
  const showNavbar = !['/login', '/register'].includes(location.pathname);
  const isHomepage = location.pathname === '/homepage';

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
            <li><Link to="/homepage">Home</Link></li>
            <li><Link to="/recipes">Recipes</Link></li>
            <li><Link to="/community">Community</Link></li>
            <li><Link to="/aboutus">About Us</Link></li>
          </ul>
          {isHomepage ? (
            <div className="homepage-buttons">
                <IoIosSearch size={45} color="#D6589F"/>
                <LuUserCircle2 size={40} color="#D6589F"/>
            </div>
          ) : (
            <Link to="/register" className="signup-btn">Sign up</Link>
          )}
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
          <Route path="/" element={<LandingPage />} />
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
