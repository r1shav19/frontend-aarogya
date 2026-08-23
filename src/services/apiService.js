/**
 * API Service for AarogyaNet Backend
 * Endpoint: https://aarogya-backend-production.up.railway.app/api/hospitals
 */

const API_BASE_URL = 'https://aarogya-backend-production.up.railway.app/api';

export const fetchHospitalsData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/hospitals`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data, source: 'live' };
  } catch (error) {
    console.warn('Live API fetch error, falling back to local cached seed:', error);
    return { 
      success: false, 
      error: error.message, 
      source: 'fallback' 
    };
  }
};
