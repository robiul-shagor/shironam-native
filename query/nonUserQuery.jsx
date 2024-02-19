import React, { useCallback, useEffect, useState, useMemo  } from 'react'
import axios from '../api/axios'

export default function NonUserQuery(query) {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [news, setNews] = useState([])

    useEffect(() => {
      setNews([])
    }, [query])

    const fetchData = useCallback(async () => {
      setNews( undefined );
      try {
        const response = await axios.get('/news-list-without-authentication', {});
        const data = response.data.data;
        
        await new Promise(resolve => setTimeout(resolve, 5000));

        setNews(data);
        setLoading(false);
      } catch (error) {
        setError(true);
      }
    }, []);

    
    useEffect(() => {
      setLoading(true);
      setError(false);
  
      fetchData();
    }, [query]);

    return { loading, error, news }
}