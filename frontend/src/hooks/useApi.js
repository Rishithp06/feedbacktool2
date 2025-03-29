// src/hooks/useApi.js
import { useState, useEffect } from 'react';

/**
 * A custom hook for making API calls.
 * @param {Function} apiFunction - The API function to call.
 * @param {Array} dependencies - Dependencies array for useEffect.
 * @returns {Object} - { data, error, loading } state values.
 */
const useApi = (apiFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    apiFunction()
      .then((response) => {
        if (isMounted) setData(response);
      })
      .catch((err) => {
        if (isMounted) setError(err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return { data, error, loading };
};

export default useApi;
