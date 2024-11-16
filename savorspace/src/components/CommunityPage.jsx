import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import '../styles/PostingPage.css';

const PostingPage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState(null);

  const fetchRecipes = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://localhost:8080/recipes', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Failed to fetch recipes:', errorData);
        throw new Error(`Failed to fetch recipes: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetched recipes:', data);
      setRecipes(data);
    } catch (error) {
      console.error('Failed to fetch recipes:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
    }

    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isModalOpen, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('You are not authorized to perform this action');
      }

      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('ingredients', ingredients);
      formData.append('instructions', instructions);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await fetch('http://localhost:8080/recipes', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Failed to post recipe:', errorData);
        throw new Error(`Failed to post recipe: ${response.status}`);
      }

      const newRecipe = await response.json();
      setRecipes((prevRecipes) => [newRecipe, ...prevRecipes]);

      setTitle('');
      setDescription('');
      setIngredients('');
      setInstructions('');
      setImageFile(null);
      setPreviewImage(null);
      setIsModalOpen(false);

    } catch (error) {
      setError(error.message);
      console.error('Failed to post recipe:', error);
    }
  };


  const StarRating = ({ rating, onRatingChange, readOnly = false }) => {
    const [hover, setHover] = useState(0);
    const stars = [1, 2, 3, 4, 5];

    return (
        <div className="star-rating">
            {stars.map((star) => (
                <span 
                    key={star}
                    className={`star 
                        ${star <= (hover || rating) ? 'filled' : ''} 
                        ${readOnly ? 'read-only' : ''}`
                    }
                    onClick={() => !readOnly && onRatingChange(star)}
                    onMouseEnter={() => !readOnly && setHover(star)}
                    onMouseLeave={() => !readOnly && setHover(0)}
                >
                    ★
                </span>
            ))}
            <span className="rating-number">({rating})</span>
        </div>
    );
};

  const RecipeComments = ({ comments, onAddComment }) => {
    const [newComment, setNewComment] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newComment.trim()) {
            onAddComment(newComment);
            setNewComment('');
        }
    };

    return (
        <div className="recipe-comments">
            <h4>Comments</h4>
            
            {/* Add Comment Form */}
            <form onSubmit={handleSubmit} className="comment-form">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="comment-input"
                />
                <button type="submit" className="comment-submit">
                    Post Comment
                </button>
            </form>

            {/* Comments List */}
            <div className="comments-list">
                {comments.map((comment, index) => (
                    <div key={index} className="comment">
                        <div className="comment-header">
                            <img
                                src={comment.user.imageURL || "/src/images/defaultProfiles.png"}
                                alt={comment.user.username}
                                className="comment-user-pic"
                            />
                            <span className="comment-username">{comment.user.username}</span>
                            <span className="comment-date">{new Date(comment.date).toLocaleDateString()}</span>
                        </div>
                        <p className="comment-text">{comment.text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

  const RecipeCard = ({ recipe }) => {
    const [imageError, setImageError] = useState(false);
    const [currentRating, setCurrentRating] = useState(recipe.rating || 0);
    const [userRating, setUserRating] = useState(null);

    const token = localStorage.getItem('authToken');

    const getUserIdFromToken = () => {
        if(!token) return null;
        try {

            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.id;
        }catch(error) {
            console.error('Failed to parse token:', error);
            return null;
        }
    }

    const currentUserId = getUserIdFromToken();

    const fetchUserRating = async () => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/ratings/recipe/${recipe.recipeID}/user/${currentUserId}`,
            {
                headers: {
                    'Athorization': `Bearer ${token}`,
                }
            }
        );
        
        if(response.ok) {
            const data = await response.json();
            setCurrentRating(data.averageRating || 0);
            setUserRating(data.rating || 0);
        }
    }catch(error) {
        console.error('Failed to fetch user rating:', error);
    }
};

    const handleRatingChange = async (newRating) => {
        if(!token) {
            alert('Please log in to rate recipes');
            return;
        }

        try {

            const params = new URLSearchParams({
                recipeID: recipe.recipeID,
                rating: newRating
            });

            const response = await fetch(`http://localhost:8080/api/ratings/rate?${params}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });

            if(response.ok) {
                const data = await response.json();
                setCurrentRating(data.rating || newRating);
                alert('Rating updated successfully');
                console.log('Rating updated successfully: ', data);
            }else {
                console.error('Failed to update rating: ', await response.text());
            }
        }catch(error) {
            console.error('Failed to rate recipe:', error);
        }
    }

    useEffect(() => {
        if(currentUserId) {
            fetchUserRating();
        }
    }, [recipe.recipeID]);


    // Clean up double uploads in path
    const cleanImagePath = (path) => {
        if(!path) return null;
        return path.replace(/\/uploads\/+/g, '/uploads/');
    };

    // Get full URL for recipe image
    const imageURL = recipe.imageURL?.startsWith('http')
        ? recipe.imageURL
        : `http://localhost:8080${recipe.imageURL}`;

    // Get URL for any image including profile pics
    const getImageURL = (imageURL) => {
        if(!imageURL) return "/src/images/defaultProfiles.png";

        const cleanPath = cleanImagePath(imageURL);
        return cleanPath.startsWith('http')
            ? cleanPath
            : `http://localhost:8080${cleanPath}`;
    };

    const formDate = (dateString) => {
        try {
            if (!dateString) return 'Date not available';

            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                console.error('Invalid date:', dateString);
                return 'Date not available';
            }

            return date.toLocaleString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        } catch (error) {
            console.error('Failed to format date:', dateString, error);
            return 'Date not available';
        }
    };

    return (
        <div className="recipe-card">
            {/* Recipe Image */}
            {recipe.imageURL && (
                <div className="recipe-image-container">
                    <img
                        src={imageURL}
                        alt={recipe.title}
                        className="recipe-image"
                        onError={(e) => {
                            console.error('Failed to load image:', imageURL);
                            e.target.style.display = 'none';
                        }}
                    />
                </div>
            )}

            <div className="recipe-content">
                {}
                <h3 className="recipe-title">{recipe.title}</h3>

                {/* User Info */}
                <div className="user-info">
                    <img
                        src={recipe.user?.imageURL
                            ? getImageURL(recipe.user?.imageURL)
                            : "/src/images/defaultProfiles.png"
                        }
                        alt={`${recipe.user?.name || 'User'}'s profile`}
                        className="profile-pic"
                        onError={(e) => {
                            console.log('Profile image failed to load:', recipe.user?.imageURL);
                            setImageError(true);
                            e.target.src = "/src/images/defaultProfiles.png";
                        }}
                    />
                    <span className="username">
                        {recipe.user?.username || recipe.user?.name || 'Unknown User'}
                    </span>
                </div>

                {/* Recipe Description */}
                <p className="description">{recipe.description}</p>

                {/* Recipe Details */}
                {recipe.ingredients && (
                    <div className="recipe-details">
                        <div className="ingredients-section">
                            <h4>Ingredients</h4>
                            <p>{recipe.ingredients}</p>
                        </div>
                        {recipe.instructions && (
                            <div className="instructions-section">
                                <h4>Instructions</h4>
                                <p>{recipe.instructions}</p>
                            </div>
                        )}
                    </div>
                )}

                <div className="recipe-engagement">
                    <StarRating 
                        rating={currentRating}
                        onRatingChange={handleRatingChange}
                    />
                    
                    <RecipeComments 
                        comments={recipe.comments || []}
                        onAddComment={(commentText) => {
                            // Handle new comment
                            console.log('New comment:', commentText);
                        }}
                    />
                </div>

                {/* Recipe Footer */}
                <div className="recipe-footer">
                    <span className="date">Posted on {formDate(recipe.createdAt)}</span>
                </div>
            </div>
        </div>
    );
};


  RecipeCard.propTypes = {
    recipe: PropTypes.shape({
      recipeID: PropTypes.number,
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      ingredients: PropTypes.string,
      instructions: PropTypes.string,
      imageURL: PropTypes.string,
      createdAt: PropTypes.string,
      user: PropTypes.shape({
        username: PropTypes.string,
        imageURL: PropTypes.string
      })
    }).isRequired
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  const steps = ['Basic Info', 'Ingredients', 'Instructions', 'Image'];

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
          </>
        );
      case 1:
        return (
          <div className="form-group">
            <label htmlFor="ingredients">Ingredients</label>
            <textarea
              id="ingredients"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              required
            />
          </div>
        );
      case 2:
        return (
          <div className="form-group">
            <label htmlFor="instructions">Instructions</label>
            <textarea
              id="instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              required
            />
          </div>
        );
      case 3:
        return (
          <div className="form-group">
            <label htmlFor="image">Image</label>
            <input
              type="file"
              id="image"
              onChange={handleImageChange}
              accept="image/*"
            />
            {previewImage && (
              <img
                src={previewImage}
                alt="Recipe preview"
                className="image-preview"
              />
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="posting-page">
      <aside className="sidebar">
        <h2 className="sidebar-title">Recipe Hub</h2>
        <nav className="sidebar-nav">
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#my-recipes">My Recipes</a></li>
            <li><a href="#favorites">Favorites</a></li>
            <li><a href="#explore">Explore</a></li>
          </ul>
        </nav>
      </aside>
      <main className="main-content">
        <header className="main-header">
          <h1>Share Your Recipe</h1>
          <button onClick={() => setIsModalOpen(true)} className="post-button">
            Post Recipe
          </button>
        </header>
        <div className="recipe-grid">
          {recipes.map(recipe => (
            <RecipeCard
                key={recipe.recipeID}
                recipe={recipe}
            />
          ))}
        </div>

    

        {isModalOpen && (
          <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <button className="close-button" onClick={() => setIsModalOpen(false)} aria-label="Close modal">
                &times;
              </button>
              <h2 className="modal-title">Create New Recipe</h2>
              <div className="progress-bar">
                {steps.map((step, index) => (
                  <div
                    key={step}
                    className={`progress-step ${index <= activeStep ? 'active' : ''}`}
                    onClick={() => setActiveStep(index)}
                  >
                    {step}
                  </div>
                ))}
              </div>
              <form onSubmit={handleSubmit} className="recipe-form">
                {renderStepContent(activeStep)}
                <div className="form-actions">
                  {activeStep > 0 && (
                    <button type="button" onClick={() => setActiveStep(activeStep - 1)} className="nav-button">
                      Previous
                    </button>
                  )}
                  {activeStep < steps.length - 1 ? (
                    <button type="button" onClick={() => setActiveStep(activeStep + 1)} className="nav-button">
                      Next
                    </button>
                  ) : (
                    <button type="submit" className="submit-button">Submit Recipe</button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PostingPage;