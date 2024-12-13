import React, { useState } from 'react';
import './PlaceholderComponent.css';

// Main PlaceholderComponent function
const PlaceholderComponent = () => {
    // State variables
    const [count, setCount] = useState(0);
    const [items, setItems] = useState([]);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    // Handle button click to increment count and add an item
    const handleButtonClick = () => {
        setCount((prevCount) => prevCount + 1);
        const newItem = `Item ${count + 1}`;
        setItems((prevItems) => [...prevItems, newItem]);
    };

    // Handle clearing items
    const handleClearItems = () => {
        setItems([]);
    };

    // Toggle dark mode
    const toggleDarkMode = () => {
        setIsDarkMode((prevMode) => !prevMode);
    };

    // Toggle showing details
    const toggleDetails = () => {
        setShowDetails((prevShow) => !prevShow);
    };

    return (
        <div className={`placeholder-container ${isDarkMode ? 'dark-mode' : ''}`}>
            {/* Header Section */}
            <header className="placeholder-header">
                <h1>Placeholder Component</h1>
                <p>
                    This is a sample component showcasing React features. It is not connected to
                    any backend or logic of the main system.
                </p>
            </header>

            {/* Info Section */}
            <section className="placeholder-info">
                <h2>Component Overview</h2>
                <p>
                    This component demonstrates state management, dynamic lists, toggles, and
                    modular CSS styling.
                </p>
            </section>

            {/* Current Count Section */}
            <section className="placeholder-count">
                <h3>Current Count</h3>
                <p>The button below has been clicked <strong>{count}</strong> times.</p>
            </section>

            {/* Action Buttons */}
            <section className="placeholder-actions">
                <h3>Actions</h3>
                <button className="action-button" onClick={handleButtonClick}>
                    Add Item
                </button>
                <button className="action-button clear-button" onClick={handleClearItems}>
                    Clear Items
                </button>
                <button className="action-button toggle-button" onClick={toggleDarkMode}>
                    {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                </button>
                <button className="action-button detail-button" onClick={toggleDetails}>
                    {showDetails ? 'Hide Details' : 'Show Details'}
                </button>
            </section>

            {/* Generated Items Section */}
            <section className="placeholder-list">
                <h3>Generated Items</h3>
                {items.length === 0 ? (
                    <p>No items added yet. Click "Add Item" to get started!</p>
                ) : (
                    <ul className="item-list">
                        {items.map((item, index) => (
                            <li key={index} className="item">
                                {item}
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            {/* Details Section */}
            {showDetails && (
                <section className="placeholder-details">
                    <h3>Details Section</h3>
                    <p>
                        This section contains additional information, visible only when the
                        "Show Details" button is toggled on.
                    </p>
                    <p>Dark Mode: {isDarkMode ? 'Enabled' : 'Disabled'}</p>
                    <p>Items Count: {items.length}</p>
                </section>
            )}

            {/* Footer Section */}
            <footer className="placeholder-footer">
                <p>
                    Created for demonstration purposes. Style and functionality can be modified as
                    needed.
                </p>
            </footer>
        </div>
    );
};

export default PlaceholderComponent;
