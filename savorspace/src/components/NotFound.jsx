import React, { useState, useEffect } from 'react';

const NotFound = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  return (
    <div className="not-found-container">
      <div className="background-element" style={{ 
        transform: `translate(${position.x / 50}px, ${position.y / 50}px)` 
      }}></div>
      <div className={`not-found-card ${shake ? 'shake' : ''}`}>
        <div className="icon-container" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
          <div className={`chef-hat ${isHovering ? 'hover' : ''}`}>👨‍🍳</div>
          <div className={`utensils ${isHovering ? 'hover' : ''}`}>🍴</div>
        </div>

        <h1 className="title">404: Recipe Not Found</h1>
        <p className="description">
          Oops! This dish seems to have vanished from our menu.
          <br />
          Let's whip up something else!
        </p>

        <div className="button-container">
          <a href="/login" className="button primary" onClick={handleShake}>
            🏠 Back to Kitchen
          </a>
          <button onClick={() => { handleShake(); window.location.reload(); }} className="button secondary">
            🔄 Try New Recipe
          </button>
        </div>
      </div>
      <div className="footer">
        <p>Don't worry, our chefs are cooking up something extraordinary!</p>
      </div>

      <style jsx>{`
        .not-found-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          overflow: hidden;
          position: relative;
        }

        .background-element {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%);
          pointer-events: none;
        }

        .not-found-card {
          max-width: 400px;
          width: 100%;
          background-color: rgba(255, 255, 255, 0.9);
          border-radius: 20px;
          box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.3);
          overflow: hidden;
          text-align: center;
          padding: 2rem;
          transition: transform 0.3s ease;
        }

        .not-found-card:hover {
          transform: translateY(-5px);
        }

        .shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }

        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }

        .icon-container {
          display: inline-block;
          position: relative;
          margin-bottom: 1.5rem;
          cursor: pointer;
        }

        .chef-hat {
          font-size: 5rem;
          transition: transform 0.3s ease;
        }

        .utensils {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 2.5rem;
          opacity: 0;
          transition: opacity 0.3s ease, transform 0.3s ease;
        }

        .chef-hat.hover {
          transform: rotate(10deg) scale(1.1);
        }

        .utensils.hover {
          opacity: 1;
          transform: translate(-50%, -50%) rotate(-10deg);
        }

        .title {
          font-size: 2.5rem;
          color: #e91e63;
          margin-bottom: 0.5rem;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
        }

        .description {
          color: #666;
          margin-bottom: 2rem;
          font-size: 1.1rem;
        }

        .button-container {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .button {
          padding: 0.75rem 1rem;
          border-radius: 50px;
          font-weight: bold;
          text-decoration: none;
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
          font-size: 1rem;
        }

        .primary {
          background-color: #e91e63;
          color: white;
          box-shadow: 0 4px 6px rgba(233, 30, 99, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
        }

        .primary:hover {
          background-color: #d81b60;
          transform: translateY(-2px);
          box-shadow: 0 7px 14px rgba(233, 30, 99, 0.18), 0 3px 6px rgba(0, 0, 0, 0.10);
        }

        .secondary {
          background-color: white;
          color: #e91e63;
          box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
        }

        .secondary:hover {
          background-color: #f8bbd0;
          transform: translateY(-2px);
          box-shadow: 0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08);
        }

        .footer {
          background-color: rgba(233, 30, 99, 0.9);
          color: white;
          width: 100%;
          max-width: 400px;
          padding: 1rem;
          text-align: center;
          border-bottom-left-radius: 20px;
          border-bottom-right-radius: 20px;
          font-size: 0.9rem;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }

        @media (min-width: 640px) {
          .button-container {   
            flex-direction: row;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default NotFound;