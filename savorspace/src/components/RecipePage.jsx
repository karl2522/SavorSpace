import PropTypes from 'prop-types';
import { HiArrowSmRight } from "react-icons/hi";
import '../styles/MainStyles.css';


// RecipeCard component
const RecipeCard = ({ image, title, description, onClick }) => {
  return (
    <div className="recipe-card" onClick={onClick}>
      <div className="recipe-image-container">
        <img src={image} alt={title} className="recipe-image" />
      </div>
      <div className="recipe-content">
        <div className="recipe-meta">
          <span className="recipe-cuisine">
            <img src="/src/images/dish.png" alt="Cuisine Icon" />
            Filipino Dish
          </span>
          <span className="recipe-course">
            <img src="/src/images/course.png" alt="Course Icon" />
            Main Course
          </span>
        </div>
        <h3 className="recipe-title">{title}</h3>
        <p className="recipe-description">{description}</p>
        <button className="recipe-button" aria-label="View Recipe">
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
  onClick: PropTypes.func.isRequired,
};

const HomePage = () => {

};

export default HomePage;
