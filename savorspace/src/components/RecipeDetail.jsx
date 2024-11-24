import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MdAccessTime } from "react-icons/md";
import { IoArrowBack } from "react-icons/io5";

export default function RecipeDetail() {
  const { recipeId } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

        if (!response.ok) {
          throw new Error('Failed to fetch recipe details');
        }

        const data = await response.json();
        console.log('Recipe data:', data); // This will help debug the data structure
        setRecipe(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeDetails();
  }, [recipeId]);

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

  return (
    <div className="recipe-detail-container">
      <button 
        className="back-button"
        onClick={() => navigate(-1)}
      >
        <IoArrowBack /> Back
      </button>

      <div className="recipe-detail-header">
        <img 
          src={formatImageURL(recipe.imageURL)}
          alt={recipe.title}
          className="recipe-detail-image"
          onError={(e) => {
            e.target.src = '/src/images/defaultProfiles.png';
          }}
        />
        
        <div className="recipe-detail-info">
          <h1>{recipe.title}</h1>
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
          </div>
          <div className="recipe-timestamp">
            <MdAccessTime />
            <span>{recipe.createdAt}</span>
          </div>
        </div>
      </div>

      <div className="recipe-content">
        <div className="recipe-description">
          <h2>Description</h2>
          <p>{recipe.description}</p>
        </div>

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
    </div>
  );
}