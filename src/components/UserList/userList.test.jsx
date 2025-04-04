import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AppProvider } from '../../context/AppContext';
import UserList from './userList.jsx';

const mockUsers = [
  {
    login: { uuid: '1' },
    name: { first: 'John', last: 'Doe' },
    email: 'john@example.com',
    picture: { thumbnail: 'https://example.com/john.jpg' },
    dob: { date: '1990-01-01T00:00:00Z' },
    location: {
      street: { number: 123, name: 'Main St' },
      city: 'New York',
      state: 'NY',
      country: 'USA'
    }
  }
];

describe('UserList Component', () => {
  test('renders loading state', () => {
    render(
      <AppProvider value={{ loading: { users: true } }}>
        <UserList />
      </AppProvider>
    );
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test('renders error state', () => {
    const errorMsg = 'Failed to load users';
    render(
      <AppProvider value={{ error: { users: errorMsg } }}>
        <UserList />
      </AppProvider>
    );
    expect(screen.getByText(errorMsg)).toBeInTheDocument();
  });

  test('renders user data', () => {
    render(
      <AppProvider value={{ users: mockUsers, sortedUsers: mockUsers }}>
        <UserList />
      </AppProvider>
    );
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  test('sorts by name when header clicked', () => {
    const requestSort = jest.fn();
    render(
      <AppProvider value={{ 
        users: mockUsers, 
        sortedUsers: mockUsers,
        requestSort,
        sortConfig: { key: 'name', direction: 'asc' }
      }}>
        <UserList />
      </AppProvider>
    );
    
    fireEvent.click(screen.getByText(/name/i));
    expect(requestSort).toHaveBeenCalledWith('name');
  });
});