import { renderHook, act } from '@testing-library/react-hooks';
import { AppProvider } from '../context/AppContext';
import { useFetchUsers } from './useFetchUsers';

describe('useFetchUsers Hook', () => {
  test('sets loading state initially', async () => {
    const wrapper = ({ children }) => (
      <AppProvider>{children}</AppProvider>
    );
    
    const { result, waitForNextUpdate } = renderHook(() => useFetchUsers(), { wrapper });
    
    expect(result.current.context.loading.users).toBe(true);
    await waitForNextUpdate();
  });
});