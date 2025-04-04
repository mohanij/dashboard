export const fetchUsers = async () => {
    const response = await fetch('https://randomuser.me/api/?results=50&nat=us');
    if (!response.ok) throw new Error('Failed to fetch users');
    const data = await response.json();
    return data.results;
  };
  
  export const fetchAnalytics = async () => {
    const response = await fetch('https://api.coingecko.com/api/v3/exchange_rates');
    if (!response.ok) throw new Error('Failed to fetch analytics');
    return await response.json();;
  };