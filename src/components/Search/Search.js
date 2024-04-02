import React, { useState, useEffect } from 'react';
import Account from '../Account/Account';
import searchAccount from '../Api-Functions/searchAccount.js';
import './css/Search.css'; // Ensure the path is correct

function Search(props) {
    const user = props.user;
    const googleId = props.googleId;
    const [searchTerm, setSearchTerm] = useState('');
    const [accounts, setAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState(null);

    const getAccounts = async (query) => {
        const searchedAccounts = await searchAccount(query);
        setAccounts(searchedAccounts);
    };

    const handleAccountSelection = (account) => {
        setSelectedAccount(account);
    };

    useEffect(() => {
        if (searchTerm && !selectedAccount) {
            getAccounts(searchTerm);
        } else {
            setAccounts([]);
        }
    }, [searchTerm, selectedAccount]);

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
                {!selectedAccount && (
                    <div className={`accounts-list ${accounts.length > 0 ? 'visible' : ''}`}>
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
                )}
            </div>
            <div className='selected-account-container'>
                {selectedAccount && <Account user={selectedAccount} callingAccount={user} googleId={googleId} isHomeUser={false}/>}
            </div>
        </div>
    );
}

export default Search;
