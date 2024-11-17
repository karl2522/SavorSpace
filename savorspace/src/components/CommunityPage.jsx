import { Mail, Star, User, Users } from 'lucide-react';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/PostingPage.css';


const BACKEND_URL = 'http://localhost:8080';

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

const RecipeComments = ({ recipeId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const token = localStorage.getItem('authToken');
    const [currentUser, setCurrentUser] = useState(null);

    const fetchCurrentUser = async () => {
        try {
            const response = await fetch('http://localhost:8080/users/me', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            if(response.ok) {
                const userData = await response.json();
                setCurrentUser(userData);
            }
        }catch(error) {
            console.error('Failed to fetch current user:', error);
        }
    }

    const fetchComments = async () => {
      if (!recipeId) {
          console.error('No recipe ID provided');
          return;
      }
      
      try {
          console.log('Fetching comments for recipe:', recipeId);
          console.log('Using token:', token ? 'Token present' : 'No token');
  
          const response = await fetch(`http://localhost:8080/api/comments/recipe/${recipeId}`, {
              method: 'GET',
              headers: {
                  'Authorization': `Bearer ${token}`,
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
              }
          });
  
          console.log('Response status:', response.status);
          const responseText = await response.text();
          console.log('Raw response text:', responseText);
  
          if (!response.ok) {
              throw new Error(`Server error: ${responseText}`);
          }
  
          let data;
          try {
              data = JSON.parse(responseText);
              console.log('Parsed comments:', data);
          } catch (e) {
              console.error('Failed to parse JSON:', e);
              throw new Error('Invalid JSON response from server');
          }
  
          // Transform the data to match the CommentDTO structure
          const formattedComments = Array.isArray(data) ? data.map(comment => ({
              commentID: comment.commentID, // Match the case from CommentDTO
              content: comment.content,
              createdAt: comment.createdAt, // Match the case from CommentDTO
              flagged: comment.flagged,
              recipeID: comment.recipeID, // Match the case from CommentDTO
              userID: comment.userID, // Match the case from CommentDTO
              username: comment.username,
              userEmail: comment.userEmail,
              userImageURL: comment.userImageURL || '/src/images/defaultProfiles.png'
          })) : [];
  
          console.log('Formatted comments:', formattedComments);
          setComments(formattedComments);
          
      } catch (error) {
          console.error('Error fetching comments:', error);
          setComments([]);
      }
  };

  useEffect(() => {
    if(recipeId) {
        console.log('Fetching comments for recipe:', recipeId);
        fetchComments();
    }
  }, [recipeId]);

  useEffect(() => {
    if(token) {
        fetchCurrentUser();
    }
  }, [token]);
  
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!token || !recipeId) {
            alert('Please login to comment');
            return;
        }
        if (!newComment.trim()) return;
    
        setIsLoading(true);
        try {
            const commentData = {
                content: newComment.trim(),
                recipeID: parseInt(recipeId)
            };
            
            console.log('Sending comment data:', commentData);
    
            const response = await fetch(`http://localhost:8080/api/comments/recipe/${recipeId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(commentData)
            });
    
            const responseText = await response.text();
            console.log('Post comment response:', responseText);
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}, message: ${responseText}`);
            }
    
            setNewComment('');
            await fetchComments();
        } catch (error) {
            console.error('Error posting comment:', error);
            alert('Failed to post comment. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
      if (comments.length > 0) {
          comments.forEach(comment => {
              console.log(`Comment ${comment.commentID} image details:`, {
                  userID: comment.userID,
                  username: comment.username,
                  imageURL: comment.userImageURL,
                  fullImageURL: comment.userImageURL ? `${BACKEND_URL}${comment.userImageURL}` : null
              });
          });
      }
  }, [comments]);
    const handleDeleteComment = async (commentId) => {
        if (!token) {
            alert('Please login to delete comments');
            return;
        }

        if (window.confirm('Are you sure you want to delete this comment?')) {
            try {
                const response = await fetch(`http://localhost:8080/api/comments/${commentId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) {
                  const errorData = await response.json();
                  throw new Error(errorData.message || 'Failed to delete comment');
              }
      
              // Remove the deleted comment from the state
              setComments(prevComments => 
                  prevComments.filter(comment => comment.commentID !== commentId)
              );
            } catch (error) {
                console.error('Error deleting comment:', error);
            }
        }
    };

    const formatDate = (dateTime) => {
      if (!dateTime) return 'Invalid date';
      
      try {
          let date;
          
          // If dateTime is an array [year, month, day, hour, minute, second, nano]
          if (Array.isArray(dateTime)) {
              const [year, month, day, hour, minute] = dateTime;
              // Note: JavaScript months are 0-based, so subtract 1 from month
              date = new Date(year, month - 1, day, hour, minute);
          } else {
              // If it's a string, parse it directly
              date = new Date(dateTime);
          }
  
          // Check if date is valid
          if (isNaN(date.getTime())) {
              console.error('Invalid date value:', dateTime);
              return 'Invalid date';
          }
  
          return date.toLocaleString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
          });
      } catch (error) {
          console.error('Date formatting error:', error, dateTime);
          return 'Invalid date';
      }
  };

  return (
    <div className="recipe-comments">
        <h4>Comments</h4>

        {/* Add Comment Form - Only show if user is logged in */}
        {token ? (
            <form onSubmit={handleSubmit} className="comment-form">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="comment-input"
                    disabled={isLoading}
                />
                <button 
                    type="submit" 
                    className="comment-submit"
                    disabled={isLoading || !newComment.trim()}
                >
                    {isLoading ? 'Posting...' : 'Post Comment'}
                </button>
            </form>
        ) : (
            <p>Please login to comment</p>
        )}

        {/* Comments List */}
        <div className="comments-list">
            {comments.length === 0 ? (
                <p>No comments yet. Be the first to comment!</p>
            ) : (
                comments.map((comment) => (
                    <div key={comment.commentID} className="comment">
                        <div className="comment-header">
                            <img
                                src={comment.userImageURL ? `${BACKEND_URL}${comment.userImageURL}` : '/src/images/defaultProfiles.png'}
                                alt={comment.username || 'User'}
                                className="comment-user-pic"
                                onError={(e) => {
                                    console.error('Failed to load image:', comment.userImageURL);
                                    e.target.src = "/src/images/defaultProfiles.png";
                                }}
                            />
                            <span className="comment-username">
                                {comment.username || comment.userEmail || 'Anonymous'}
                            </span>
                            <span className="comment-date">
                                {formatDate(comment.createdAt)}
                            </span>
                            {currentUser && currentUser.id === comment.userID && (
                                <button 
                                    className="delete-comment"
                                    onClick={() => handleDeleteComment(comment.commentID)}
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                        <p className="comment-text">{comment.content}</p>
                    </div>
                ))
            )}
        </div>
    </div>
  );
};

RecipeComments.propTypes = {
    recipeId: PropTypes.number.isRequired
};


const StarRating = ({ rating, onRatingChange, totalRatings = 0 }) => {
  const [hover, setHover] = useState(0);
  const stars = [1, 2, 3, 4, 5];

  return (
      <div className="rating-container">
          <div className="star-rating">
              {stars.map(star => (
                  <span
                      key={star}
                      className={`star ${star <= (hover || rating) ? 'filled' : ''}`}
                      onClick={() => onRatingChange(star)}
                      onMouseEnter={() => setHover(star)}
                      onMouseLeave={() => setHover(0)}
                      style={{ cursor: 'pointer' }}
                  >
                      ★
                  </span>
              ))}
          </div>
          <div className="rating-stats">
              <span className="rating-value">Rating: {rating || 0}</span>
              <span className="total-ratings">
              </span>
          </div>
      </div>
  );
};

  const RecipeCard = ({ recipe }) => {
    const [imageError, setImageError] = useState(false);
    const [totalRatings, setTotalRatings] = useState(0);
    const [rating, setRating] = useState(recipe.averageRating || 0);
    const [isEditing, setIsEditing] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [editedRecipe, setEditedRecipe] = useState({
      title: recipe.title,
      description: recipe.description,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      imageURL: recipe.imageURL
    })

    const token = localStorage.getItem('authToken');

    const fetchCurrentUser = useCallback(async () => {
      if (!token || isLoading === false) return; // Prevent multiple fetches

      try {
          const response = await fetch('http://localhost:8080/users/me', {
              headers: {
                  'Authorization': `Bearer ${token}`,
              }
          });

          if(response.ok) {
              const userData = await response.json();
              setCurrentUser(userData);
          } else {
              setError('Failed to fetch user data');
          }
      } catch(error) {
          setError(error.message);
      } finally {
          setIsLoading(false);
      }
  }, [token]); // Only depend on token

  // Fetch current user when component mounts
  useEffect(() => {
      let mounted = true;

      if (token && isLoading) {
          fetchCurrentUser().catch(err => {
              if (mounted) {
                  console.error('Error fetching user:', err);
                  setIsLoading(false);
              }
          });
      }

      return () => {
          mounted = false;
      };
  }, [fetchCurrentUser, token, isLoading]);

    const fetchUserRating = async () => {
      if(!token) return;
        try {
            const response = await fetch(
                `http://localhost:8080/api/ratings/recipe/${recipe.recipeID}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        
        if(response.ok) {
          const data = await response.json();
          console.log('Fetched rating data: ', data);
          setRating(data.rating || 0 || data.averageRating);
          setTotalRatings(data.totalRatings || 0);
        }else {
          console.error('Failed to fetch rating:', await response.text());
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

        setRating(newRating);

        try {

            const params = new URLSearchParams({
                recipeId: recipe.recipeID,
                rating: newRating
            }).toString();

            const response = await fetch(`http://localhost:8080/api/ratings/rate?${params}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });

            if(response.ok) {
              const data = await response.json();
              console.log('Rating updated:', data);
              setRating(newRating || data.averageRating);
              setTotalRatings(data.totalRatings || 0);

              if(recipe.averageRating !== undefined) {
                recipe.averageRating = data.averageRating;
              }

              localStorage.setItem(`recipe-${recipe.recipeID}-rating`, newRating);
              alert('Rating updated successfully');
            }else {
                const errorText = await response.text();
                console.error('Failed to update rating: ', await response.text());
                throw new Error(errorText);
            }
        }catch(error) {
            console.error('Failed to rate recipe:', error);
            alert('Failed to update rating. Please try again.');
        }
    }

    useEffect(() => {
      const savedRating = localStorage.getItem(`recipe-${recipe.recipeID}-rating`);
      if (savedRating) {
          setRating(Number(savedRating));
      }
  }, []); // Empty dependency array means this runs once on mount


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

    const handleEdit = () => {
      setIsEditing(true);
    }

    const handleCancel = () => {
      setIsEditing(false);
      setEditedRecipe({
        title: recipe.title,
        description: recipe.description,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        imageURL: recipe.imageURL
      });
    }

    const handleSave = async () => {
      if (!token) {
          alert('Please log in to update recipes');
          return;
      }

      try {
          const response = await fetch(`http://localhost:8080/recipes/${recipe.recipeID}`, {
              method: 'PUT',
              headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(editedRecipe)
          });

          if (response.ok) {
              recipe.title = editedRecipe.title;
              recipe.description = editedRecipe.description;
              recipe.ingredients = editedRecipe.ingredients;
              recipe.instructions = editedRecipe.instructions;
              recipe.imageURL = editedRecipe.imageURL;
              
              setIsEditing(false);
              alert('Recipe updated successfully');
          } else {
              throw new Error('Failed to update recipe');
          }
      } catch (error) {
          console.error('Error updating recipe:', error);
          alert('Failed to update recipe. Please try again.');
      }
  };

    const handleDelete = async () => {
      if(!token) {
        alert('Please log in to delete recipes');
        return;
      }

      if(!window.confirm('Are you sure you want to delete this recipe?')) {
        return;
      }

      try {

        const response = await fetch(`http://localhost:8080/recipes/${recipe.recipeID}`, {
          method: 'DELETE',
          headers: {
              'Authorization': `Bearer ${token}`
          }
        });

        if(response.ok) {
          alert('Recipe deleted successfully');
          window.location.reload();
        }else {
            throw new Error('Failed to delete recipe');
        }
      }catch (error) {
        console.error('Failed to delete recipe:', error);
        alert('Failed to delete recipe. Please try again.');
      }
    };
    return (
      <div className="recipe-card">
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
              {isEditing ? (
                  // Edit Mode
                  <>
                      <input
                          type="text"
                          className="edit-title"
                          value={editedRecipe.title}
                          onChange={(e) => setEditedRecipe({
                              ...editedRecipe,
                              title: e.target.value
                          })}
                      />

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

                      <textarea
                          className="edit-description"
                          value={editedRecipe.description}
                          onChange={(e) => setEditedRecipe({
                              ...editedRecipe,
                              description: e.target.value
                          })}
                      />

                      <div className="recipe-details">
                          <div className="ingredients-section">
                              <h4>Ingredients</h4>
                              <textarea
                                  className="edit-ingredients"
                                  value={editedRecipe.ingredients}
                                  onChange={(e) => setEditedRecipe({
                                      ...editedRecipe,
                                      ingredients: e.target.value
                                  })}
                              />
                          </div>
                          <div className="instructions-section">
                              <h4>Instructions</h4>
                              <textarea
                                  className="edit-instructions"
                                  value={editedRecipe.instructions}
                                  onChange={(e) => setEditedRecipe({
                                      ...editedRecipe,
                                      instructions: e.target.value
                                  })}
                              />
                          </div>
                      </div>
                  </>
              ) : (
                  // View Mode
                  <>
                      <h3 className="recipe-title">{recipe.title}</h3>
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

                      <p className="description">{recipe.description}</p>

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
                  </>
              )}

              <div className="recipe-engagement">
                  <StarRating 
                      rating={rating}
                      onRatingChange={handleRatingChange}
                      totalRatings={totalRatings}
                  />
                  
                  <RecipeComments 
                      recipeId={recipe.recipeID || recipe.id}
                  />
              </div>

              <div className="recipe-footer">
                  <span className="date">Posted on {formDate(recipe.createdAt)}</span>

                  {currentUser && currentUser.id === recipe.user?.id && (
                      <div className="recipe-actions">
                          {isEditing ? (
                              <>
                                  <button className="save-btn" onClick={handleSave}>
                                      Save
                                  </button>
                                  <button className="cancel-btn" onClick={handleCancel}>
                                      Cancel
                                  </button>
                              </>
                          ) : (
                              <>
                                  <button className="edit-btn" onClick={handleEdit}>
                                      Edit
                                  </button>
                                  <button className="delete-btn" onClick={handleDelete}>
                                      Delete
                                  </button>
                              </>
                          )}
                      </div>
                  )}
              </div>
          </div>
      </div>
  );
};

StarRating.propTypes = {
  rating: PropTypes.number,
  userRating: PropTypes.number,
  onRatingChange: PropTypes.func.isRequired,
  readOnly: PropTypes.bool
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
      <aside className="profile-sidebar">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-image-wrapper">
            <img 
              src="/placeholder.svg?height=96&width=96"
              alt="Profile" 
              className="profile-image"
            />
            <span className="status-indicator"></span>
          </div>
          
          <h2 className="profile-name">Jane Doe</h2>
          
          <p className="profile-title">UI/UX Designer</p>
          
          <button className="follow-button">
            Follow
          </button>
        </div>
      </div>  
      
      <div className="profile-stats">
        <div>
          <p className="stat-value">254</p>
          <p className="stat-label">Posts</p>
        </div>
        <div>
          <p className="stat-value">10</p>
          <p className="stat-label">Ratings</p>
        </div>
        <div>
          <p className="stat-value">254</p>
          <p className="stat-label">Comments</p>
        </div>
      </div>
      
      <nav className="profile-nav">
        <a href="#" className="nav-item">
          <User className="nav-icon" />
          <span>View Profile</span>
        </a>
        <a href="#" className="nav-item">
          <Mail className="nav-icon" />
          <span>Messages</span>
        </a>
        <a href="#" className="nav-item">
          <Star className="nav-icon" />
          <span>Saved Posts</span>
        </a>
        <a href="#" className="nav-item">
          <Users className="nav-icon" />
          <span>Friend List</span>
        </a>
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