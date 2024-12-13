import '../styles/AccountSettingsStyles.css';

// Account Settings Component
const AccountSettings = () => {
  return (
      <div className="account-settings">
        <h1 className="account-h1">Account Settings</h1>

        {/* Recipe Preferences Section */}
        <section className="preferences-section">
          <h2 className="account-h2">Recipe Preferences</h2>
          <div className="form-group-account">
            <label className="account-label" htmlFor="cuisine">Favorite Cuisine</label>
            <select className="account-select" id="cuisine">
              <option value="">Select a cuisine</option>
              <option value="italian">Filipino</option>
              <option value="mexican">Italian</option>
              <option value="japanese">Japanese</option>
              <option value="indian">Mexico</option>
              <option value="mediterranean">Indian</option>
            </select>
          </div>
          <div className="form-group-account"> //Form Group
            <label className="account-label" htmlFor="diet">Dietary Restrictions</label>
            <select className="account-select" id="diet">
              <option value="none">None</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="gluten-free">Gluten-free</option>
              <option value="dairy-free">Dairy-free</option>
            </select>
          </div>
          <div className="form-group-account"> //Form Group
            <label className="account-label" htmlFor="skill-level">Cooking Skill Level</label>
            <select className="account-select" id="skill-level">
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </section>

        {/* Account Settings Section */}
        <section className="account-section">
          <h2 className="account-h2">Account Settings</h2>
          <div className="form-group-account">
            <label className="account-label" htmlFor="language">Language</label>
            <select className="account-select" id="language">
              <option value="en">English</option> //English
              <option value="es">Español</option> //Spanish
              <option value="fr">Français</option> //French
              <option value="de">Deutsch</option> //German
            </select>
          </div>
          <div className="form-group-account">
            <label className="account-label" htmlFor="measurement">Measurement System</label>
            <select className="account-select" id="measurement">
              <option value="metric">Metric (g, ml, °C)</option>
              <option value="imperial">Imperial (oz, cups, °F)</option>
            </select>
          </div>
        </section>

        <button className="account-save-btn">Save Changes</button>
      </div>
  );
};

export default AccountSettings;