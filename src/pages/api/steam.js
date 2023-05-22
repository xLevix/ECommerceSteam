import axios from 'axios';

export default async function handler(req, res) {
    try {
        const response = await axios.get('https://store.steampowered.com/api/featured/featured_win');
        const data = response.data;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching data from Steam API' });
    }
}
