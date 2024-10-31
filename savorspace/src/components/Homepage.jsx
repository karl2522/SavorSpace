import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { HiArrowSmRight } from "react-icons/hi";
import './styles.css';

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
  const recipes = [
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
      description: "Pancit is a beloved Filipino noodle dish that comes in many regional varieties, often made with rice noodles, vegetables, and a choice of proteins like chicken, pork, or shrimp. ",
    },
    // Add more recipes as needed
  ];

  const [currentRecipeIndex, setCurrentRecipeIndex] = useState(0);
  const [profilePic, setProfilePic] = useState(null);

  useEffect(() => {
    const fetchProfilePic = async () => {
      try {
        const token = localStorage.getItem('authToken'); // Retrieve the token from local storage or any other storage
        const response = await fetch('http://localhost:8080/users/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setProfilePic(`http://localhost:8080${data.imageURL}`); // Use the imageURL directly
      } catch (error) {
        console.error('Error fetching profile picture:', error);
      }
    };

    fetchProfilePic();

    const interval = setInterval(() => {
      setCurrentRecipeIndex((prevIndex) => (prevIndex + 1) % recipes.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleCardClick = () => {
    setCurrentRecipeIndex((prevIndex) => (prevIndex + 1) % recipes.length);
  };

  return (
    <div className="homepage">
      <section className="hero">
        <div className="hero-text">
          <h2><span>Savor</span> the flavors, <br /> Share the <span>love</span></h2>
          <p>Join our vibrant community of food lovers where you can share recipes, savor delicious flavors, and celebrate the joy of cooking together. Let&apos;s create tasty memories!</p>
          <button className="get-started-btn" aria-label="Explore Recipes">Explore Recipes</button>
        </div>

        <div className="recipe-card-container">
          <RecipeCard
            image={recipes[currentRecipeIndex].image}
            title={recipes[currentRecipeIndex].title}
            description={recipes[currentRecipeIndex].description}
            onClick={handleCardClick}
          />
          <h1>This is the profile</h1>
          {profilePic ? (
            <div className="profile-pic-container">
              <img src={profilePic} alt="Profile" className="profile-pic" />
            </div>
          ) : (
            <p>Profile huhuhu</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;