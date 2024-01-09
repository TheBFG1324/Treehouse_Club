import React, { useState } from 'react';
import NavigationBar from './components//Navigation/Navigation'; 
import About from './components/About/About'; 
import Feed from './components/Feed/Feed';
import Search from './components/Search/Search';
import Account from './components/Account/Account';
import './App.css'

function App() {
  const [activePage, setActivePage] = useState('About')
  const [account, setAccount] = useState("TheBFG1324")

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
      {activePage === "Account" && <Account user={account} />}
    </div>
  );
}

export default App;
