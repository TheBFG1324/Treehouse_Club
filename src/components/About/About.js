import React from 'react';
import './css/About.css';
import Header from './Header';

function About() {
  return (
    
    <div>
    <Header />
    <div className='AboutContainer'>
      <h1>Mission Statement</h1>
      <p>
        At The Treehouse Club, we are dedicated to fostering a vibrant community
        of creators and thinkers who value authenticity, self-expression, and the
        pursuit of knowledge. In a world often shrouded by the veil of
        artificiality, hatred and greed, we have built a digital haven where
        individuals can gather to share their unique perspectives, creativity,
        and passions.
      </p>
      <p>
        Our mission is to provide a welcoming platform where members can freely
        post their research findings, craft compelling short stories, weave
        intricate poems, and showcase their artistic creations. We believe that
        the human spirit thrives when unburdened by constraints, and The
        Treehouse Club aims to be the catalyst for such liberation.
      </p>
      <p>
        Be the change you want to see in the world. Wave your quill with
        unwavering determination. Paint the world in the light that you see it.
        Feel the flames of your soul burn bright. Welcome to the Treehouse
        Club.
      </p>
    </div>
    </div>
  );
}

export default About;
