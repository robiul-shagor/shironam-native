import axios from "axios";
import { Alert } from "react-native";

const api = axios.create({
    baseURL: "https://apps.shironam.live/v1/",
    withCredentials: false
});

// Response interceptor
api.interceptors.response.use(
    (response) => {
        // You can modify the response data here
        return response;
    },
    (error) => {
        // Handle response error

        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            // Alert.alert(
            //     "Something went wrong",
            //     "News has an error.",
            //     [{ text: "OK" }]
            // );
        } else if (error.request) {
            // The request was made but no response was received
            Alert.alert(
                "Request error",
                "Server is offline.",
                [{ text: "OK" }]
            );
        } else {
            // Something happened in setting up the request that triggered an Error
            // Display an alert for general network errors in React Native
            Alert.alert(
                "Network error",
                "Please check your internet connection.",
                [{ text: "OK" }]
            );
        }

        return Promise.reject(error);
    }
);

export default api;
