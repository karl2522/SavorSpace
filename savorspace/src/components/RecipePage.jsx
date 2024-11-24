import { useCallback, useEffect, useState } from 'react';
import { IoIosSearch } from 'react-icons/io';
import { MdAccessTime, MdClose } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import '../styles/RecipePageStyles.css';


export default function RecipePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [trendingItems, setTrendingItems] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [activeSearch, setActiveSearch] = useState('');
  const navigate = useNavigate();


  const handleRecipeClick = (recipeId) => {
    navigate(`/community/recipe/${recipeId}`);
  }


  const resetSearch = () => {
    setActiveSearch('');
    setFilteredRecipes(recipes);
    setSearchQuery('');
  };

  

  const formatImageURL = (imageURL) => {
    if(!imageURL) return '';
    return imageURL.startsWith('http')
      ? imageURL
      : `http://localhost:8080${imageURL}`;
  };

  const handleSearch = async (e) => {
    if(e.key === 'Enter') {
      const query = searchQuery.trim();
      if(query) {

        const filtered = recipes.filter(recipe => 
          recipe.title.toLowerCase().includes(query.toLowerCase()) ||
          recipe.description.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredRecipes(filtered);
        setActiveSearch(query);

        toggleSearch();
      }
    }
  };


  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if(query.trim() === '') {

      setFilteredRecipes(recipes);
      setActiveSearch('');
    }else {

      const filtered = recipes.filter(recipe => 
        recipe.title.toLowerCase().includes(query.toLowerCase()) ||
        recipe.description.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredRecipes(filtered);
      setActiveSearch(query);
    }
  };


  const highlightText = (text, highlight) => {
    if(!highlight.trim()) {
      return text;
    }

    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} style={{ backgroundColor: '#ffeb3b' }}>{part}</span>
      ) : (
        part
      )
    );
  };

  const fetchRecipes = useCallback(async () => {
    try {
      const token = localStorage.getItem('authToken');
      if(!token) {
        throw new Error('User is not authenticated');
      }

      const response = await fetch(`http://localhost:8080/recipes?page=${page}&size=${size}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if(!response.ok) {
        const errorData = await response.text();
        console.error('Error:', errorData);
        throw new Error(`Failed to fetch recipes: ${response.status}`);
      }

      const data = await response.json();
      setRecipes(data);

      setTrendingItems(data.slice(0, 3));
    }catch(error) {
      console.error('Error:', error);
      setError(error.message);
    }finally {
      setLoading(false);
    }
  }, [page, size]);

  useEffect(() => {
    fetchRecipes().then(() => {
      setFilteredRecipes(recipes);
    });
  }, [fetchRecipes]);


  // Auto-rotate trending items
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % trendingItems.length);
    }, 5000); 
    return () => clearInterval(timer);
  }, [trendingItems]);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleSearch = () => {
    setIsSearchOpen((prev) => {
      if (prev) {
        setSearchQuery('');
      }
      return !prev; 
    });
  };
  
  

  if(loading) {
    return <div>Loading...</div>;
  }

  if(error) {
    return <div>Error: {error}</div>;
  }

  const currentItem = trendingItems[currentIndex];

  return (
    <div className="trending-container">
      {}
      {trendingItems.length > 0 && currentItem && (
        <>
          <h2 className="trending-title">Trending <span>Now</span></h2>
          <div className="trending-content">
            <div className="trending-image">
              <img 
                  src={formatImageURL(currentItem.imageURL)}
                  alt={currentItem.title}
                  onError={(e) => {
                    e.target.src = '/src/images/defaultProfiles.png';
                  }}
              />
            </div>
            <div className="trending-details">
              <div className="trending-categories">
                <span>Recipe</span>
              </div>
              <h3 className="trending-item-title">{currentItem.title}</h3>
              <p className="trending-description">{currentItem.description}</p>
              <div className="trending-author">
                  {currentItem.user && (
                    <>
                     <img
                        src={formatImageURL(currentItem.user.imageURL)}
                        alt={currentItem.user.fullName}
                        onError={(e) => {
                          e.target.src = '/src/images/defaultProfiles.png';
                        }}
                      />
                      <span>By: {currentItem.user.fullName || 'Anonymous'}</span>
                    </>
                  )}
                <div className="trending-info">
                  <MdAccessTime size={20}/>
                  <span>{currentItem.createdAt}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="trending-pagination">
            {trendingItems.map((_, index) => (
              <span 
                key={index} 
                className={`pagination-dot ${index === currentIndex ? 'active' : ''}`}
              ></span>
            ))}
          </div>
        </>
      )}

      {/* More Recipes Section */}
      <div className="user-recipe-container">
        <div className="user-recipe-header">
          <h2>More Recipes</h2>
          {activeSearch ? (
              <MdClose 
                size={40}
                color="#D6589F"
                cursor="pointer"
                className="search-button"
                onClick={resetSearch}
              />
            ) : (
              <IoIosSearch
                size={40}
                color="#D6589F"
                cursor="pointer"
                className="search-button"
                onClick={toggleSearch}
              />
            )}
          {/* Search Overlay */}
          <div className={`search-overlay ${isSearchOpen ? 'active' : ''}`}>
            <div className="search-container">
              <input
                type="text"
                className="search-input"
                placeholder="Search recipes here..."
                value={searchQuery}
                onChange={handleSearchInputChange}
                onKeyPress={handleSearch}
                autoFocus
              />
            </div>
          </div>
        </div>
        <div className="user-recipe">
          {(activeSearch ? filteredRecipes : recipes).map((recipe) => (
            <div key={recipe.recipeID} className="user-recipe-card">
              <div className="user-recipe-image">
                  <img 
                    src={formatImageURL(recipe.imageURL)}
                    alt={recipe.title}
                    onClick={() => handleRecipeClick(recipe.recipeID)}
                    style={{ cursor: 'pointer' }}
                    onError={(e) => {
                      e.target.src = '/src/images/defaultProfiles.png';
                    }}
                  />
              </div>
              <div className="user-recipe-details">
                <h3>{highlightText(recipe.title, activeSearch)}</h3>
                <p>{highlightText(recipe.description, activeSearch)}</p>
                <span>By: {recipe.user ? recipe.user.fullName: 'Anonymous'}</span>
              </div>
            </div>
          ))}
          {activeSearch && filteredRecipes.length === 0 && (
            <div className="no-results">
              No recipes found matching &quot;{activeSearch}&quot;
            </div>
          )}
        </div>
      </div>
    </div>
  );
}