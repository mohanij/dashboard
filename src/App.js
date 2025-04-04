import React, { lazy, Suspense, useState } from 'react';
import { AppProvider } from './context/AppContext';
import { useFetchUsers } from './hooks/useFetchUsers';
import { useFetchAnalytics } from './hooks/useFetchAnalytics';
import './App.css';

const UserList = lazy(() => import('./components/UserList/userList.jsx'));
const PerformanceChart = lazy(() => import('./components/PerformanceChart/performanceChart.jsx'));
const SearchBar = lazy(() => import('./components/searchBar/searchBar.jsx'));

const App = () => {
  useFetchUsers();
  useFetchAnalytics();
  
  const [activeTab, setActiveTab] = useState('users'); 

  return (
    <AppProvider>
      <div className="app-container">
        <h1>Creative Dashboard</h1>
        
        
        <div className="dashboard-tabs">
          <button
            className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            User Management
          </button>
          <button
            className={`tab-button ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics Dashboard
          </button>
        </div>

        <Suspense fallback={<div>Loading components...</div>}>
          {activeTab === 'users' ? (
            <div className="tab-content">
              
              <div className="dashboard-content">
                <Suspense fallback={<div>Loading user list...</div>}>
                <SearchBar />
                  <UserList />
                </Suspense>
              </div>
            </div>
          ) : (
            <div className="tab-content">
              <Suspense fallback={<div>Loading performance chart...</div>}>
                <PerformanceChart />
              </Suspense>
            </div>
          )}
        </Suspense>
      </div>
    </AppProvider>
  );
};

export default App;