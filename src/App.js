import React, { useState } from 'react';
import NavigationBar from './components/Navigation'; 
import About from './components/About'; 
import Feed from './components/Feed';
import Search from './components/Search';
import Account from './components/Account';
import './App.css'

function App() {
  const [activePage, setActivePage] = useState('About')

  const handlePageChange = (page) => {
    setActivePage(page)
  }

  return (
    <div>
      <div className='Top'>
        <NavigationBar onPageChange={handlePageChange}/>
      </div>
      {activePage === "About" && <About />}
      {activePage === "Feed" && <Feed />}
      {activePage === "Search" && <Search />}
      {activePage === "Account" && <Account />}
    </div>
  );
}

export default App;
