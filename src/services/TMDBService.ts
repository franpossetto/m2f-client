import axios from 'axios';
import { MediaType } from '../types/MediaType';


class TMDBService {
    baseUrl: string = "https://api.themoviedb.org/3";
    apiKey: string = import.meta.env.VITE_TMDB_API_KEY;

    async search(movieName: string, type: MediaType): Promise<any>{
        try {
            const response = await axios.get(`${this.baseUrl}/search/${MediaType[type]}/?api_key=${this.apiKey}&query=${movieName}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async getDetails(id: number, type: MediaType): Promise<any>{
        try {
            const response = await axios.get(`${this.baseUrl}/${MediaType[type]}/${id}?api_key=${this.apiKey}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    
}

export default new TMDBService();