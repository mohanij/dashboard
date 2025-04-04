import React, { createContext, useState, useCallback, useMemo,useContext } from 'react';
const AppContext = createContext();
export const AppProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState({ users: false, analytics: false });
  const [error, setError] = useState({ users: null, analytics: null });
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');

  const requestSort = useCallback((key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  const filteredAndSortedUsers = useMemo(() => {
    let result = [...users];
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(user => 
        `${user.name.first} ${user.name.last}`.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.location.city.toLowerCase().includes(searchLower) ||
        user.location.state.toLowerCase().includes(searchLower) ||
        user.location.country.toLowerCase().includes(searchLower) ||
        user.phone.includes(searchTerm) ||
        user.cell.includes(searchTerm)
      );
    }
    
    return result.sort((a, b) => {
      if (sortConfig.key === 'name') {
        const nameA = `${a.name.first} ${a.name.last}`.toLowerCase();
        const nameB = `${b.name.first} ${b.name.last}`.toLowerCase();
        return sortConfig.direction === 'asc' 
          ? nameA.localeCompare(nameB) 
          : nameB.localeCompare(nameA);
      }
      if (sortConfig.key === 'email') {
        return sortConfig.direction === 'asc' 
          ? a.email.localeCompare(b.email) 
          : b.email.localeCompare(a.email);
      }
      if (sortConfig.key === 'location') {
        const locationA = `${a.location.city} ${a.location.state}`.toLowerCase();
        const locationB = `${b.location.city} ${b.location.state}`.toLowerCase();
        return sortConfig.direction === 'asc'
          ? locationA.localeCompare(locationB)
          : locationB.localeCompare(locationA);
      }
      return 0;
    });
  }, [users, searchTerm, sortConfig]);

  const value = {
    users,
    setUsers,
    analytics,
    setAnalytics,
    loading,
    setLoading,
    error,
    setError,
    sortConfig,
    requestSort,
    searchTerm,
    setSearchTerm,
    sortedUsers: filteredAndSortedUsers, 
    allUsers: users 
  };

    return (

    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

export { AppContext };
