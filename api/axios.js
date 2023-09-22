import axios from "axios";

const api = axios.create({
    baseURL: "https://api.shironam.live/v1/",
    withCredentials: false
});

export default api;