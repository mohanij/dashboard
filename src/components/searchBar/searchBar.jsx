// import React, { memo, useContext } from 'react';
// import { AppContext } from '../../context/AppContext';
// import './styles.css';

// const SearchBar = memo(() => {
//   const { searchTerm, setSearchTerm } = useContext(AppContext);

//   return (
//     <div className="search-bar">
//       <input
//         type="text"
//         placeholder="Search by name..."
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         aria-label="Search users by name"
//       />
//     </div>
//   );
// });

// export default SearchBar;
import React, { memo, useContext, useState, useRef, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import './styles.css';

const SearchBar = memo(() => {
  const { searchTerm, setSearchTerm, users } = useContext(AppContext);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  const searchRef = useRef(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Generate suggestions based on search term
  useEffect(() => {
    if (searchTerm.length > 0) {
      const matches = users.filter(user => 
        `${user.name.first} ${user.name.last}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.location.city.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 5); // Limit to 5 suggestions
      
      setSuggestions(matches);
      setShowSuggestions(matches.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm, users]);

  const handleSuggestionClick = (user) => {
    setSearchTerm(`${user.name.first} ${user.name.last}`);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e) => {
    // Arrow down
    if (e.keyCode === 40 && activeSuggestion < suggestions.length - 1) {
      setActiveSuggestion(activeSuggestion + 1);
    }
    // Arrow up
    else if (e.keyCode === 38 && activeSuggestion > 0) {
      setActiveSuggestion(activeSuggestion - 1);
    }
    // Enter
    else if (e.keyCode === 13 && suggestions.length > 0) {
      setSearchTerm(`${suggestions[activeSuggestion].name.first} ${suggestions[activeSuggestion].name.last}`);
      setShowSuggestions(false);
    }
  };

  return (
    <div className="search-container" ref={searchRef}>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name, email, city..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => searchTerm.length > 0 && setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          aria-label="Search users"
        />
      </div>
      {showSuggestions && (
        <ul className="suggestions-dropdown">
          {suggestions.map((user, index) => (
            <li
              key={user.login.uuid}
              className={index === activeSuggestion ? 'active' : ''}
              onClick={() => handleSuggestionClick(user)}
            >
              <img src={user.picture.thumbnail} alt={`${user.name.first} ${user.name.last}`} />
              <div>
                <div>{`${user.name.first} ${user.name.last}`}</div>
                <div className="suggestion-details">
                  {user.email} • {user.location.city}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});

export default SearchBar;