import axios from "axios";


export const api = axios.create({
    baseURL: 'https://api.clarifai.com',
    headers: {
        Authorization: 'Key 3147ec69e0ad4085b2d0c06b75a8a488'
    }
})