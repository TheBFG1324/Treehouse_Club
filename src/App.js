import React, { useState } from 'react';
import NavigationBar from './components/Navigation/Navigation'; 
import About from './components/About/About'; 
import Feed from './components/Feed/Feed';
import Search from './components/Search/Search';
import Account from './components/Account/Account';
import './App.css';
import Login from './components/Login/Login';

function App() {
  const [activePage, setActivePage] = useState('About');
  const [account, setAccount] = useState(null);
  const [anonymousAccount, setAnonymousAccount] = useState(null)
  const [googleID, setGoogleID] = useState(null);

  const handlePageChange = (page) => {
    setActivePage(page);
  };

  const loginSuccess = (Id) => {
    setGoogleID(Id);
  };

  const errorMessage = (error) => {
    console.log(error);
  };

  const setUser = (account) => {
    setAccount(account)
  }

  const setAnonymousUser = (account) => {
    setAnonymousAccount(account)
  }

  if (!googleID) {
    return <Login onSuccess={loginSuccess} onError={errorMessage} setUser={setUser} setAnonymousUser={setAnonymousUser}/>;
  }

  return (
    <div>
      <div className='Top'>
        <NavigationBar onPageChange={handlePageChange}/>
      </div>
      {activePage === "About" && <About />}
      {activePage === "Feed" && <Feed />}
      {activePage === "Search" && <Search />}
      {activePage === "Account" && <Account user={account} anonymousUser={anonymousAccount} googleId={googleID} isHomeUser={true}/>}
    </div>
  );
}

export default App;
