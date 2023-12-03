import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/auth';
import { useRouter } from 'expo-router'

export default function UserQuery(query, pageNumber, type) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [news, setNews] = useState([]);
    const [ maxPage, setMaxPage ] = useState('');
    const [noMore, setNoMore] = useState(false);
    const router = useRouter();

    const { user, logOut } = useAuth();

    const fetchNewsList = async () => {
        if (user?.token) {
            const config = {
              headers: {
                'Authorization': `Bearer ${user.token}`
              }
            };

            try {
                let totalPosts, maxPage;
                switch (type) {
                    case 'category':
                        totalPosts = await axios.get(`/news-feed-info?category=${query}`, config)
                        break;                    
                    case 'no_filter':
                        totalPosts = await axios.get(`/news-feed-info?category=${query}&no_filter=1`, config)
                        break;
                    case 'subcategory':
                        totalPosts = await axios.get(`/news-feed-info?sub_category=${query}`, config)
                        break;
                    case 'tags':
                        totalPosts = await axios.get(`/news-feed-info?tag=${query}`, config)
                        break;
                    case 'breaking':
                        totalPosts = await axios.get('/news-feed-info?breaking_news=1', config);
                        break;
                    case 'today':
                        totalPosts = await axios.get('/news-feed-info?today_news=1', config);
                        break;
                    default:
                        totalPosts = await axios.get('/news-feed-info', config);
                        break;
                }

                maxPage = totalPosts.data.max_paginate ?? 0;

                setMaxPage(maxPage);

                // Response Query
                let response;
                switch (type) {
                    case 'category':
                        response = await axios.get(`/news-list?paginate=${pageNumber}&category=${query}`, config);
                        break;               
                    case 'no_filter':
                        response = await axios.get(`/news-list?paginate=${pageNumber}&no_filter=1&category=${query}`, config);
                        break;
                    case 'subcategory':
                        response = await axios.get(`/news-list?paginate=${pageNumber}&sub_category=${query}`, config);
                        break;
                    case 'tags':
                        response = await axios.get(`/news-list?paginate=${pageNumber}&tag=${query}`, config);
                        break;
                    case 'breaking':
                        response = await axios.get(`/news-list?paginate=${pageNumber}&breaking_news=1`, config);
                        break;
                    case 'today':
                        response = await axios.get(`/news-list?paginate=${pageNumber}&today_news=1`, config);
                        break;
                    default:
                        response = await axios.get(`/news-list?paginate=${pageNumber}`, config);
                        break;
                }

                setNews(prevItems => {
                    const existingIds = new Set(prevItems.map(item => item.id));
                    const uniqueItems = response.data.filter(item => !existingIds.has(item.id));
                    const updatedNews = [...prevItems, ...uniqueItems];
                    return updatedNews;
                });

                setLoading(false);
                setNoMore(response.data.length == 0);

            } catch (e) {
                if (e.response && e.response.status === 429) {
                    setLoading(true);
                    setTimeout(() => {
                        setLoading(true);
                        setError(false);
                        fetchNewsList();
                    }, 5000);
                } else if(e.response && e.response.status === 500) {
                    setLoading(true);
                    setTimeout(() => {
                        setLoading(true);
                        setError(false);
                        fetchNewsList();
                    }, 5000);
                } else if(e.response?.data?.message === 'Unauthenticated.' ) {
                    logOut();
                    router.push('/home');
                } else {
                    setError(true);
                    setLoading(false);
                }
            }
        }
    }

    useEffect(() => {
        setNews([])
    }, [query, type])

    useEffect(() => {
        setLoading(true);
        setError(false);

        fetchNewsList();
    }, [query, pageNumber, type]);

    return { loading, error, news, maxPage, noMore };
}