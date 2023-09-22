import React, { useEffect, useState  } from 'react'
import axios from '../api/axios'

export default function NonUserQuery(query) {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [news, setNews] = useState([])

    useEffect(() => {
        setNews([])
    }, [query])

    useEffect(() => {
        setLoading(true);
        setError(false);
    
        const fetchData = async () => {
          try {
            const response = await axios.get('/news-list-without-authentication', {});
            setNews(response.data.data);
            setLoading(false);
          } catch (error) {
            setError(true);
          }
        };
    
        fetchData();
    
    }, [query]);

    return { loading, error, news }
}