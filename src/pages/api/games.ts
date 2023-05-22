import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { connectToDatabase } from '@/utils/db';

const handler = nc<NextApiRequest, NextApiResponse>()
    .get(async (req, res) => {
        const { db } = await connectToDatabase();
        const name = req.query.name as string;

        if (!name) {
            return res.status(400).json({ success: false, message: 'Invalid name parameter' });
        }

        const games = await db.collection('Apps').find({ name: new RegExp(name, 'i') }).toArray();
        res.status(200).json({ success: true, data: games });
    });

export default handler;
