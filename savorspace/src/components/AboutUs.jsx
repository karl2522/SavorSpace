import React from 'react';
import '../styles/AboutUs.css';
import omenImage from '../images/omen.png';
import capurasImage from '../images/capuras.png';
import pejanaImage from '../images/pejana.png';
import gadianeImage from '../images/gadiane.png';
import chavezImage from '../images/chavez.png';

export default function AboutUs() {
  const teamMembers = [
    {
      name: "Jared Karl Omen",
      role: "Full Stack Developer",
      description: "Jared is a passionate Full Stack Developer with expertise in modern web technologies. He specializes in building scalable applications using React, Node.js, and cloud technologies. With a keen eye for detail and a commitment to clean code, Jared brings creative solutions to complex technical challenges.",
      expertise: "React Node.js TypeScript AWS Docker GraphQL",
      projects: [
        "E-commerce Platform Redesign",
        "Real-time Analytics Dashboard",
        "Mobile-First Social Media App"
      ],
      image: omenImage 
    },
    {
      name: "Vaness Capuras",
      role: "UI/UX Designer",
      description: "Alexandra is a creative UI/UX Designer with a passion for crafting intuitive and visually appealing user experiences. She has a strong background in graphic design and front-end development.",
      expertise: "Sketch Figma AdobeXD CSS HTML",
      projects: [
        "Website Redesign for Tech Company",
        "Mobile App Design for Fitness Tracker",
        "E-commerce Platform UI/UX Overhaul"
      ],
      image: capurasImage 
    },
    {
      name: "Mary Therese Pejana",
      role: "UI/UX Designer",
      description: "Alexandra is a creative UI/UX Designer with a passion for crafting intuitive and visually appealing user experiences. She has a strong background in graphic design and front-end development.",
      expertise: "Sketch Figma AdobeXD CSS HTML",
      projects: [
        "Website Redesign for Tech Company",
        "Mobile App Design for Fitness Tracker",
        "E-commerce Platform UI/UX Overhaul"
      ],
      image: pejanaImage 
    },
    {
      name: "John Karl Gadiane",
      role: "UI/UX Designer",
      description: "Alexandra is a creative UI/UX Designer with a passion for crafting intuitive and visually appealing user experiences. She has a strong background in graphic design and front-end development.",
      expertise: "Sketch Figma AdobeXD CSS HTML",
      projects: [
        "Website Redesign for Tech Company",
        "Mobile App Design for Fitness Tracker",
        "E-commerce Platform UI/UX Overhaul"
      ],
      image: gadianeImage
    },
    { 
      name: "Jes Chavez",
      role: "UI/UX Designer",
      description: "Alexandra is a creative UI/UX Designer with a passion for crafting intuitive and visually appealing user experiences. She has a strong background in graphic design and front-end development.",
      expertise: "Sketch Figma AdobeXD CSS HTML",
      projects: [
        "Website Redesign for Tech Company",
        "Mobile App Design for Fitness Tracker",
        "E-commerce Platform UI/UX Overhaul"
      ],
      image: chavezImage
    }
  ];

  return (
    <div className="about-container">
      <header className="hero-section">
        <h1>About Savor<span>Space</span></h1>
        <p>Bringing food lovers together, one recipe at a time</p>
        <button className="join-button">join our community</button>
      </header>

      <section className="mission-section">
        <h2>Our Mission</h2>
        <div className="mission-cards">
          <div className="mission-card">
            <h3>Inspire</h3>
            <p>We aim to inspire culinary creativity and cultural exchange through our vibrant community of food enthusiasts.</p>
          </div>
          <div className="mission-card">
            <h3>Connect</h3>
            <p>SavorSpace connects people from all walks of life, united by their passion for cooking and sharing delicious meals.</p>
          </div>
        </div>
      </section>

      <section className="team-section">
        <h2>Meet Our Team</h2>
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div key={index} className="team-card">
              <div className="team-card-image">
                <img src={member.image} alt={`${member.name}`} />
                <div className="team-card-content">
                  <h3>{member.name}</h3>
                  <h4>{member.role}</h4>
                  <p>{member.description}</p>
                  <p><strong>Expertise:</strong> {member.expertise}</p>
                  <p><strong>Projects:</strong></p>
                  <ul>
                    {member.projects.map((project, idx) => (
                      <li key={idx}>{project}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="join-section">
        <h2>Join Our Culinary Community</h2>
        <p>Whether you're a seasoned chef or a curious beginner, there's a place for you at SavorSpace. Start your flavorful journey today!</p>
        <button className="sign-up-button">Sign Up Now</button>
      </section>

      <footer className="contact-section">
        <h2>Contact US</h2>
        <div className="social-links">
          <button className="social-button">f</button>
          <button className="social-button">G</button>
          <button className="social-button">@</button>
        </div>
      </footer>
    </div>
  );
}