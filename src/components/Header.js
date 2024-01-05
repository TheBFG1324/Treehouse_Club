import { useEffect, useState } from 'react';
import React from 'react';
import './componentcss/Header.css';

function Header() {
  const [word, setWord] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [letterIndex, setLetterIndex] = useState(0);
  const [isEndOfWord, setIsEndOfWord] = useState(false); // New state to track end of word

  const addings = ["the free thinkers", "the innovators", "the creators", "you."];

  useEffect(() => {
    const typeLetter = () => {
      const currentWord = addings[wordIndex];
      setWord(currentWord.slice(0, letterIndex + 1));

      if (letterIndex < currentWord.length - 1) {
        setLetterIndex(letterIndex + 1);
      } else {
        setIsEndOfWord(true); // Reached the end of the word, trigger pause
      }
    };

    const interval = setInterval(() => {
      if (!isEndOfWord) {
        typeLetter(); // Continue typing
      } else {
        // Pause for a second at the end of the word
        setTimeout(() => {
          setWordIndex((wordIndex + 1) % addings.length); // Move to the next word or loop back
          setLetterIndex(0); // Reset for the next word
          setIsEndOfWord(false); // Reset the end of word flag
        }, 1000);
        clearInterval(interval); // Clear the typing interval during the pause
      }
    }, 200);

    return () => clearInterval(interval);
  }, [wordIndex, letterIndex, isEndOfWord]); // Include isEndOfWord in dependencies

  return (
    <div className='header-container'>
      <div className="treehouse-container">
        <div className="treehouse-content">
          <img src='treehouse2.png' alt="Treehouse" />
        </div>
        <div className="badass-words">
          <h1>For {word}<span className="cursor">|</span></h1>
        </div>
      </div>
    </div>
  );
}

export default Header;
