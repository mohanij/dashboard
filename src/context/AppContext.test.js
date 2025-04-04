import React from 'react';
import { render, screen } from '@testing-library/react';
import { AppProvider, AppContext } from './AppContext';

describe('AppContext', () => {
  test('provides initial state', () => {
    const TestComponent = () => {
      const { users } = React.useContext(AppContext);
      return <div>{users.length} users</div>;
    };

    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    expect(screen.getByText('0 users')).toBeInTheDocument();
  });
});