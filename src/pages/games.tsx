import axios from 'axios';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface GameDetails {
    header_image: string;
    name: string;
    short_description: string;
    // ... other properties
}

interface Game {
    _id: string;
    appid: string;
    details: GameDetails;
    // ... other properties
}

const Games = () => {
    const [games, setGames] = useState<Game[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchGames = async () => {
            const res = await axios.get('/api/games', { params: { userId: 'yourUserId' } });
            setGames(res.data.data);
        }

        fetchGames();
    }, []);

    return (
        <div>
            {games.map((game: Game) => (
                <div key={game._id}>
                    <img src={game.details.header_image} onClick={() => router.push(`/games/${game.appid}`)} />
                    <h2>{game.details.name}</h2>
                </div>
            ))}
        </div>
    );
}

export default Games;
