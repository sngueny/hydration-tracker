export const API_URL = process.env.NODE_ENV === 'development' 
  ? '/api' 
  : process.env.NEXT_PUBLIC_API_URL;

export const fetchApi = async (endpoint: string, options = {}) => {
  const response = await fetch(`${API_URL}${endpoint}`, options);
  return response.json();
};