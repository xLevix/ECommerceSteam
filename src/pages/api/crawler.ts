import { NextApiRequest, NextApiResponse } from "next";

async function fetchGame(id: string) {
    return fetch(`https://ecommerce-steam.vercel.app/api/games/${id}`)
        .then((response) => response.json());
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const { id } = req.query;

        const game = await fetchGame(id as string);

        //make request with price to /api/convertUSD body
        const price = await fetch(`https://ecommerce-steam.vercel.app/api/convertUSD`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: game.price_overview.final/100,
            }),
        }).then((response) => response.json());

        if (!game) {
            res.status(404).json({ message: "Game not found" });
            return;

        }

        res.status(200).json({
            id: game.steam_appid,
            price: price.convertedAmount,
            url: `https://ecommerce-steam.vercel.app/api/game/${id}`,
            customFields: [],
        });
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
