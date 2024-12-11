import { useState, useEffect } from 'react';
import { FaVideo, FaSpinner , FaTimes} from 'react-icons/fa';
import ReactPlayer from 'react-player';
import { Link } from 'react-router-dom';
import '../styles/VideoRecipePage.css';
import { useCallback } from 'react';

const VideoRecipePage = () => {
    const [videos, setVideos] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingVideo, setEditingVideo] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [error, setError] = useState(null);
    const [videoToDelete, setVideoToDelete] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [uploadData, setUploadData] = useState({
        title: '',
        description: '',
        ingredients: '',
        instructions: '',
        video: null
    });
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });
    const [uploadProgress, setUploadProgress] = useState(0);

    const token = localStorage.getItem('authToken');

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

    const fetchCurrentUser = useCallback(async () => {
        if (!token) return;
    
        try {
            setIsLoading(true);
            const response = await fetch('http://localhost:8080/users/me', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
    
            if (response.ok) {
                const userData = await response.json();
                setCurrentUser(userData);
            } else {
                setError('Failed to fetch user data');
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    }, [token, isLoading]);

    useEffect(() => {
        fetchCurrentUser();
        fetchVideos();
    }, []);

    const handleViewDetails = (video) => {
        setSelectedVideo(video);
        setShowDetailsModal(true);
    };


    const handleEdit = (video) => {
        if (currentUser && video.user && video.user.id === currentUser.id) {
            setEditingVideo({
                ...video,
                newVideo: null
            });
            setShowEditModal(true);
        } else {
            setNotification({
                show: true,
                message: 'You are not authorized to edit this video',
                type: 'error'
            });
    
            // Hide notification after 5 seconds
            setTimeout(() => {
                setNotification({
                    show: false,
                    message: '',
                    type: ''
                });
            }, 5000); // matches the animation duration
        }
    };
    
    const handleDelete = (video) => {
        if (currentUser && video.user && video.user.id === currentUser.id) {
            setVideoToDelete(video);
            setShowDeleteModal(true);
        } else {
            setNotification({
                show: true,
                message: 'You are not authorized to delete this video',
                type: 'error'
            });
        }
    };
    
    const confirmDelete = async () => {
        try {
            const response = await fetch(`http://localhost:8080/recipes/${videoToDelete.recipeID}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            if (response.ok) {
                setNotification({
                    show: true,
                    message: 'Video recipe deleted successfully!',
                    type: 'success'
                });
                fetchVideos();
            } else {
                throw new Error('Failed to delete video');
            }
        } catch (error) {
            console.error('Error deleting video:', error);
            setNotification({
                show: true,
                message: 'Failed to delete video',
                type: 'error'
            });
        } finally {
            setShowDeleteModal(false);
            setVideoToDelete(null);
        }
    };
    
    const handleUpdate = async (e) => {
        e.preventDefault();
        
        try {
            const formData = new FormData();
            formData.append('title', editingVideo.title);
            formData.append('description', editingVideo.description);
            formData.append('ingredients', editingVideo.ingredients);
            formData.append('instructions', editingVideo.instructions);
            
            if (editingVideo.newVideo) {
                formData.append('video', editingVideo.newVideo);
            }
    
            const response = await fetch(`http://localhost:8080/recipes/${editingVideo.recipeID}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });
    
            if (response.ok) {
                setNotification({
                    show: true,
                    message: 'Video recipe updated successfully!',
                    type: 'success'
                });
                setShowEditModal(false);
                fetchVideos(); // Refresh the video list
            } else {
                throw new Error('Failed to update video');
            }
        } catch (error) {
            console.error('Error updating video:', error);
            setNotification({
                show: true,
                message: 'Failed to update video',
                type: 'error'
            });
        }
    };

    const fetchVideos = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:8080/recipes/videos', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setVideos(data);
            }
        } catch (error) {
            console.error('Error fetching videos:', error);
            setNotification({
                show: true,
                message: 'Failed to load videos',
                type: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const validateVideo = (file) => {
        const validTypes = ['video/mp4', 'video/quicktime', 'video/webm'];
        const maxSize = 100 * 1024 * 1024; // 100MB

        if (!validTypes.includes(file.type)) {
            setNotification({
                show: true,
                message: 'Please upload MP4, MOV, or WebM files only',
                type: 'error'
            });
            return false;
        }

        if (file.size > maxSize) {
            setNotification({
                show: true,
                message: 'Video size should be less than 100MB',
                type: 'error'
            });
            return false;
        }

        return true;
    };

    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (file && validateVideo(file)) {
            setUploadData(prev => ({
                ...prev,
                video: file
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!token) {
            setNotification({
                show: true,
                message: 'Please log in to upload videos',
                type: 'error'
            });
            return;
        }

        if (!uploadData.video) {
            setNotification({
                show: true,
                message: 'Please select a video to upload',
                type: 'error'
            });
            return;
        }

        const formData = new FormData();
        formData.append('title', uploadData.title);
        formData.append('description', uploadData.description);
        formData.append('ingredients', uploadData.ingredients);
        formData.append('instructions', uploadData.instructions);
        formData.append('video', uploadData.video);

        try {
            const response = await fetch('http://localhost:8080/recipes/video', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData,
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    setUploadProgress(percentCompleted);
                }
            });

            if (response.ok) {
                setNotification({
                    show: true,
                    message: 'Video recipe uploaded successfully!',
                    type: 'success'
                });
                setShowUploadModal(false);
                fetchVideos();
            } else {
                throw new Error('Failed to upload video');
            }
        } catch (error) {
            console.error('Error uploading video:', error);
            setNotification({
                show: true,
                message: 'Failed to upload video',
                type: 'error'
            });
        }
    };

    return (
        <div className="video-recipe-page">
            <div className="video-header">
                <h1>Video Recipes</h1>
                <button 
                    className="upload-video-btn"
                    onClick={() => setShowUploadModal(true)}
                >
                    <FaVideo /> Upload Video Recipe
                </button>
            </div>

            {isLoading ? (
                <div className="loading-spinner">
                    <FaSpinner className="spinner" />
                </div>
            ) : (
                <div className="video-grid">
                  {videos.map(video => (
                        <div key={video.recipeID} className="video-card">
                            <ReactPlayer
                                url={`http://localhost:8080${video.videoURL}`}
                                controls
                                width="100%"
                                height="200px"
                            />
                            <div className="video-info">
                                <h3>{video.title}</h3>
                                <div className="video-creator">
                                    <img 
                                        src={getImageURL(video.user?.imageURL) || "/src/images/defaultProfiles.png"} 
                                        alt="Creator" 
                                        className="creator-thumbnail"
                                    />
                                    <span>Created by: {video.user ? video.user.fullName : 'Unknown'}</span>
                                </div>
                                <p>{video.description}</p>
                                <div className="video-actions">
                                    {/* Only show edit and delete buttons if the current user is the owner */}
                                    {currentUser && video.user && video.user.id === currentUser.id && (
                                        <>
                                            <button 
                                                className="edit-btnen"
                                                onClick={() => handleEdit(video)}
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                className="delete-btnen"
                                                onClick={() => handleDelete(video)}
                                            >
                                                Delete
                                            </button>
                                        </>
                                    )}
                                    {/* Show view details button to everyone */}
                                    <button 
                                        className="view-details-btn"
                                        onClick={() => handleViewDetails(video)}
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

                {showDeleteModal && videoToDelete && (
                    <div className="modal-backdrop">
                        <div className="delete-confirmation-modal">
                            <h2>Delete Confirmation</h2>
                            <p>Are you sure you want to delete "{videoToDelete.title}"?</p>
                            <p className="delete-warning">This action cannot be undone.</p>
                            <div className="modal-buttons">
                                <button 
                                    className="confirm-delete-btn"
                                    onClick={confirmDelete}
                                >
                                    Delete
                                </button>
                                <button 
                                    className="cancel-btn"
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setVideoToDelete(null);
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                    {showEditModal && editingVideo && (
                        <div className="modal-backdrop">
                            <div className="edit-recipe-modal">
                                <button 
                                    className="edit-close-btn"
                                    onClick={() => setShowEditModal(false)}
                                >
                                    <FaTimes />
                                </button>
                                <div className="edit-modal-header">
                                    <h2 className="edit-modal-title">Edit Video Recipe</h2>
                                </div>
                                <form className="edit-modal-form" onSubmit={handleUpdate}>
                                    <div className="edit-form-group">
                                        <label className="edit-form-label">Recipe Title</label>
                                        <input
                                            type="text"
                                            className="edit-form-input"
                                            value={editingVideo.title}
                                            onChange={e => setEditingVideo({
                                                ...editingVideo,
                                                title: e.target.value
                                            })}
                                            required
                                        />
                                    </div>
                                    
                                    <div className="edit-form-group">
                                        <label className="edit-form-label">Description</label>
                                        <input
                                            className="edit-form-input edit-form-textarea"
                                            value={editingVideo.description}
                                            onChange={e => setEditingVideo({
                                                ...editingVideo,
                                                description: e.target.value
                                            })}
                                            required
                                        />
                                    </div>
                                    
                                    <div className="edit-form-group">
                                        <label className="edit-form-label">Ingredients</label>
                                        <input
                                            className="edit-form-input edit-form-textarea"
                                            value={editingVideo.ingredients}
                                            onChange={e => setEditingVideo({
                                                ...editingVideo,
                                                ingredients: e.target.value
                                            })}
                                            required
                                        />
                                    </div>
                                    
                                    <div className="edit-form-group">
                                        <label className="edit-form-label">Instructions</label>
                                        <input
                                            className="edit-form-input edit-form-textarea"
                                            value={editingVideo.instructions}
                                            onChange={e => setEditingVideo({
                                                ...editingVideo,
                                                instructions: e.target.value
                                            })}
                                            required
                                        />
                                    </div>

                                    <div className="edit-file-input-wrapper">
                                        <label className="edit-file-input-label">
                                            <span>Click to update video (optional)</span>
                                            <input
                                                type="file"
                                                className="edit-file-input"
                                                accept="video/mp4,video/quicktime,video/webm"
                                                onChange={e => setEditingVideo({
                                                    ...editingVideo,
                                                    newVideo: e.target.files[0]
                                                })}
                                            />
                                        </label>
                                    </div>

                                    <div className="edit-modal-buttons">
                                        <button type="submit" className="edit-update-btn">
                                            Update Recipe
                                        </button>
                                        <button 
                                            type="button" 
                                            className="edit-cancel-btn"
                                            onClick={() => setShowEditModal(false)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                {showDetailsModal && selectedVideo && (
                    <div className="modal-backdrop">
                        <div className="details-modal">
                            <button 
                                className="close-modal"
                                onClick={() => setShowDetailsModal(false)}
                            >
                                <FaTimes />
                            </button>
                            <div className="modal-video">
                                <ReactPlayer
                                    url={`http://localhost:8080${selectedVideo.videoURL}`}
                                    controls
                                    width="100%"
                                    height="400px"
                                />
                            </div>
                            <div className="modal-content">
                                <h2>{selectedVideo.title}</h2>
                                
                                <div className="recipe-metadata">
                                <div className="metadata-item">
                                        <img 
                                            src={getImageURL(selectedVideo.user?.imageURL) || "/src/images/defaultProfiles.png"} 
                                            alt="Creator profile" 
                                            className="creator-profile-pic"
                                        />
                                        <div className="metadata-text">
                                            <span className="metadata-label">Created by</span>
                                            <span className="metadata-value">{selectedVideo.user?.fullName || 'Unknown'}</span>
                                        </div>
                                    </div>
                                    <div className="metadata-item">
                                        <span className="metadata-label">Created on</span>
                                        <span className="metadata-value">
                                            {new Date(selectedVideo.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                <div className="recipe-details">
                                    <div>
                                        <h3>Description</h3>
                                        <p>{selectedVideo.description}</p>
                                    </div>
                                    
                                    <div>
                                        <h3>Ingredients</h3>
                                        <p>{selectedVideo.ingredients}</p>
                                    </div>
                                    
                                    <div>
                                        <h3>Instructions</h3>
                                        <p>{selectedVideo.instructions}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            {showUploadModal && (
                <div className="upload-modal">
                    <div className="modal-content">
                        <h2>Upload Video Recipe</h2>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                placeholder="Recipe Title"
                                value={uploadData.title}
                                onChange={e => setUploadData(prev => ({
                                    ...prev,
                                    title: e.target.value
                                }))}
                                required
                            />
                            <textarea
                                placeholder="Description"
                                value={uploadData.description}
                                onChange={e => setUploadData(prev => ({
                                    ...prev,
                                    description: e.target.value
                                }))}
                                required
                            />
                            <textarea
                                placeholder="Ingredients"
                                value={uploadData.ingredients}
                                onChange={e => setUploadData(prev => ({
                                    ...prev,
                                    ingredients: e.target.value
                                }))}
                                required
                            />
                            <textarea
                                placeholder="Instructions"
                                value={uploadData.instructions}
                                onChange={e => setUploadData(prev => ({
                                    ...prev,
                                    instructions: e.target.value
                                }))}
                                required
                            />
                            <input
                                type="file"
                                accept="video/mp4,video/quicktime,video/webm"
                                onChange={handleVideoChange}
                                required
                            />
                            {uploadProgress > 0 && (
                                <div className="upload-progress">
                                    Uploading: {uploadProgress}%
                                    <div 
                                        className="progress-bar"
                                        style={{ width: `${uploadProgress}%` }}
                                    />
                                </div>
                            )}
                            <div className="modal-buttons">
                                <button type="submit">Upload</button>
                                <button 
                                    type="button" 
                                    onClick={() => setShowUploadModal(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {notification.show && (
                <div className={`notification ${notification.type}`}>
                    {notification.message}
                </div>
            )}
        </div>
    );
};

export default VideoRecipePage;