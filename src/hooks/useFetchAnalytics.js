import { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { fetchAnalytics } from '../utils/Api';

export const useFetchAnalytics = () => {
  const { setAnalytics, setLoading, setError } = useAppContext();
  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(prev => ({ ...prev, analytics: true }));
        const analyticsData = await fetchAnalytics();
        setAnalytics(analyticsData);
      } catch (err) {
        setError(prev => ({ ...prev, analytics: err.message }));
      } finally {
        setLoading(prev => ({ ...prev, analytics: false }));
      }
    };

    loadAnalytics();
  }, [setAnalytics, setLoading, setError]);
};