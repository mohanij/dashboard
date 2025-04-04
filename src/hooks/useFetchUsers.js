import { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { fetchUsers } from '../utils/Api';

export const useFetchUsers = () => {
  const { setUsers, setLoading, setError } = useAppContext();

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(prev => ({ ...prev, users: true }));
        const usersData = await fetchUsers();
       setUsers(usersData);
      } catch (err) {
        setError(prev => ({ ...prev, users: err.message }));
      } finally {
        setLoading(prev => ({ ...prev, users: false }));
      }
    };

    loadUsers();
  }, [setUsers, setLoading, setError]);
};