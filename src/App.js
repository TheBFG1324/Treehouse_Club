import React, { useState } from 'react';
import Header from './components/Header';
import NavigationBar from './components/Navigation'; 
import About from './components/About'; 
import Feed from './components/Feed';
import Search from './components/Search';
import Account from './components/Account';

function App() {

  const [activePage, setActivePage] = useState('About')

  const handlePageChange = (page) => {
    setActivePage(page)
  }

  return (
    <div>
    <div>
      <div className='Top'>
      <Header />
      <NavigationBar onPageChange={handlePageChange}/>
      </div>
      {activePage === "About" && <About />}
      {activePage === "Feed" && <Feed />}
      {activePage === "Search" && <Search />}
      {activePage === "Account" && <Account />}
    </div>
    <div style={{ marginBottom: '500px' }}>

    </div>
    </div>
  );
}

export default App;
