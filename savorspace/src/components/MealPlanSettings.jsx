import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { format, parseISO } from 'date-fns'; // Import parseISO
import '../styles/MealPlanStyles.css';

const cleanImagePath = (path) => {
    if (!path) return '';
    return path.replace(/\\/g, '/');
};

const getImageURL = (imageURL) => {
    if (!imageURL) return "/src/images/defaultProfiles.png";
    const cleanPath = cleanImagePath(imageURL);
    return cleanPath.startsWith('http')
        ? cleanPath
        : `http://localhost:8080${cleanPath}`;
};

const MealPlanSettings = () => {
    const [events, setEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [confirmation, setConfirmation] = useState({ show: false, message: '', onConfirm: null });
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });
    const token = localStorage.getItem('authToken');

    useEffect(() => {
        const currentDate = new Date();
        fetchMealPlans(currentDate.getFullYear(), currentDate.getMonth());
    }, []);

    const fetchMealPlans = async (year, month) => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/meal-plans/month?year=${year}&month=${month + 1}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            
            if (response.ok) {
                const data = await response.json();
                const calendarEvents = data.map(plan => {
                    try {
                        // Create date string from year, month, day
                        const dateStr = `${plan.year}-${String(plan.month).padStart(2, '0')}-${String(plan.day).padStart(2, '0')}`;
                        
                        return {
                            id: plan.id,
                            title: `${plan.mealType}: ${plan.recipeName}`,
                            date: dateStr,
                            extendedProps: {
                                mealType: plan.mealType,
                                recipeId: plan.recipeId,
                                notes: plan.notes,
                                recipeImage: plan.recipeImage
                            }
                        };
                    } catch (error) {
                        console.error('Error creating calendar event:', plan, error);
                        return null;
                    }
                }).filter(event => event !== null);
                
                setEvents(calendarEvents);
            } else {
                console.error('Failed to fetch meal plans:', response.status);
            }
        } catch (error) {
            console.error('Error fetching meal plans:', error);
        }
    };

    const showNotification = (message, type = 'success') => {
        setNotification({ show: true, message, type });
    };

    const handleSave = async (mealPlanData) => {
        setConfirmation({
            show: true,
            message: 'Are you sure you want to save this meal plan?',
            onConfirm: async () => {
                try {
                    const url = selectedEvent 
                        ? `http://localhost:8080/api/meal-plans/${selectedEvent.id}`
                        : 'http://localhost:8080/api/meal-plans';
                    const method = selectedEvent ? 'PUT' : 'POST';

                    const response = await fetch(url, {
                        method: method,
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(mealPlanData)
                    });

                    if (response.ok) {
                        const savedPlan = await response.json();
                        console.log('Meal plan saved:', savedPlan);
                        const currentDate = new Date();
                        fetchMealPlans(currentDate.getFullYear(), currentDate.getMonth());
                        setSelectedDate(null);
                        setSelectedEvent(null);
                        showNotification(selectedEvent ? 'Meal plan updated successfully!' : 'Meal plan added successfully!');
                    } else {
                        const errorText = await response.text();
                        console.error('Failed to save meal plan:', errorText);
                        showNotification('Failed to save meal plan. Please try again.', 'error');
                    }
                } catch (error) {
                    console.error('Error saving meal plan:', error);
                    showNotification('Error saving meal plan. Please try again.', 'error');
                }
                setConfirmation({ show: false, message: '', onConfirm: null });
            }
        });
    };

    const handleDelete = async (eventId) => {
        setConfirmation({
            show: true,
            message: 'Are you sure you want to delete this meal plan?',
            onConfirm: async () => {
                try {
                    const response = await fetch(`http://localhost:8080/api/meal-plans/${eventId}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (response.ok) {
                        const currentDate = new Date();
                        fetchMealPlans(currentDate.getFullYear(), currentDate.getMonth());
                        setShowDeleteConfirm(false);
                        setSelectedDate(null);
                        setSelectedEvent(null);
                        showNotification('Meal plan deleted successfully!');
                    } else {
                        showNotification('Failed to delete meal plan. Please try again.', 'error');
                    }
                } catch (error) {
                    console.error('Error deleting meal plan:', error);
                    showNotification('Error deleting meal plan. Please try again.', 'error');
                }
                setConfirmation({ show: false, message: '', onConfirm: null });
            }
        });
    };


    const handleEdit = (eventInfo) => {
        setSelectedEvent(eventInfo.event);
        setSelectedDate(new Date(eventInfo.event.start));
    };

    return (
        <div className="meal-plan-settings">
            <div className="settings-header">
                <h2>Meal Planning</h2>
                <p>Plan your meals and organize your recipes</p>
            </div>
            <div className="calendar-container">
                <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    events={events}
                    dateClick={(arg) => {
                        setConfirmation({
                            show: true,
                            message: 'Do you want to add a meal plan for this date?',
                            onConfirm: () => {
                                setSelectedDate(arg.date);
                                setConfirmation({ show: false, message: '', onConfirm: null });
                            }
                        });
                    }}
                    eventClick={handleEdit}
                    eventContent={renderEventContent}
                    datesSet={({ start }) => {
                        const date = new Date(start);
                        fetchMealPlans(date.getFullYear(), date.getMonth());
                    }}
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth'
                    }}
                    height="auto"
                />
            </div>
            {selectedDate && (
                <AddMealPlanModal
                    date={selectedDate}
                    event={selectedEvent}
                    onClose={() => {
                        setSelectedDate(null);
                        setSelectedEvent(null);
                    }}
                    onSave={handleSave}
                    onDelete={selectedEvent ? () => handleDelete(selectedEvent.id) : null}
                />
            )}

            <ConfirmationModal
                isOpen={confirmation.show}
                message={confirmation.message}
                onConfirm={confirmation.onConfirm}
                onCancel={() => setConfirmation({ show: false, message: '', onConfirm: null })}
            />

            {notification.show && (
                <NotificationToast
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification({ show: false, message: '', type: '' })}
                />
            )}
        </div>
    );
};

const AddMealPlanModal = ({ date, onClose, onSave, event, onDelete }) => {
    const [mealType, setMealType] = useState(event?.extendedProps?.mealType || 'BREAKFAST');
    const [recipeId, setRecipeId] = useState(event?.extendedProps?.recipeId || '');
    const [notes, setNotes] = useState(event?.extendedProps?.notes || '');
    const [recipes, setRecipes] = useState([]);
    const token = localStorage.getItem('authToken');

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await fetch('http://localhost:8080/recipes/api/recipes/user', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    setRecipes(data);
                    console.log('Fetched recipes:', data);
                } else {
                    console.error('Failed to fetch recipes:', response.status);
                }
            } catch (error) {
                console.error('Error fetching recipes:', error);
            }
        };
        
        if (token) {
            fetchRecipes();
        }
    }, [token]);

    const handleModalSave = () => {
        const planDate = new Date(date);
        const mealPlanData = {
            year: planDate.getFullYear(),
            month: planDate.getMonth() + 1,
            day: planDate.getDate(),
            mealType: mealType,
            recipeId: parseInt(recipeId, 10),
            notes: notes || ''
        };

        onSave(mealPlanData);
    };

    return (
        <div className="modal-backdrop">
            <div className="meal-plan-modal">
                <h3>{event ? 'Edit' : 'Add'} Meal Plan for {format(date, 'MMMM d, yyyy')}</h3>
                <select value={mealType} onChange={(e) => setMealType(e.target.value)}>
                    <option value="BREAKFAST">Breakfast</option>
                    <option value="LUNCH">Lunch</option>
                    <option value="DINNER">Dinner</option>
                    <option value="SNACK">Snack</option>
                </select>
                <select value={recipeId} onChange={(e) => setRecipeId(e.target.value)}>
                    <option value="">Select a recipe</option>
                    {recipes.map(recipe => (
                        <option key={recipe.recipeID} value={recipe.recipeID}>
                            {recipe.title}
                        </option>
                    ))}
                </select>
                <textarea
                    placeholder="Add notes (optional)"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />
                <div className="modal-buttons">
                    <button onClick={onClose}>Cancel</button>
                    {onDelete && (
                        <button 
                            onClick={onDelete}
                            className="delete-button"
                        >
                            Delete
                        </button>
                    )}
                    <button
                        onClick={handleModalSave}
                        disabled={!recipeId}
                        className="save-button"
                    >
                        {event ? 'Update' : 'Save'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const renderEventContent = (eventInfo) => {
    return (
        <div className="meal-plan-event">
            <div className="meal-type">{eventInfo.event.extendedProps.mealType}</div>
            <div className="recipe-title">{eventInfo.event.title}</div>
            {eventInfo.event.extendedProps.recipeImage && (
                <img 
                    src={getImageURL(eventInfo.event.extendedProps.recipeImage)}
                    alt={eventInfo.event.title}
                    className="recipe-thumbnail"
                />
            )}
        </div>
    );
};


const ConfirmationModal = ({ isOpen, message, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-backdrop">
            <div className="confirmation-modal">
                <h4>Confirmation</h4>
                <p>{message}</p>
                <div className="modal-buttons">
                    <button className="btn-secondary" onClick={onCancel}>Cancel</button>
                    <button className="btn-primary" onClick={onConfirm}>Confirm</button>
                </div>
            </div>
        </div>
    );
};

const NotificationToast = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000); // Auto hide after 3 seconds

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`notification-toast ${type} slide-in`}>
            <span className="notification-message">{message}</span>
            <button className="notification-close" onClick={onClose}>×</button>
        </div>
    );
};

export default MealPlanSettings;