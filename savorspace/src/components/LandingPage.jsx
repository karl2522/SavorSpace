import axios from 'axios';
import { Bookmark, Heart } from 'lucide-react';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { FaRegShareFromSquare } from "react-icons/fa6";
import { HiArrowSmRight } from "react-icons/hi";
import { Link } from 'react-router-dom';
import '../styles/LandingPageStyles.css';

import { useScrollAnimation } from './useScrollAnimation';

const RecipeCard = ({ image, title, description, onClick }) => {
  const cardRef = useScrollAnimation();

  return (
    <div className="recipe-cards hidden" ref={cardRef} onClick={onClick}>
      <div className="recipe-image-container">
        <img src={image} alt={title} className="recipe-image" />
      </div>
      <div className="recipe-content">
        <div className="recipe-meta">
          <span className="recipe-cuisine">
            <img src="src/images/dish.png" alt="Cuisine" />
            Filipino Dish
          </span>
          <span className="recipe-course">
            <img src="src/images/course.png" alt="Course" />
            Main Course
          </span>
        </div>
        <h3 className="recipe-title">{title}</h3>
        <p className="recipe-description">{description}</p>
        <button className="recipe-button">
          <HiArrowSmRight size={25} />
        </button>
      </div>
    </div>
  );
};

const CommunityCard = ({ image, title, description, likes, saves, category}) => {
  return (
    <div className="community-card">
      <div className="card-image">
        <img src={image} alt={title} />
        <span className={`category-badge ${category.toLowerCase()}`}>{category}</span>
      </div>
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <div className="card-stats">
          <div className="stat-group likes">
            <button className="stat-button">
              <Heart size={20} />
              <span>{likes}</span>
            </button>
            <div className="hover-content">
              <p>{description}</p>
            </div>
          </div>
          <div className="stat-group">
            <button className="stat-button">
              <Bookmark size={20} />
              <span>{saves}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ChefCard = ({ image, name, title, shares }) => {
  return (
    <div className="chef-card">
      <div className="chef-image">
        <img src={image} alt={title} />
      </div>
      <div className="chef-content">
        <h3 className="chef-name">{name}</h3>
        <div className="chef-info">
          <div className="chef-title">{title}</div>
          <div className="shares-container">
          <div className="chef-shares">{shares}</div>
            <FaRegShareFromSquare />
          </div>
        </div>
        </div>
    </div>
  );
};

// initial
const TeamCard = ({ image, name, title }) => {
  return (
    <div className="team-card">
      <div className="team-image-wrapper">
        <div className="team-image-container">
          <img src={image} alt={name} className="team-image" />
        </div>
      </div>
      <div className="team-content">
        <h3 className="team-name">{name}</h3>
        <div className="team-title">{title}</div>
      </div>
    </div>
  );
}

TeamCard.propTypes = {
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
}

ChefCard.propTypes = {
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  shares: PropTypes.string.isRequired,
};


CommunityCard.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  likes: PropTypes.string.isRequired,
  saves: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
};

RecipeCard.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

const LandingPage = () => {
  const recipeCards = [
    {
      image: "/src/images/adobo-hero.png",
      title: "Chicken Adobo",
      description: "Adobo is a Filipino dish of marinated meat, usually chicken or pork, cooked in vinegar and soy sauce. It's known for its savory and tangy flavor and is often served with rice.",
    },

    {
      image: "src/images/sinigang-hero.png",
      title: "Sinigang na Baboy",
      description: "Sinigang is a traditional Filipino sour soup made from tamarind, tomatoes, and various vegetables such as eggplant, radish, and spinach. Typically made with pork, shrimp, or beef.",
    },

    {
      image: "/src/images/pancit-hero.png",
      title: "Pancit Canton",
      description: "Pancit is a beloved Filipino noodle dish that comes in many regional varieties, often made with rice noodles, vegetables, and a choice of proteins like chicken, pork, or shrimp.",
    }
  ];

  const communityCards = [
    {
      image: "/src/images/graham-card.jpg",
      title: "Mango Graham",
      description: "A delightful Filipino dessert made with layers of graham crackers, whipped cream, mangoes, and condensed milk. Perfect for any occasion!",
      likes: "2.4k",
      saves: "103",
      category: "Dessert",
    },

    {
      image: "/src/images/bicolexpress-card.avif",
      title: "Bicol Express",
      description: "A spicy Filipino dish made with pork, coconut milk, shrimp paste, and chili peppers. A popular dish from the Bicol region.",
      likes: "1.8k",
      saves: "87",
      category: "Main Course"
    },

    {
      image: "/src/images/crispypata-card.jpg",
      title: "Crispy Pata",
      description: "A Filipino dish of deep fried pork leg, making the skin crispy while keeping the meat tender inside. Served with a soy-vinegar dipping sauce.",
      likes: "3.2k",
      saves: "156",
      category: "Main Course"
    },

    {
      image: "/src/images/sisig-card.jpg",
      title: "Sisig",
      description: "A sizzling Filipino dish made with chopped pig's face and ears, seasoned with calamansi and chili peppers. A perfect pulutan!",
      likes: "4.1k",
      saves: "203",
      category: "Main Course"
    },

    {
      image: "/src/images/maja-card.jpg",
      title: "Maja Blanca",
      description: "The Philippines' most celebrated dish - a whole roasted pig with perfectly crispy skin and tender meat inside. A staple at Filipino festivities.",
      likes: "5.6k",
      saves: "312",
      category: "Dessert"
    }
  ];

  const chefCard = [
      {
        image: "/src/images/chef1.png",
        name: "Lily Anderson",
        title: "October's Top Sharer",
        shares: "365 Recipes Shared",
      },

      {
        image: "/src/images/chef2.png",
        name: "Emma Nguyen",
        title: "November's Top Sharer",
        shares: "234 Recipes Shared",
      },

      {
        image: "/src/images/chef3.png",
        name: "Lucas Martinez",
        title: "December's Top Sharer",
        shares: "300 Recipes Shared",
      }
  ];


  const teamCard = [
    {
      image: "/src/images/omen.png",
      name: "Jared Karl Omen",
      title: "Full-Stack Developer",
    },

    {
      image: "/src/images/capuras.png",
      name: "Vaness Leonard Capuras",
      title: "Full-Stack Developer",
      link: "https://penguinmanportfolio.netlify.app/",
    },

    {
      image: "/src/images/chavez.png",
      name: "Jes Emanuel Chavez",
      title: "Full-Stack Developer",
    },
    
    {
      image: "/src/images/gadiane.png",
      name: "John Karl Gadiane",
      title: "Full-Stack Developer",
    },

    {
      image: "/src/images/pejana.png",
      name: "Mary Therese Pejana",
      title: "Full-Stack Developer",
    }
];



  const [currentRecipeIndex, setCurrentRecipeIndex] = useState(0);

  const heroRef = useScrollAnimation();
  const recipesRef = useScrollAnimation();
  const chefsRef = useScrollAnimation();
  const teamRef = useScrollAnimation();
  const questionsRef = useScrollAnimation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRecipeIndex((prevIndex) => (prevIndex + 1) % recipeCards.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [recipeCards.length]);

  const handleCardClick = () => {
    setCurrentRecipeIndex((prevIndex) => (prevIndex + 1) % recipeCards.length);
  };

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    concern: "",
  });
  
  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  try {
    await axios.post('http://localhost:8080/auth/email', formData);
    setShowToast({
      show: true,
      type: "success",
      message: "Email sent successfully! Our chef is cooking up a response!"
    });
    setFormData({ firstName: "", lastName: "", email: "", concern: "" });
    setTimeout(() => {
      setIsSubmitting(false);
      setShowToast({ show: false, message: "", type: "" });
    }, 3000);
  } catch (error) {
    setShowToast({
      show: true,
      type: "error",
      message: "Oops! Something went wrong sending your email."
    });
    setTimeout(() => {
      setIsSubmitting(false);
      setShowToast({ show: false, message: "", type: "" });
    }, 3000);
  }
};
  

return (
    <div className="LandingPage">
      
  {isSubmitting && (
    <div className="email-loading-overlay">
      <div className="email-loading-container">
        <div className="chef-loader">
          <div className="chef-hat"></div>
          <div className="envelope">
            <div className="envelope-flap"></div>
          </div>
        </div>
        <p>Chef is preparing your message...</p>
      </div>
    </div>
  )}

{showToast.show && (
    <div className={`toast-notification ${showToast.type}`}>
      <div className="toast-content">
        <span className="toast-icon">
          {showToast.type === 'success' ? '👨‍🍳' : '😕'}
        </span>
        <p>{showToast.message}</p>
      </div>
    </div>
  )}
      <section className="hero hidden" ref={heroRef}>
        <div className="hero-text">
          <h2><span>Savor</span> the flavors, <br /> Share the <span>love</span></h2>
          <p>Join our vibrant community of food lovers where you can share recipes, savor delicious flavors, and celebrate the joy of cooking together. Let&apos;s create tasty memories!</p>
          <Link to="/recipes">
          <button className="explore-recipes-btn">Explore Recipes</button>
          </Link>
          <Link to="/register">
          <button className="get-started-btn">Get Started</button>
          </Link>
        </div>
        
        <div className="recipe-card-container">
          <RecipeCard
            image={recipeCards[currentRecipeIndex].image}
            title={recipeCards[currentRecipeIndex].title}
            description={recipeCards[currentRecipeIndex].description}
            onClick={handleCardClick}
          />
        </div>
      </section>

      <section className="more-recipes hidden" ref={recipesRef}>
        <h2><span>Community </span>Favorites</h2>
        <div className="community-cards-container">
          {communityCards.map((card, index) => (
            <CommunityCard
              key={index}
              image={card.image}
              title={card.title}
              description={card.description}
              likes={card.likes}
              saves={card.saves}
              category={card.category}
            />
          ))}
        </div>
      </section>
          
      <section className="chef-container hidden" ref={chefsRef}>
        <h2>SavorSpace <span>All-Chefs</span></h2>
        <div className="chef-cards-container">
          {chefCard.map((card, index) => (
            <ChefCard
              key={index}
              image={card.image}
              name={card.name}
              title={card.title}
              shares={card.shares}
            />
          ))}
        </div>
      </section>

      <section className="team-container hidden" ref={teamRef}>
        <h2>Our <span>Team</span></h2>
        <div className="team-cards-container">
          {teamCard.map((card, index) => (
            <TeamCard
              key={index}
              image={card.image}
              name={card.name}
              title={card.title}
            />
          ))}
        </div>
      </section>

      <section className="questions-section hidden" ref={questionsRef}>
        <div className="questions-container">
          <h2 className="questions-title">
            <span>Got </span>questions?<br />
            Let&apos;s <span>Connect!</span>
          </h2>
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-row">
              <input
                type="text"
                placeholder="First name"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="form-input"
              />
              <input
                type="text"
                placeholder="Last name"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="form-input"
              />
            </div>
            <input
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="form-input"
            />
            <input
              type="text"
              placeholder="What's your concern?"
              value={formData.concern}
              onChange={(e) => setFormData({ ...formData, concern: e.target.value })}
              className="form-input"
            />
            <button type="submit" className="submit-btn">
              Submit
            </button>
          </form>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <img src="/src/images/savorspaceLogo.png" alt="SavorSpace Logo" className="footer-logo-img" />
            <h2>Savor<span>Space</span></h2>
          </div>
          
          <div className="footer-links">
            <div className="footer-section">
              <h3>About Us</h3>
              <ul>
                <li><a href="#">Mission</a></li>
                <li><a href="#">Team</a></li>
                <li><a href="#">Partners</a></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h3>Support</h3>
              <ul>
                <li><a href="#">Contact</a></li>
                <li><a>FAQs</a></li>
                <li><a>User Guide</a></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h3>Features</h3>
              <ul>
                <li><a>Analytics</a></li>
                <li><a>Engagement Tools</a></li>
                <li><a>Community Building</a></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h3>Social</h3>
              <ul>
                <li><a href="https://github.com/karl2522/SavorSpace-Frontend">Github</a></li>
                <li><a href="">Facebook</a></li>
                <li><a href="https://www.linkedin.com/login">LinkedIn</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© 2024 SavorSpace. All Rights Reserved</p>
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="back-to-top">
            Back to top
          </button>
        </div>
      </footer>


    </div>

    
  );
};


export default LandingPage;