import React, { memo, useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { useFetchUsers } from '../../hooks/useFetchUsers';
import './styles.css';

const UserList = memo(() => {
  useFetchUsers();
  const { sortedUsers = [], requestSort, sortConfig, loading, error } = useContext(AppContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  const formatDateOfBirth = (dob) => {
    if (!dob) return 'N/A';
    const date = new Date(dob);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatAddress = (location) => {
    if (!location) return 'N/A';
    return `${location.street.number} ${location.street.name}, ${location.city}, ${location.state}, ${location.country}`;
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
    }
    return null;
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading.users) return <div className="loading">Loading users...</div>;
  if (error.users) return <div className="error">Error: {error.users}</div>;

  return (
    <div className="user-list-container">
      <div className="user-list-header">
        <h2>User List </h2>
        
        <div className="pagination-info">
          Showing {indexOfFirstUser + 1}-{Math.min(indexOfLastUser, sortedUsers.length)} of {sortedUsers.length}
        </div>
      </div>
      
      <div className="table-responsive">
        <table className="user-table">
          <thead>
            <tr>
             <th onClick={() => requestSort('name')} className="sortable-header">
                Name{getSortIndicator('name')}
              </th>
              <th onClick={() => requestSort('email')} className="sortable-header">
                Email{getSortIndicator('email')}
              </th>
              <th>Phone</th>
              <th>Date of Birth</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map(user => (
              <tr key={user.login.uuid}>
                <td className="user-info-cell">
                    <div className="user-avatar-name">
                      <img 
                        src={user.picture.thumbnail} 
                        alt={`${user.name.first} ${user.name.last}`} 
                        className="user-avatar"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/50';
                        }}
                      />
                      <span className="user-name">{`${user.name.first} ${user.name.last}`}</span>
                    </div>
                  </td>

                    <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{formatDateOfBirth(user.dob?.date)}</td>
                <td className="address-cell">
                  {formatAddress(user.location)}
                  <div className="address-tooltip">
                    {formatAddress(user.location)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button 
          onClick={() => paginate(currentPage - 1)} 
          disabled={currentPage === 1}
          className="pagination-button"
        >
          Previous
        </button>
        
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={`pagination-button ${currentPage === number ? 'active' : ''}`}
          >
            {number}
          </button>
        ))}
        
        <button 
          onClick={() => paginate(currentPage + 1)} 
          disabled={currentPage === totalPages}
          className="pagination-button"
        >
          Next
        </button>
      </div>
    </div>
  );
});

export default UserList;

