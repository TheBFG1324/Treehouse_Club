import React from 'react'
import './componentcss/Navigation.css'


function NavigationBar({ onPageChange }) {


  return (
      <div className='NavigationButtons'>
          <button className="NavButton" type='button' onClick={() => onPageChange('About')}>About</button>
          <button className="NavButton" type='button' onClick={() => onPageChange('Feed')}>Feed</button>
          <button className="NavButton" type='button' onClick={() => onPageChange('Search')}>Search</button>
          <button className="NavButton" type='button' onClick={() => onPageChange('Account')}>Account</button>
      </div>
  );
}

export default NavigationBar;
