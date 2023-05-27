import React, { useState } from 'react';
import { Input, Button, SimpleGrid} from '@mantine/core';
import {ImageCard} from '../components/ImageCard';
import {checkAuth} from '../components/auth';
import {SteamProfile} from "../lib/passport";

function SearchPage({user}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [games, setGames] = useState([]);

    const handleSearch = async () => {
        setSearchTerm(searchTerm.replace(' ', '%20'));
        const res = await fetch(`/api/games?name=${searchTerm}`);
        const data = await res.json();
        const games = data.data;
        const gamesWithDetails = await Promise.all(
            games.map(async (game) => {
                const steamRes = await fetch(`/api/games/${game.appid}`);
                const steamData = await steamRes.json();
                if (steamData.price_overview && steamData.price_overview.final_formatted) {
                    const currencyRes = await fetch('/api/convert', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ amount: steamData.price_overview.final / 100 }),
                    });

                    const { convertedAmount } = await currencyRes.json();
                    return {
                        ...game,
                        header_image: steamData.header_image || '',
                        price: (convertedAmount*1.5).toFixed(2) + ' PLN',
                    };
                }else{
                    return {
                        ...game,
                        header_image: steamData.header_image || '',
                        price: 'Unavailable'
                    };
                }
            })
        );

        setGames(gamesWithDetails);
    };

    return (
        <div>
            <Input
                placeholder="Search games..."
    value={searchTerm}
    onChange={(event) => setSearchTerm(event.currentTarget.value)}
    />
    <Button onClick={handleSearch}>Search</Button>

            <SimpleGrid cols={4} spacing="lg" style={{ marginTop: '20px' }}>
                {games.map((game) =>
                        game && (
                            <div key={game._id}>
                                <ImageCard
                                    link={`/games/${game.appid}`}
                                    image={game.header_image}
                                    title={game.name}
                                    price={game.price}  // Cena jest teraz stringiem
                                />
                            </div>
                        )
                )}
            </SimpleGrid>

    </div>
);
}

export const getServerSideProps = checkAuth;
export default SearchPage;
