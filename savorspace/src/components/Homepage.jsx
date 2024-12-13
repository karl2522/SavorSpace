import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/MainStyles.css';
import { FaUtensils, FaClock, FaHeart, FaShare, FaArrowRight } from 'react-icons/fa';

const CategorySection = () => {
  // Define categories for the Browse by Category section
  const categories = [
    { name: 'Breakfast', icon: '🍳' },
    { name: 'Lunch', icon: '🍜' },
    { name: 'Dinner', icon: '🍽️' },
    { name: 'Desserts', icon: '🍰' }
  ];

  return (
    <div className="categories-section">
      <h2>Browse by Category</h2>
      <div className="categories-grid">
        {categories.map((category, index) => (
          <div key={index} className="category-card">
            <span className="category-icon">{category.icon}</span>
            <h3>{category.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

// RecipeCard component to display individual recipes
const RecipeCard = ({ image, title, description, cookTime, difficulty, onClick, likes, shares }) => {
  return (
    <div className="recipe-card" onClick={onClick}>
      <div className="recipe-image-container">
        <img src={image} alt={title} className="recipe-image" />
        <div className="recipe-overlay">
          <FaArrowRight className="recipe-arrow" />
        </div>
      </div>
      <div className="recipe-content">
        <h3 className="recipe-title">{title}</h3>
        <p className="recipe-description">{description}</p>
        <div className="recipe-meta">
          <span><FaUtensils /> {difficulty}</span>
          <span><FaClock /> {cookTime}</span>
        </div>
        <div className="recipe-engagement">
          {/* Display likes and shares */}
          <span className="likes">
            <FaHeart /> {likes}
          </span>
          <span className="shares">
            <FaShare /> {shares}
          </span>
        </div>
      </div>
    </div>
  );
};

const CommentSection = () => {
  // State for managing the comment input
  const [comment, setComment] = useState('');
  // State for storing all comments
  const [comments, setComments] = useState([]);
  // State for showing/hiding the GIF picker
  const [showGifPicker, setShowGifPicker] = useState(false);
  // State for storing GIF search results
  const [gifs, setGifs] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      setComments([...comments, {
        type: 'text', // Add type to distinguish between text and gif comments
        content: comment,
        date: new Date()
      }]);
      setComment(''); // Clear the comment input after submission
    }
  };

  const searchGifs = async (query) => {
    const GIPHY_API_KEY = 'your_giphy_api_key'; // Replace with a valid Giphy API key
    const response = await fetch(
      `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${query}&limit=10`
    );
    const data = await response.json();
    setGifs(data.data);
  };

  const addGifToComment = (gifUrl) => {
    setComments([...comments, { type: 'gif', content: gifUrl, date: new Date() }]);
    setShowGifPicker(false);
  };

  return (
    <div className="comment-section">
      <form onSubmit={handleSubmit}>
        <div className="comment-input-container">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts..."
          />
          <button
            type="button"
            className="gif-button"
            onClick={() => setShowGifPicker(!showGifPicker)}
          >
            GIF
          </button>
        </div>
        <button type="submit">Post Comment</button>
      </form>

      {showGifPicker && (
        <div className="gif-picker">
          <input
            type="text"
            placeholder="Search GIFs..."
            onChange={(e) => searchGifs(e.target.value)}
          />
          <div className="gif-grid">
            {gifs.map((gif) => (
              <img
                key={gif.id}
                src={gif.images.fixed_height_small.url}
                onClick={() => addGifToComment(gif.images.fixed_height.url)}
                alt="gif"
              />
            ))}
          </div>
        </div>
      )}

      <div className="comments-list">
        {comments.map((c, index) => (
          <div key={index} className="comment">
            {c.type === 'gif' ? (
              <img src={c.content} alt="comment-gif" className="comment-gif" />
            ) : (
              <p>{c.content}</p>
            )}
            <small>{c.date.toLocaleString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
};

const HomePage = () => {
  // Define an array of recipes
  const recipes = [
    {
      image: "/src/images/adobo-hero.png",
      title: "Chicken Adobo",
      description: "A savory Filipino dish with tender chicken in a tangy soy-vinegar sauce.",
      cookTime: "45 mins",
      difficulty: "Medium"
    },
    {
      image: "/src/images/sinigang-hero.png",
      title: "Sinigang na Baboy",
      description: "A sour tamarind-based soup with pork and vegetables, perfect for rainy days.",
      cookTime: "1 hour",
      difficulty: "Easy"
    },
    {
      image: "/src/images/pancit-hero.png",
      title: "Pancit Canton",
      description: "Stir-fried noodles with vegetables and meat, a staple in Filipino celebrations.",
      cookTime: "30 mins",
      difficulty: "Easy"
    },
  ];

  const [currentRecipeIndex, setCurrentRecipeIndex] = useState(0); // Manage currently featured recipe index
  const [showComments, setShowComments] = useState(false); // Toggle comment section visibility

  useEffect(() => {
    // Automatically cycle through featured recipes every 5 seconds
    const interval = setInterval(() => {
      setCurrentRecipeIndex((prevIndex) => (prevIndex + 1) % recipes.length);
    }, 5000);

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, [recipes.length]);

  const handleCardClick = () => {
    setShowComments(!showComments); // Toggle the comment section
  };

  return (
    <div className="homepage">
      <section className="hero">
        <div className="hero-content">
          {/* Hero section title and description */}
          <h1 className="hero-title">
            <span className="highlight">Savor</span> the flavors,<br />
            Share the <span className="highlight">love</span>
          </h1>
          <p className="hero-description">
            Join our vibrant community of food lovers. Share recipes, savor delicious flavors, and celebrate the joy of cooking together.
          </p>
          <Link to="/recipes" className="cta-button">
            Explore Recipes
          </Link>
        </div>

        <div className="featured-recipe">
          {/* Display the currently featured recipe */}
          <RecipeCard
            {...recipes[currentRecipeIndex]}
            onClick={handleCardClick}
          />
        </div>
      </section>

      <CategorySection />

      {showComments && (
        <section className="comments-section">
          {/* Render the comment section if toggled on */}
          <CommentSection />
        </section>
      )}
    </div>
  );
};

export default HomePage;
