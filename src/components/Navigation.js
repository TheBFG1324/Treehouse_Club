import React, { useEffect, useState } from 'react';
import './componentcss/Navigation.css';

function NavigationBar({ onPageChange }) {
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
      className="NavigationButtons"
      style={{
        backgroundColor: `rgba(253, 151, 68, ${1 - scrollOpacity})`,
      }}
    >
      <button className="NavButton" type="button" onClick={() => onPageChange('About')}>
        About
      </button>
      <button className="NavButton" type="button" onClick={() => onPageChange('Feed')}>
        Feed
      </button>
      <button className="NavButton" type="button" onClick={() => onPageChange('Search')}>
        Search
      </button>
      <button className="NavButton" type="button" onClick={() => onPageChange('Account')}>
        Account
      </button>
    </div>
  );
}

export default NavigationBar;
