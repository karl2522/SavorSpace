import PropTypes from 'prop-types';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AiOutlineDelete, AiOutlineSave } from "react-icons/ai";
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FaComment, FaRegComment, FaRegStar, FaStar } from 'react-icons/fa';
import { FiDelete, FiEdit } from 'react-icons/fi';
import { IoFlagOutline } from 'react-icons/io5';
import { MdClose } from 'react-icons/md';
import { VscSend } from 'react-icons/vsc';
import CreateRecipeModal from './RecipeModal';
import { createPortal } from 'react-dom';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import '../styles/PostingPage.css';


const BACKEND_URL = 'http://localhost:8080';

const PostingPage = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef(null);
  const location = useLocation();
  const {scrollToRecipeId, highlightRecipeId } = location.state || {};

  useEffect(() => {
    if (scrollToRecipeId) {
        setTimeout(() => {
            const element = document.getElementById(`recipe-${scrollToRecipeId}`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                element.style.backgroundColor = 'rgba(255, 236, 179, 0.8)';
                setTimeout(() => {
                    element.style.backgroundColor = 'transparent';
                    element.style.transition = 'background-color 1s ease-out';
                }, 100);
            }
        }, 300);
    }
}, [scrollToRecipeId, recipes]);

  const fetchRecipes = useCallback(async () => {
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
          setRecipes(data);
      } catch (error) {
          console.error('Failed to fetch recipes:', error);
          setError(error.message);
      } finally {
          setLoading(false);
      }
  }, []);

  useEffect(() => {
      fetchRecipes();
  }, [fetchRecipes]);

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

      return () => {
          document.body.style.overflow = 'unset';
      };
  }, [isModalOpen, navigate]);


  const handleSubmit = async (formData) => {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('You are not authorized to perform this action');
        }

        const submitData = new FormData();
        Object.keys(formData).forEach(key => {
            if (formData[key]) {
                submitData.append(key, formData[key]);
            }
        });

        const response = await fetch('http://localhost:8080/recipes', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: submitData
        });

        if (!response.ok) {
            throw new Error('Failed to create recipe');
        }

        const newRecipe = await response.json();
        setRecipes(prev => [newRecipe, ...prev]);
    } catch (error) {
        console.error('Error creating recipe:', error);
    }
  };

  if (loading) {
      return <div>Loading...</div>;
  }  


const RecipeComments = ({ recipeId, isVisible}) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const token = localStorage.getItem('authToken');
    const [currentUser, setCurrentUser] = useState(null);
    const [showDeleteCommentModal, setShowDeleteCommentModal] = useState(false);;
    const [commentToDelete, setCommentToDelete] = useState(null);
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });


    const renderPortal = (content) => {
      const modalRoot = document.getElementById('modal-root');
      if (!modalRoot) return null;
      return createPortal(content, modalRoot);
  };

    const cleanImagePath = (path) => {
      if(!path) return null;
      return path.replace(/\/uploads\/+/g, '/uploads/');
  };

    const getImageURL = (imageURL) => {
      if(!imageURL) return "/src/images/defaultProfiles.png";

      const cleanPath = cleanImagePath(imageURL);
      return cleanPath.startsWith('http')
          ? cleanPath
          : `http://localhost:8080${cleanPath}`;
  };

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
              flaggedByUsers: comment.flaggedByUsers || [],
              flagCount: comment.flaggedByUsers ? comment.flaggedByUsers.length : 0,
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
        setNotification({
            show: true,
            message: 'Please login to delete comments',
            type: 'error'
        });
        return;
    }
    
    setCommentToDelete(commentId);
    setShowDeleteCommentModal(true);
};

const confirmDeleteComment = async () => {
  try {
      const response = await fetch(`http://localhost:8080/api/comments/${commentToDelete}`, {
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
          prevComments.filter(comment => comment.commentID !== commentToDelete)
      );

      setNotification({
          show: true,
          message: 'Comment deleted successfully',
          type: 'success'
      });

  } catch (error) {
      console.error('Error deleting comment:', error);
      setNotification({
          show: true,
          message: 'Failed to delete comment',
          type: 'error'
      });
  } finally {
      setShowDeleteCommentModal(false);
      setCommentToDelete(null);
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

  const handleFlagComment = async (commentId) => {
    if(!token) {
        alert('Please log in to flag comments');
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/api/comments/${commentId}/flag`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if(!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to flag the comment');
        }

        const updatedComment = await response.json();
        
        setComments(prevComments =>
            prevComments.map(comment => 
                comment.commentID === commentId
                    ? {
                        ...comment,
                        flaggedByUsers: updatedComment.flaggedByUsers || [],
                        flagCount: updatedComment.flaggedByUsers ? updatedComment.flaggedByUsers.length : 0,
                        flagged: updatedComment.flaggedByUsers?.some(user => user.id === currentUser?.id) || false
                    }
                    : comment
            )
        );
    } catch (error) {
        console.log('Error flagging comment: ', error);
        alert('Failed to flag comment. Please try again.');
    }
};


  return (
    <div className="comment-container">
        <div className={`recipe-comments ${isVisible ? 'block' : 'hidden'}`}>
            <h4>Comments</h4>

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
                        {isLoading ? (
                            <span>Posting...</span>
                        ) : (
                            <VscSend style={{ fontSize: '24px', color: '#D6589F' }} />
                        )}
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
                        <div key={comment.commentID} className={`comment ${comment.flagged ? 'flagged' : ''}`}>
                            <div className="comment-header">
                                <img
                                    src={getImageURL(comment.userImageURL)}
                                    alt={comment.username || 'User'}
                                    className="comment-user-pic"
                                    onError={(e) => {
                                        console.error('Failed to load image:', comment.userImageURL);
                                        e.target.src = "/src/images/defaultProfiles.png";
                                    }}
                                />
                                <div className="comment-user-details">
                                    <span className="comment-username">
                                        {comment.username || comment.userEmail || 'Anonymous'}
                                    </span>
                                    <span className="comment-date">
                                        {formatDate(comment.createdAt)}
                                    </span>
                                    <span className="comment-text">{comment.content}</span>
                                </div>
                                <div className="comment-actions">
                                    {currentUser && currentUser.id === comment.userID && (
                                        <button 
                                            className="delete-comment"
                                            onClick={() => handleDeleteComment(comment.commentID)}
                                            aria-label="Delete Comment"
                                        >
                                            <MdClose size={24} />
                                        </button>
                                    )}

                                      {currentUser && currentUser.id !== comment.userID && (
                                          <button 
                                              className={`flag-comment ${comment.flagged ? 'flagged' : ''}`}
                                              onClick={() => handleFlagComment(comment.commentID)}
                                              aria-label="Flag Comment"
                                          >
                                              <IoFlagOutline 
                                                  size={24} 
                                                  color={comment.flagged ? '#ff0000' : undefined} 
                                              />
                                              <span>{comment.flagCount}</span>
                                          </button>
                                      )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>

        {showDeleteCommentModal && renderPortal (
            <div className="delete-comment-modal-backdrop">
                <div className="delete-comment-modal-content">
                    <h3>Delete Comment</h3>
                    <p>Are you sure you want to delete this comment?</p>
                    <div className="delete-comment-modal-actions">
                        <button onClick={() => setShowDeleteCommentModal(false)}>Cancel</button>
                        <button onClick={confirmDeleteComment} className="delete-comment-confirm-btn">Delete</button>
                    </div>
                </div>
            </div>
        )}

        {notification.show && renderPortal (
            <div 
                className={`comment-notification ${notification.type === 'success' ? 'comment-notification-success' : 'comment-notification-error'}`}
                onAnimationEnd={() => setTimeout(() => setNotification({ ...notification, show: false }), 3000)}
            >
                {notification.message}
            </div>
        )}
    </div>
  );
};

RecipeComments.propTypes = {
    recipeId: PropTypes.number.isRequired,
    isVisible: PropTypes.bool.isRequired
};


const StarRating = ({ rating, onRatingChange, totalRatings = 0, onToggleComments}) => {
  const [hover, setHover] = useState(0);
  const stars = [1, 2, 3, 4, 5];
  const [isHovered, setIsHovered] = useState(false);

  return (
      <div className="rating-container">
        <div className="rating-stats">
              <span className="rating-value">Rating: {rating || 0}</span>
              <span className="total-ratings"></span>
          </div>
          <div className="star-ratings">
              {stars.map(star => (
                  <span
                      key={star}
                      onClick={() => onRatingChange(star)}
                      onMouseEnter={() => setHover(star)}
                      onMouseLeave={() => setHover(0)}
                      style={{ cursor: 'pointer' }}
                  >
                {star <= (hover || rating) ? (
                    <FaStar size={20} color="#D6589F" />
                  ) : (
                    <FaRegStar size={20} color="#D6589F" />
                  )}
                  </span>
              ))}
          </div>
          <div 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onToggleComments}
            className="comment-icon"
          >
            {isHovered ? (
              <FaComment size={20} cursor={'pointer'} color="#D6589F"/>
            ) : (
              <FaRegComment size={20} cursor={'pointer'} color="#D6589F"/>
            )}
          </div>
      </div>
  );
};

  const RecipeCard = ({ recipe, isHighlighted }) => {
    const [isCommentsVisible, setIsCommentsVisible] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [totalRatings, setTotalRatings] = useState(0);
    const [rating, setRating] = useState(recipe.averageRating || 0);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [ratingNotification, setRatingNotification] = useState({ show: false, message: '', type: '' });
    const [saveNotification, setSaveNotification] = useState({ show: false, message: '', type: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isContentVisible, setIsContentVisible] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [editedRecipe, setEditedRecipe] = useState({
      title: recipe.title,
      description: recipe.description,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      imageURL: recipe.imageURL
    })

    const token = localStorage.getItem('authToken');

    const fetchCurrentUser = useCallback(async () => {
      if (!token || isLoading === false) return;

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
  }, [token]); 

  
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
          setRatingNotification({
              show: true,
              message: 'Please log in to rate recipes',
              type: 'error'
          });
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
              setRatingNotification({
                  show: true,
                  message: 'Rating updated successfully',
                  type: 'success'
              });
          } else {
              const errorText = await response.text();
              console.error('Failed to update rating: ', errorText);
              throw new Error(errorText);
          }
      } catch(error) {
          console.error('Failed to rate recipe:', error);
          setRatingNotification({
              show: true,
              message: 'Failed to update rating. Please try again.',
              type: 'error'
          });
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
      setIsContentVisible(!isContentVisible);
    }

    const handleCancel = () => {
      setIsEditing(false);
      setIsContentVisible(!isContentVisible);
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
          setSaveNotification({
              show: true,
              message: 'Please log in to update recipes',
              type: 'error'
          });
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
              setIsDropdownOpen(false);
              setSaveNotification({
                  show: true,
                  message: 'Recipe updated successfully',
                  type: 'success'
              });
          } else {
              throw new Error('You cannot update this recipe');
          }
      } catch (error) {
          console.error('Error updating recipe:', error);
          setSaveNotification({
              show: true,
              message: 'You cannot update this recipe - it\'s not yours',
              type: 'error'
          });
      }
  };

  const handleDelete = async () => {
    if (!token) {
      setNotification({
        show: true,
        message: 'Please log in to delete recipes',
        type: 'error'
      });
      return;
    }
  
    // Show the modal instead of window.confirm
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8080/recipes/${recipe.recipeID}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (response.ok) {
        setNotification({
          show: true,
          message: 'Recipe deleted successfully',
          type: 'success'
        });
        
        
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        throw new Error('Failed to delete recipe');
      }
    } catch (error) {
      console.error('Failed to delete recipe:', error);
      setNotification({
        show: true,
        message: 'Failed to delete recipe. Please try again.',
        type: 'error'
      });
    } finally {
      setShowDeleteModal(false);
    }
  };


    const toggleContentVisibility = () => {
      setIsContentVisible(!isContentVisible);
    }; 

    const toggleDropdown = () => {
      setIsDropdownOpen(!isDropdownOpen);
    };

    const handleToggleComments = () => {
      setIsCommentsVisible(!isCommentsVisible);
  };

  return (
    <div 
      id={`recipe-${recipe.recipeID}`}
      className={`community-post ${isHighlighted ? 'highlighted-recipe' : ''}`}
      style={{
        transition: isHighlighted ? 'background-color 1s ease-out' : ''
      }}
    >
      <div className="post-card">
        <div className="community-user">  
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
          <div className="community-user-content"> 
            <h3>{recipe.user?.fullName || recipe.user?.username || 'Unknown User'}</h3>
            <span className="date">{formDate(recipe.createdAt)}</span>
            {currentUser && currentUser.id === recipe.user?.id && ( 
              <div className="action-dots-container" onClick={toggleDropdown}>
                <BsThreeDotsVertical className="action-dots" size={20} cursor="pointer" />
              </div>
            )}
          </div>
        </div>
  
        {isDropdownOpen && (
          <div className="dropdown-menu">
            {isEditing ? (
              <ul>
                <li>
                  <div className="save-container">
                    <AiOutlineSave size={23} color="#fff" />
                    <button className="save-btn" onClick={handleSave}>
                      Save
                    </button>
                  </div>
                </li>
                <li>
                  <div className="cancel-container">
                    <FiDelete size={23} color="#fff" />
                    <button className="cancel-btn" onClick={handleCancel}>
                      Cancel
                    </button>
                  </div>
                </li>
              </ul>
            ) : (
              <ul>
                <li>
                  <div className="edit-container">
                    <FiEdit size={23} color="#fff" />
                    <button className="edit-btn" onClick={handleEdit}>
                      Edit
                    </button>
                  </div>
                </li>
                <li>
                  <div className="delete-container">
                    <AiOutlineDelete size={23} color="#fff" />
                    <button className="delete-btn" onClick={handleDelete}>
                      Delete
                    </button>
                  </div>
                </li>
              </ul>
            )}
          </div>
        )}
  
        {recipe.imageURL && (
          <div className="post-card-content">
            <div className="post-card-header" onClick={toggleContentVisibility}>
              <h4>{recipe.title}</h4>
              <p>Click to {isContentVisible ? "hide" : "show"} details</p>
            </div>
            
            {isContentVisible && (
              <div
                className="post-card-recipes-container content-visible-animation"
                style={{ animation: isContentVisible ? "fadeIn 0.5s ease-in-out" : "" }}
              >
                <div className="post-card-recipes-details">
                  {isEditing ? (
                    <input
                      type="text"
                      className="edit-title"
                      value={editedRecipe.title}
                      onChange={(e) => setEditedRecipe({ ...editedRecipe, title: e.target.value })}
                    />
                  ) : (
                    <h4 className="description">{recipe.title}</h4>
                  )}
  
                  {isEditing ? (
                    <textarea
                      className="edit-description"
                      value={editedRecipe.description}
                      onChange={(e) => setEditedRecipe({ ...editedRecipe, description: e.target.value })}
                    />
                  ) : (
                    <h4 className="description">{recipe.description}</h4>
                  )}
  
                  {recipe.ingredients && (
                    <div className="ingredients-section">
                      <h4>Ingredients:</h4>
                      {isEditing ? (
                        <textarea
                          className="edit-ingredients"
                          value={editedRecipe.ingredients}
                          onChange={(e) => setEditedRecipe({ ...editedRecipe, ingredients: e.target.value })}
                        />
                      ) : (
                        <p>{recipe.ingredients}</p>
                      )}
                    </div>
                  )}
  
                  {recipe.instructions && (
                    <div className="instructions-section">
                      <h4>Instructions</h4>
                      {isEditing ? (
                        <textarea
                          className="edit-instructions"
                          value={editedRecipe.instructions}
                          onChange={(e) => setEditedRecipe({ ...editedRecipe, instructions: e.target.value })}
                        />
                      ) : (
                        <p>{recipe.instructions}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
  
            <div className="post-card-image">
              <img
                src={imageURL}
                alt={recipe.title}
                onError={(e) => {
                  console.error('Failed to load image:', imageURL);
                  e.target.style.display = 'none';
                }}
              />
            </div>
          </div>
        )}
  
        <div className="recipe-engagement-community">
          <StarRating 
            rating={rating}
            onRatingChange={handleRatingChange}
            totalRatings={totalRatings}
            onToggleComments={handleToggleComments}
            recipeId={recipe.recipeID}
          />
  
          <RecipeComments
            recipeId={recipe.recipeID || recipe.id}
            isVisible={isCommentsVisible}
          /> 
        </div>
      </div>
  
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="delete-modal-backdrop">
          <div className="delete-modal-content">
            <h3>Delete Recipe</h3>
            <p>Are you sure you want to delete this recipe?</p>
            <div className="delete-modal-actions">
              <button onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button onClick={confirmDelete} className="delete-confirm-btn">Delete</button>
            </div>
          </div>
        </div>
      )}
  
      {/* Notification Toast */}
      {notification.show && (
        <div className={`recipe-notification ${notification.type === 'success' ? 'notification-success' : 'notification-error'}`}>
          {notification.message}
        </div>
      )}

      {ratingNotification.show && (
          <div 
              className={`rating-notification ${ratingNotification.type === 'success' ? 'rating-notification-success' : 'rating-notification-error'}`}
              onAnimationEnd={() => setTimeout(() => setRatingNotification({ ...ratingNotification, show: false }), 3000)}
          >
              {ratingNotification.message}
          </div>
      )}

      {saveNotification.show && (
          <div 
              className={`save-notification ${saveNotification.type === 'success' ? 'save-notification-success' : 'save-notification-error'}`}
              onAnimationEnd={() => setTimeout(() => setSaveNotification({ ...saveNotification, show: false }), 3000)}
          >
              {saveNotification.message}
          </div>
      )}
    </div>
  );
};

StarRating.propTypes = {
  rating: PropTypes.number,
  userRating: PropTypes.number,
  onRatingChange: PropTypes.func.isRequired,
  readOnly: PropTypes.bool,
  onToggleComments: PropTypes.func,
};



  RecipeCard.propTypes = {
    recipe: PropTypes.shape({
      recipeID: PropTypes.number,
      id: PropTypes.number,
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      ingredients: PropTypes.string,
      instructions: PropTypes.string,
      imageURL: PropTypes.string,
      createdAt: PropTypes.string,
      user: PropTypes.shape({
        id: PropTypes.number,
        username: PropTypes.string,
        fullName: PropTypes.string,
        imageURL: PropTypes.string,
        name: PropTypes.string
      })
    }).isRequired
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;


  return (
    <div className="community-container">
            <div className="community-header">
                <h1>Community Recipes</h1>
                <button onClick={() => setShowModal(true)} className="post-btn">
                    Post Recipe
                </button>
            </div>

            <div className="community-posts">
                {loading ? (
                    <div>Loading...</div>
                ) : error ? (
                    <div>Error: {error}</div>
                ) : (
                    recipes.map(recipe => (
                        <RecipeCard
                            key={recipe.recipeID}
                            recipe={recipe}
                            isHighlighted={recipe.recipeID === highlightRecipeId}
                        />
                    ))
                )}
            </div>
        <CreateRecipeModal
                ref={modalRef}
                show={showModal}
                onClose={() => setShowModal(false)}
                onSubmit={handleSubmit}
            />
        </div>
  );
};

export default PostingPage;