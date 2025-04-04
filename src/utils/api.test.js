import { fetchUsers } from './Api';

jest.mock('./Api');

describe('API Functions', () => {
  test('fetchUsers returns expected data', async () => {
    const mockUsers = [{ id: 1, name: 'John Doe' }];
    fetchUsers.mockResolvedValue(mockUsers);
    
    const result = await fetchUsers();
    expect(result).toEqual(mockUsers);
    expect(fetchUsers).toHaveBeenCalledTimes(1);
  });
});