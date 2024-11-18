import { useEffect, useState } from 'react';
import { IoIosSearch } from "react-icons/io";
import { IoCloudUploadOutline } from "react-icons/io5";
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
          <div className="recipe-upload-container">
            <label htmlFor="image" className="recipe-file-upload">
              <IoCloudUploadOutline color="#D6587F" size={20} /> Upload Image
            </label>
            <input
              type="file"
              id="image"
              onChange={handleImageChange}
              accept="image/*"
              className="file-input"
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
    <div className="community-container">
      <div className="community-header">
        <h2>Community Recipes</h2>
        <div className="header-buttons">
          <IoIosSearch size={40} color="#D6598f" cursor="pointer" className="search-btn"/>
          <button onClick={() => setIsModalOpen(true)} className="post-btn">Post Recipe</button>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-button"
              onClick={() => setIsModalOpen(false)}
              aria-label="Close modal"
            >
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
                  <button
                    type="button"
                    onClick={() => setActiveStep(activeStep - 1)}
                    className="nav-button-prev"
                  >
                    Previous
                  </button>
                )}
                {activeStep < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setActiveStep(activeStep + 1)}
                    className="nav-button-next"
                  >
                    Next
                  </button>
                ) : ( 
                  <button type="submit" className="create-button">Create Recipe</button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="community-posts-container">
        <div className="community-posts">
          {loading && <p>Loading...</p>}
          {error && <p className="error">{error}</p>}
          {recipes.map((recipe) => (
            <div key={recipe.id} className="community-recipes">
              <img src={`${BACKEND_URL}/${recipe.image}`} alt={recipe.title} />
              <h3>{recipe.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostingPage;
