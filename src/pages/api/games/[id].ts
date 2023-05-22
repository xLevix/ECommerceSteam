import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const {
        query: { id },
    } = req

    const gameId = Array.isArray(id) ? id[0] : id;

    if (!gameId) {
        res.status(400).json({ message: "Bad request" });
        return;
    }

    try {
        const game = await axios.get(`https://store.steampowered.com/api/appdetails?appids=${gameId}&l=english`)
        if (game.data[gameId] && game.data[gameId].success) {
            res.status(200).json(game.data[gameId].data)
        } else {
            res.status(404).json({ message: "Game not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "An error occurred." })
    }
}
