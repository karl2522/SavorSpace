import '../styles/GeneralStyles.css';

// GeneralSettings component
const GeneralSettings = () => {
  return (
    <div className="general-settings-container">
      <h1 className="general-title">General Settings</h1>

      // Display Preferences
      <section className="settings-section">
        <h2 className="general-h2">Display Preferences</h2>
        <div className="form-group-general">
          <label className="general-label" htmlFor="theme">Theme</label>
          <select id="theme" name="theme" defaultValue="light">
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto (System)</option>
          </select>
        </div>
        <div className="form-group-general">
          <label className="general-label" htmlFor="font-size">Font Size</label>
          <select id="font-size" name="font-size" defaultValue="medium">
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>
      </section>

      // Recipe Display
      <section className="settings-section">
        <h2 className="general-h2">Recipe Display</h2>
        <div className="form-group-general checkbox">
          <input type="checkbox" id="show-calories" name="show-calories" defaultChecked />
          <label className="general-label" htmlFor="show-calories">Show calorie information</label>
        </div>
        <div className="form-group-general checkbox">
          <input type="checkbox" id="show-prep-time" name="show-prep-time" defaultChecked />
          <label className="general-label" htmlFor="show-prep-time">Show preparation time</label>
        </div>
        <div className="form-group-general checkbox">
          <input type="checkbox" id="show-difficulty" name="show-difficulty" defaultChecked />
          <label className="general-label" htmlFor="show-difficulty">Show difficulty level</label>
        </div>
      </section>

      // Language and Region
      <section className="settings-section">
        <h2 className="general-h2">Language and Region</h2>
        <div className="form-group-general">
          <label className="general-label" htmlFor="language">Language</label>
          <select id="language" name="language" defaultValue="en">
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
          </select>
        </div>
        <div className="form-group-general">
          <label className="general-label" htmlFor="measurement-unit">Region</label>
          <select id="measurement-unit" name="measurement-unit" defaultValue="metric">
            <option value="asia">Asia</option>
            <option value="ant">Antarctica</option>
            <option value="aus">Australia</option>
            <option value="europe">Europe</option>
            <option value="north">North America</option>
            <option value="south">South America</option>

          </select>
        </div>
      </section>

      <button className="save-general-button">Save Changes</button> // Save Changes button
    </div>
  );
};

export default GeneralSettings;

