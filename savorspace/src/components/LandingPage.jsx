import PropTypes from 'prop-types';
import { HiArrowSmRight } from "react-icons/hi";
import './styles.css';

const RecipeCard = ({ image, title, description }) => {
  return (
    <div className="recipe-card">
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

RecipeCard.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

const LandingPage = () => {
  return (
    <div className="LandingPage">
      <section className="hero">
        <div className="hero-text">
          <h2><span>Savor</span> the flavors, <br /> Share the <span>love</span></h2>
          <p>Join our vibrant community of food lovers where you can share recipes, savor delicious flavors, and celebrate the joy of cooking together. Let&apos;s create tasty memories!</p>
          <button className="get-started-btn">Get Started</button>
        </div>
        
        <div className="recipe-card-container">
          <RecipeCard
            image="src/images/adobo-hero.png"
            title="Chicken Adobo"
            description="Adobo is a Filipino dish of marinated meat, usually chicken or pork, cooked in vinegar and soy sauce. It's known for its savory and tangy flavor and is often served with rice."
          />
        </div>
      </section>
    </div>
  );
};

export default LandingPage;