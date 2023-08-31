import React, { useState, useEffect } from 'react';
import './componentcss/Header.css';
import TreeHouseHeader from './componentcss/TreeHouseHeader.png'; // Import the image

function Header() {
  const [scrollOpacity, setScrollOpacity] = useState(1);

  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    const maxScroll = 300;

    const newOpacity = 1 - Math.min(scrollPosition / maxScroll, 1);
    setScrollOpacity(newOpacity);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className="treehouse-container"
      style={{
        backgroundColor: `rgba(214, 115, 39, ${1 - scrollOpacity})`,
      }}
    >
      <div className="treehouse-content" style={{ opacity: scrollOpacity }}>
        <img src={TreeHouseHeader} alt="Treehouse" />
        <div className="text-container">
          <h1>
            <span>The</span>
            <span>Treehouse</span>
            <span>Club</span>
          </h1>
        </div>
      </div>
    </div>
  );
}

export default Header;
