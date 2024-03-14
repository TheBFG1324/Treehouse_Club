import React, { useState, useEffect } from 'react';
import Account from '../Account/Account';
import searchAccount from '../Api-Functions/searchAccount.js';
import './css/Search.css'; // Ensure the path is correct

function Search(props) {
    const user = props.user
    const googleId = props.googleId
    const [searchTerm, setSearchTerm] = useState('');
    const [accounts, setAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState(null);

    // Function to simulate API call
    const getAccounts = async (query) => {
        const searchedAccounts = await searchAccount(query);
        setAccounts(searchedAccounts);
    };

    const handleAccountSelection = (account) => {
        if(selectedAccount){
            setSelectedAccount(null)
        } else{
            setSelectedAccount(account)
        }
    }

    // Function to clear the selected account
    const unselectAccount = () => {
        setSelectedAccount(null);
    };

    useEffect(() => {
        if (searchTerm) {
            getAccounts(searchTerm);
        } else {
            setAccounts([]);
        }
    }, [searchTerm]);

    const listClasses = `accounts-list ${accounts.length > 0 ? 'visible' : ''}`;

    return (
        <div className="search-wrapper">
            <div className="search-bar-container">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <div className={listClasses}>
                    {accounts.map((account, index) => (
                        <div 
                            key={index} 
                            onClick={() => handleAccountSelection(account)}
                            className={`account-item ${selectedAccount === account ? 'account-item-selected' : ''}`}
                        >
                            {account}
                        </div>
                    ))}
                </div>
            </div>
            <div className='selected-account-container'>
            {selectedAccount && <Account user={selectedAccount} googleId={googleId} isHomeUser={false}/>}
            </div>
        </div>
    );
}

export default Search;

