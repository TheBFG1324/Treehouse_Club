import React from 'react';
import './componentcss/Header.css';

function Header() {
  return (
    <div className='header-container'>
      <div className="treehouse-container">
        <div className="treehouse-content">
          <img src='treehouse2.png' alt="Treehouse" />
        </div>
        <div className="badass-words">
          <h1>For the free thinkers</h1>
        </div>
      </div>
    </div>
  );
}

export default Header;
