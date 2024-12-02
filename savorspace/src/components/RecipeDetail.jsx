import { useEffect, useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import { IoArrowBack } from "react-icons/io5";
import { MdAccessTime, MdFavorite, MdFavoriteBorder, MdShare } from "react-icons/md";
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/RecipeDetail.css';

export default function RecipeDetail() {
  const { recipeId } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [relatedRecipes, setRelatedRecipes] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false)
  const BACKEND_URL = 'http://localhost:8080';
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const getLikesFromStorage = () => {
    try {
      const likes = localStorage.getItem('recipeLikes');
      return likes ? JSON.parse(likes) : {};
    } catch (error) {
      console.error('Error parsing likes from localStorage:', error);
      return {};
    }
  };

  
  const saveLikesToStorage = (likes) => {
    try {
      localStorage.setItem('recipeLikes', JSON.stringify(likes));
    } catch (error) {
      console.error('Error saving likes to localStorage:', error);
    }
  };

  useEffect(() => {
    const likes = getLikesFromStorage();
    if (recipeId) {
      const recipeLikes = likes[recipeId] || { count: 0, isLiked: false };
      setIsLiked(recipeLikes.isLiked);
      setLikeCount(recipeLikes.count);
    }
  }, [recipeId]); // Only depend on recipeId
  
  const fetchCurrentUser = async () => {
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('http://localhost:8080/users/me', {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });

        if(response.ok) {
            const userData = await response.json();
            setCurrentUser(userData);
        }
    } catch(error) {
        console.error('Failed to fetch current user:', error);
    }
};

const fetchComments = async () => {
  if (!recipeId) {
      console.error('No recipe ID provided');
      return;
  }
  
  try {
      const token = localStorage.getItem('authToken');
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

      const formattedComments = Array.isArray(data) ? data.map(comment => ({
          commentID: comment.commentID,
          content: comment.content,
          createdAt: comment.createdAt,
          flagged: comment.flagged,
          recipeID: comment.recipeID,
          userID: comment.userID,
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
  fetchComments();
  fetchCurrentUser();
}, [recipeId]);

  const formatImageURL = (imageURL) => {
    if(!imageURL) return '';
    return imageURL.startsWith('http')
      ? imageURL
      : `http://localhost:8080${imageURL}`;
  };

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`http://localhost:8080/recipes/${recipeId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });

        if (!response.ok) throw new Error('Failed to fetch recipe details');

        const data = await response.json();
        setRecipe(data);
        setLikeCount(data.likes || 0);
        setIsLiked(data.isLikedByUser || false);
        setComments(data.comments || []);
        
        // Fetch related recipes
        const relatedResponse = await fetch(
          `http://localhost:8080/recipes/related/${recipeId}?limit=3`,
          { headers: { 'Authorization': `Bearer ${token}` }}
        );
        if (relatedResponse.ok) {
          const relatedData = await relatedResponse.json();
          setRelatedRecipes(relatedData);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeDetails();
  }, [recipeId]);

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`http://localhost:8080/api/ratings/recipe/${recipeId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
  
        if (response.ok) {
          const data = await response.json();
          setIsLiked(data.rating > 0);
        }
      } catch (error) {
        console.error('Error fetching rating:', error);
      }
    };
  
    fetchRating();
  }, [recipeId]);


  useEffect(() => {
    const fetchComments = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`http://localhost:8080/api/comments/recipe/${recipeId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
  
        if (response.ok) {
          const data = await response.json();
          setComments(data);
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };
  
    fetchComments();
  }, [recipeId]);

  const handleLike = () => {
    const likes = getLikesFromStorage();
    
    const currentLikes = likes[recipeId] || { count: 0, isLiked: false };
    
    const newIsLiked = !currentLikes.isLiked;
    const newCount = newIsLiked ? currentLikes.count + 1 : currentLikes.count - 1;

    const newLikes = {
      ...likes,
      [recipeId]: {
        count: newCount,
        isLiked: newIsLiked
      }
    };
    
    // Save to localStorage
    saveLikesToStorage(newLikes);
    
    // Update state
    setIsLiked(newIsLiked);
    setLikeCount(newCount);
  };

  const handleShare = async () => {
    const recipeUrl = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: recipe.title,
          text: recipe.description,
          url: recipeUrl
        });
      } else {
        await navigator.clipboard.writeText(recipeUrl);
        triggerSuccess('Recipe link copied to clipboard!');
        console.log('Recipe link copied to clipboard:', recipeUrl);
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');
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

const handleDeleteComment = async (commentId) => {
  const token = localStorage.getItem('authToken');
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


  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!recipe) return <div>Recipe not found</div>;

  // Convert ingredients string to array if it's a string
  const ingredientsList = typeof recipe.ingredients === 'string' 
    ? recipe.ingredients.split(',').map(item => item.trim())
    : Array.isArray(recipe.ingredients) 
      ? recipe.ingredients 
      : [];

  // Convert instructions string to array if it's a string
  const instructionsList = typeof recipe.instructions === 'string'
    ? recipe.instructions.split('\n').filter(step => step.trim())
    : Array.isArray(recipe.instructions)
      ? recipe.instructions
      : [];

  const handleAnimationEnd = () => {
    if (!showErrorToast) {
      setErrorMessage('');
    }
  };

  const triggerSuccess = (message) => {
    setSuccessMessage(message);
    setShowSuccessToast(true);

    setTimeout(() => {
      setShowSuccessToast(false);
    }, 4700);
  };

  return (
    <div className="recipe-detail-container">
       {showSuccessToast && (
                    <div 
                    className="success-alert-activate" 
                    onAnimationEnd={handleAnimationEnd} // Reset state after animation ends
                    >
                    <div className="success-alert-content">
                        <div className="success-check">
                        <FaCheck size={20} />
                        </div>
                        <p>{successMessage}</p>
                    </div>
                    </div>
                )}
      <div className="recipe-detail-header">
        <button 
          className="back-button"
          onClick={() => navigate(-1)}
        >
          <IoArrowBack /> Back
        </button>
          <div className="recipe-actions">
            <button 
            className={`like-button ${isLiked ? 'liked' : ''}`}
            onClick={handleLike}
            >
              {isLiked ? <MdFavorite /> : <MdFavoriteBorder />}
              <span>{likeCount}</span>
            </button>
            <button className="share-button" onClick={handleShare}>
              <MdShare />
              Share
            </button>
          </div>
      </div>
      <div className="recipe-detail-card">
        <div className="recipe-detail-image">
          <img 
            src={formatImageURL(recipe.imageURL)}
            alt={recipe.title}
            onError={(e) => {
              e.target.src = '/src/images/defaultProfiles.png';
            }}
          />
        </div>
      
        <div className="recipe-detail-info">
          <h1>{recipe.title}</h1>
          <p className="recipe-detail-description">{recipe.description}</p>
          <div className="recipe-author">
            {recipe.user && (
              <>
                <img 
                  src={formatImageURL(recipe.user.imageURL)}
                  alt={recipe.user.fullName}
                  className="author-image"
                  onError={(e) => {
                    e.target.src = '/src/images/defaultProfiles.png';
                  }}
                />
                <span>By: {recipe.user.fullName || 'Anonymous'}</span>
              </>
            )}
            <div className="recipe-timestamp">
              <MdAccessTime />
              <span>{recipe.createdAt}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="recipe-detail-content">
        {ingredientsList.length > 0 && (
          <div className="recipe-ingredients">
            <h2>Ingredients</h2>
            <ul>
              {ingredientsList.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </div>
        )}

        {instructionsList.length > 0 && (
          <div className="recipe-instructions">
            <h2>Instructions</h2>
            <ol>
              {instructionsList.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>
        )}
      </div>

      {relatedRecipes.length > 0 && (
        <div className="related-recipes">
          <h2>You might also like</h2>
          <div className="related-recipes-grid">
            {relatedRecipes.map(related => (
              <div 
                key={related.recipeId}
                className="related-recipe-card"
                onClick={() => navigate(`/community/recipe/${related.recipeId}`)}
              >
                <div className="related-recipe-image">
                  <img 
                    src={formatImageURL(related.imageURL)}
                    alt={related.title}
                  />
                </div>
                <h3>{related.title}</h3>
                <p>{related.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}