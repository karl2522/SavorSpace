import { IoIosSearch } from 'react-icons/io';
import { LuUserCircle2 } from "react-icons/lu";
import { Link, Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import HomePage from './components/Homepage';
import LandingPage from './components/LandingPage';
import Login from './components/LoginScreen';
import RecipePage from './components/RecipePage';
import Register from './components/SignupScreen';
import './styles/MainStyles.css';

const Navbar = () => {
  const location = useLocation();
  const showNavbar = !['/login', '/register'].includes(location.pathname);
  const isMainPage = 
  location.pathname === '/homepage' || 
  location.pathname === '/recipes' || 
  location.pathname === '/community' || 
  location.pathname === '/aboutus';

  const activeLinkStyle = { color: '#D6589F', fontWeight: 'bold' };

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
            <li className={location.pathname === '/homepage' ? 'active' : ''}>
              <Link to="/homepage" style={location.pathname === '/homepage' ? activeLinkStyle : {}}>Home</Link>
            </li>
            <li className={location.pathname === '/recipes' ? 'active' : ''}>
              <Link to="/recipes" style={location.pathname === '/recipes' ? activeLinkStyle : {}}>Recipes</Link>
            </li>
            <li className={location.pathname === '/community' ? 'active' : ''}>
              <Link to="/community" style={location.pathname === '/community' ? activeLinkStyle : {}}>Community</Link>
            </li>
            <li className={location.pathname === '/aboutus' ? 'active' : ''}>
              <Link to="/aboutus" style={location.pathname === '/aboutus' ? activeLinkStyle : {}}>About Us</Link>
            </li>
          </ul>
          {isMainPage ? (
            <div className="mainpage-buttons">
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
          <Route path="/recipes" element={<RecipePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
