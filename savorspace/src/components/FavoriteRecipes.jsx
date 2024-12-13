import React, { useEffect, useState } from 'react';
import { AiFillHeart } from 'react-icons/ai';
import defaultProfile from '../images/defaultProfiles.png';
import '../styles/FavoriteRecipes.css';
import { MdFavorite } from 'react-icons/md';
import { Link } from 'react-router-dom';

const FavoriteRecipes = () => {
    // State hooks for managing favorite recipes, loading state, and errors
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Effect hook to fetch favorites when the component mounts
    useEffect(() => {
        fetchFavorites();
    }, []);

    const fetchFavorites = async () => {
        try {
            const token = localStorage.getItem('authToken');
            console.log('Token:', token ? 'Token exists' : 'No token');

            if (!token) {
                throw new Error('No authentication token found');
            }

            console.log('Fetching favorites...');
            const response = await fetch('http://localhost:8080/api/favorites/user', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                throw new Error('Failed to fetch favorites');
            }

            const data = await response.json();
            console.log('Received data:', data);

            if (Array.isArray(data)) {
                setFavorites(data);
                console.log('Favorites set:', data.length, 'items');
            } else {
                console.error('Invalid data format:', data);
                setFavorites([]);
            }
        } catch (error) {
            console.error('Error fetching favorites:', error);
            setError(error.message || 'Failed to load favorites');
        } finally {
            setLoading(false);
        }
    };

    // Debugging effect to log favorites whenever they change
    useEffect(() => {
        console.log('Current favorites state:', favorites);
    }, [favorites]);

    // Function to handle the removal of a favorite recipe
    const handleRemoveFavorite = async (recipeId) => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error('No authentication token found');
            }
    
            const response = await fetch(`http://localhost:8080/api/favorites/${recipeId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            if (!response.ok) {
                throw new Error('Failed to remove favorite');
            }
    
            // Update the favorites state by filtering out the removed recipe
            setFavorites(prev => prev.filter(fav => fav.recipeId !== recipeId));
        } catch (error) {
            console.error('Error removing favorite:', error);
        }
    };

    // Display a loading message while data is being fetched
    if (loading) return <div className="favorites-loading">Loading your favorites...</div>;
    // Display an error message if fetching fails
    if (error) return <div className="favorites-error">{error}</div>;

    // Function to format dates from an array
    const formatDate = (dateArray) => {
        if (!dateArray || !Array.isArray(dateArray)) return 'Unknown date';
        const [year, month, day] = dateArray;
        return new Date(year, month - 1, day).toLocaleDateString();
    };

    return (
        <div className="favorites-container">
            <h1>Your Favorite Recipes</h1>
            {/* Conditional rendering based on whether there are any favorites */}
            {!favorites || favorites.length === 0 ? (
                <div className="no-favorites">
                    <div className="no-favorites-content">
                        <div className="no-favorites-icon">
                            <MdFavorite />
                        </div>
                        <h2>No Favorites Yet</h2>
                        <p>
                            Looks like you haven't discovered your favorite recipes yet! 
                            Start exploring our amazing collection of recipes and save the ones you love.
                        </p>
                        <Link to="/community" className="explore-button">
                            Explore Recipes
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="favorites-grid">
                    {favorites.map((favorite) => (
                        <div key={favorite.id} className="favorite-card">
                            <div className="favorite-image">
                                <img 
                                    src={
                                        favorite.recipeImageUrl 
                                            ? favorite.recipeImageUrl.startsWith('http')
                                                ? favorite.recipeImageUrl
                                                : `http://localhost:8080${favorite.recipeImageUrl}`
                                            : defaultProfile
                                    } 
                                    alt={favorite.recipeTitle || 'Recipe'}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = defaultProfile;
                                    }}
                                />
                                <button 
                                    className="remove-favorite"
                                    onClick={() => handleRemoveFavorite(favorite.recipeId)}
                                >
                                    <AiFillHeart />
                                </button>
                            </div>
                            <div className="favorite-info">
                                <h3>{favorite.recipeTitle || 'Untitled Recipe'}</h3>
                                {/* Since user info isn't in the response, we can remove or modify this part */}
                                <p className="recipe-date">
                                    Added on: {formatDate(favorite.createdAt)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );    
};

export default FavoriteRecipes;
