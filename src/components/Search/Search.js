import React, { useState, useEffect } from 'react';
import Account from '../Account/Account';
import searchAccount from '../Api-Functions/searchAccount.js';
import './css/Search.css';

function Search() {
    const [searchTerm, setSearchTerm] = useState('');
    const [accounts, setAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState(null);

    // Function to simulate API call
    const getAccounts = async (query) => {
        const searchedAccounts = await searchAccount(query)
        setAccounts(searchedAccounts)
    };

    useEffect(() => {
        if (searchTerm) {
            getAccounts(searchTerm);
        } else {
            setAccounts([]);
        }
    }, [searchTerm]);

    const listClasses = `accounts-list ${accounts.length > 0 ? 'account-item-visible' : ''}`;
    const listStyle = {
        height: accounts.length === 1 ? 'auto' : accounts.length > 10 ? '200px' : `${accounts.length * 20}px`,
    };

    return (
        <div className="search-container">
            <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
            />
            <div className={listClasses} style={listStyle}>
                {accounts.map((account, index) => (
                    <div key={index} onClick={() => setSelectedAccount(account)} className="account-item">
                        {account} {/* Adjust according to your data structure */}
                    </div>
                ))}
            </div>
            {selectedAccount && <Account account={selectedAccount} />}
        </div>
    );
}

export default Search;

