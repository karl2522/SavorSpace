import '../styles/PrivacyStyles.css';

const PrivacySettings = () => {
  return (
    <div className="privacy-container">
      <h1 className="privacy-h1">Privacy Policy</h1>
      <p>Last updated: {new Date().toLocaleDateString()}</p>
      
      <section className="privacy-section">
        <h2 className="privacy-h2">1. Information We Collect</h2>
        <p className="privacy-p">We collect information you provide directly to us, such as when you create an account, subscribe to our newsletter, or contact us for support.</p>
      </section>

      <section>
        <h2 className="privacy-h2">2. How We Use Your Information</h2>
        <p className="privacy-p">We use the information we collect to provide, maintain, and improve our services, to develop new ones, and to protect our company and our users.</p>
      </section>

      <section className="privacy-section">
        <h2 className="privacy-h2">3. Information Sharing and Disclosure</h2>
        <p className="privacy-p">We do not share personal information with companies, organizations, or individuals outside of our company except in the following cases:</p>
        <ul>
          <li>With your consent</li>
          <li>For legal reasons</li>
          <li>To protect rights, property or safety</li>
        </ul>
      </section>

      <section className="privacy-section">
        <h2 className="privacy-h2">4. Data Security</h2>
        <p className="privacy-p">We work hard to protect our users from unauthorized access to or unauthorized alteration, disclosure, or destruction of information we hold.</p>
      </section>

      <section className="privacy-section">
        <h2 className="privacy-h2">5. Changes to This Policy</h2>
        <p className="privacy-p">We may change this privacy policy from time to time. We will post any privacy policy changes on this page and, if the changes are significant, we will provide a more prominent notice.</p>
      </section>

      <section className="privacy-section">
        <h2 className="privacy-h2">6. Contact Us</h2>
        <p className="privacy-p">If you have any questions about this privacy policy, please contact us at: privacy@example.com</p>
      </section>
    </div>
  );
};

export default PrivacySettings;

