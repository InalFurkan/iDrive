
const fetch = require('node-fetch');

// .env dosyasından yüklenen ortam değişkenlerini kullan
const API_USERNAME = process.env.API_USERNAME;
const API_PASSWORD = process.env.API_PASSWORD;
const BASE_URL = process.env.BASE_URL;

// Temel Authorization başlığını oluştur
const getAuthorizationHeader = () => {
    if (!API_USERNAME || !API_PASSWORD) {
        throw new Error('API credentials are not defined in .env file');
    }
    return `Basic ${Buffer.from(`${API_USERNAME}:${API_PASSWORD}`).toString('base64')}`;
};

// API'ye istek yapmak için merkezi fonksiyon
const apiRequest = async (endpoint, options = {}) => {
    const url = `${BASE_URL}${endpoint}`;
    
    const defaultHeaders = {
        'Content-Type': 'application/json',
        'Authorization': getAuthorizationHeader(),
    };

    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };

    try {
        const response = await fetch(url, config);
        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`API request failed with status ${response.status}: ${errorData}`);
        }
        return response.json();
    } catch (error) {
        console.error(`API request to ${url} failed:`, error);
        throw error;
    }
};

const apiRequestRaw = async (endpoint, options = {}) => {
    const url = `${BASE_URL}${endpoint}`;
    
    const defaultHeaders = {
        'Authorization': getAuthorizationHeader(),
    };

    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };

    try {
        const response = await fetch(url, config);
        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`API request failed with status ${response.status}: ${errorData}`);
        }
        return response;
    } catch (error) {
        console.error(`API request to ${url} failed:`, error);
        throw error;
    }
};

module.exports = {
    apiRequest,
    apiRequestRaw,
    BASE_URL
};
